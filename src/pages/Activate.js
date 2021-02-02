import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./Activate.module.css";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Input,
    InputAdornment,
    MenuItem,
    Select
} from "@material-ui/core";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";
import Validator from "async-validator";
import http from "my/http";
import AvatarUpload from "components/AvatarUpload";
import { redirectCode } from "my/utils";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import LocationInput from "components/LocationInput";
import { DATE_FORMAT, GENDER_TEXT, REG_EXP } from "my/constants";
import IconAndAvatar from "components/IconAndAvatar";

const RULES = {
    nickname: [
        { required: true, message: "请输入" },
        { max: 50, message: "最多输入50字" }
    ],
    mobile: [
        { max: 50, message: "最多输入50字" },
        { pattern: REG_EXP.mobile, message: "手机号格式不正确" }
    ],
    email: [
        { max: 50, message: "最多输入50字" },
        { type: "email", message: "邮箱格式不正确" }
    ],
    bio: [{ max: 500, message: "最多输入500字" }],
    otpSms: [{ required: true, message: "请输入" }],
    otpEmail: [{ required: true, message: "请输入" }],
    password: [
        { required: true, message: "请输入" },
        { min: 6, message: "密码最少要输入6位" },
        { max: 50, message: "最多输入50字" }
    ]
};

class Activate extends PureComponent {
    state = {
        validation: {
            nickname: { helperText: null, isError: false },
            mobile: { helperText: null, isError: false },
            email: { helperText: null, isError: false },
            bio: { helperText: null, isError: false },
            otpSms: { helperText: null, isError: false },
            otpEmail: { helperText: null, isError: false },
            password: { helperText: null, isError: false }
        },
        filename: null,
        nickname: null,
        mobile: null,
        email: null,
        gender: null,
        birthday: null,
        location: null,
        bio: null,
        otpSms: null,
        otpEmail: null,
        password: null,
        keepLoggedIn: false,
        step: 1 // 1 检查账号 2 设置密码
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            app: { userId },
            dispatch
        } = this.props;

        const {
            avatarUrl,
            nickname,
            mobile,
            email,
            gender,
            birthday,
            location,
            bio
        } = await http.get(`oauth/users/2b-activated/${userId}`);
        this.setState({
            nickname,
            mobile,
            email,
            gender,
            birthday,
            location,
            bio
        });
        dispatch({ type: "app/save", payload: { avatarUrl } });
    };

    onSubmit = async e => {
        e.preventDefault();

        const {
            filename,
            nickname,
            mobile,
            email,
            gender,
            birthday,
            location,
            bio,
            otpSms,
            otpEmail,
            password,
            keepLoggedIn
        } = this.state;
        const {
            app: { client, userId },
            location: { search }
        } = this.props;

        // 校验表单
        const validateResult = [];
        if (mobile) validateResult.push(await this.validateField("otpSms"));

        if (email) validateResult.push(await this.validateField("otpEmail"));

        validateResult.push(await this.validateField("password"));

        if (validateResult.includes(false)) return;

        const { authorizationCode } = await http.post("oauth/activate-account", {
            userId,
            filename,
            nickname,
            mobile,
            email,
            gender: gender || null,
            birthday: birthday && birthday.format(DATE_FORMAT),
            location: location || null,
            bio,
            otpSms,
            otpEmail,
            password,
            clientId: client.id,
            keepLoggedIn
        });

        redirectCode(client, search, authorizationCode);
    };

    validateField = async key => {
        const { [key]: value, validation } = this.state;
        try {
            const validator = new Validator({ [key]: RULES[key] });
            await validator.validate({ [key]: value });

            validation[key].helperText = null;
            validation[key].isError = false;
            return true;
        } catch ({ errors }) {
            validation[key].helperText = errors[0].message;
            validation[key].isError = true;
            return false;
        } finally {
            this.setState({ validation: { ...validation } });
        }
    };

    back = () => {
        const { history } = this.props;

        history.goBack();
    };

    prev = () => {
        this.setState({ step: 1 });
    };

    next = async () => {
        const { dispatch } = this.props;
        const { nickname } = this.state;

        // 校验表单
        const values = await Promise.all([
            await this.validateField("nickname"),
            await this.validateField("mobile"),
            await this.validateField("email"),
            await this.validateField("bio")
        ]);
        if (values.includes(false)) return;

        this.setState({ step: 2 });
        dispatch({ type: "app/save", payload: { nickname } });
    };

    onChange = (key, value) => {
        this.setState({ [key]: value });
    };

    onCheckBoxChange = event => {
        this.setState({ keepLoggedIn: event.target.checked });
    };

    render() {
        const {
            app: { account, client }
        } = this.props;
        const {
            nickname,
            mobile,
            email,
            gender,
            birthday,
            location,
            bio,
            validation,
            keepLoggedIn,
            step
        } = this.state;

        const genderItems = Object.keys(GENDER_TEXT).map(key => (
            <MenuItem value={key} key={key}>
                {GENDER_TEXT[key]}
            </MenuItem>
        ));
        genderItems.push(
            <MenuItem value="" key="clear">
                暂不设置
            </MenuItem>
        );

        const step1Content = (
            <>
                <AvatarUpload onChange={value => this.onChange("filename", value)} />
                <form onSubmit={this.next} className={styles.form1}>
                    <FormControl fullWidth error={validation.nickname.isError}>
                        <Input
                            id="nickname"
                            onChange={({ target: { value } }) => this.onChange("nickname", value)}
                            onBlur={() => this.validateField("nickname")}
                            value={nickname || ""}
                            startAdornment={
                                <InputAdornment
                                    position="start"
                                    className={styles.requiredAsterisk}
                                >
                                    昵称
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>{validation.nickname.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={validation.mobile.isError}>
                        <Input
                            id="mobile"
                            onChange={({ target: { value } }) => this.onChange("mobile", value)}
                            startAdornment={
                                <InputAdornment position="start">手机号</InputAdornment>
                            }
                            onBlur={() => this.validateField("mobile")}
                            value={mobile || ""}
                            disabled={account === mobile}
                        />
                        <FormHelperText>{validation.mobile.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={validation.email.isError}>
                        <Input
                            id="email"
                            onChange={({ target: { value } }) => this.onChange("email", value)}
                            startAdornment={<InputAdornment position="start">邮箱</InputAdornment>}
                            onBlur={() => this.validateField("email")}
                            value={email || ""}
                            disabled={account === email}
                        />
                        <FormHelperText>{validation.email.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                        <Select
                            id="gender"
                            value={gender || ""}
                            onChange={({ target: { value } }) => this.onChange("gender", value)}
                            startAdornment={<InputAdornment position="start">性别</InputAdornment>}
                        >
                            {genderItems}
                        </Select>
                        <FormHelperText />
                    </FormControl>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                            clearLabel="暂不设置"
                            cancelLabel="取 消"
                            okLabel={null}
                            fullWidth
                            id="date-picker"
                            format="YYYY-MM-DD"
                            value={birthday}
                            onChange={date => this.onChange("birthday", date)}
                            disableFuture
                            disableToolbar
                            openTo="year"
                            clearable
                            autoOk
                            style={{ paddingBottom: "0.2rem" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">生日</InputAdornment>
                                )
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <LocationInput
                        value={location || ""}
                        onChange={value => this.onChange("location", value)}
                    />
                    <FormControl fullWidth error={validation.bio.isError}>
                        <Input
                            id="bio"
                            onChange={({ target: { value } }) => this.onChange("bio", value)}
                            startAdornment={<InputAdornment position="start">简介</InputAdornment>}
                            onBlur={() => this.validateField("bio")}
                            value={bio || ""}
                            multiline
                        />
                        <FormHelperText>{validation.bio.helperText}</FormHelperText>
                    </FormControl>
                    <div style={{ marginTop: "1.5rem" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.next}
                            size="large"
                        >
                            检查无误，设置登录密码
                        </Button>
                    </div>
                </form>
                <div className="oneButtonBox">
                    <Button key="back" variant="outlined" onClick={this.back} size="small">
                        取 消
                    </Button>
                </div>
            </>
        );

        const step2Content = (
            <>
                <IconAndAvatar />
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }} className="form1">
                    {mobile && (
                        <OtpInput
                            error={validation.otpSms.isError}
                            onChange={({ target: { value } }) => this.onChange("otpSms", value)}
                            helperText={validation.otpSms.helperText || `手机号 ${mobile}`}
                            recipient={mobile}
                            clientId={client.id}
                            onBlur={() => this.validateField("otpSms")}
                            label="短信验证码"
                        />
                    )}
                    {email && (
                        <OtpInput
                            error={validation.otpEmail.isError}
                            onChange={({ target: { value } }) => this.onChange("otpEmail", value)}
                            helperText={validation.otpEmail.helperText || `邮箱 ${email}`}
                            recipient={email}
                            clientId={client.id}
                            onBlur={() => this.validateField("otpEmail")}
                            label="邮箱验证码"
                        />
                    )}
                    <PasswordInput
                        error={validation.password.isError}
                        onChange={({ target: { value } }) => this.onChange("password", value)}
                        helperText={validation.password.helperText || "设置密码，方便下次登录"}
                        onBlur={() => this.validateField("password")}
                        autoComplete="new-password"
                    />
                    {client.type !== "APP" && (
                        <FormControlLabel
                            style={{ marginTop: "0.5rem" }}
                            control={
                                <Checkbox onChange={this.onCheckBoxChange} checked={keepLoggedIn} />
                            }
                            label="记住我（保持登录一个月）"
                        />
                    )}
                    <div style={{ marginTop: "0.5rem" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.onSubmit}
                            size="large"
                        >
                            激活账号并登录
                        </Button>
                    </div>
                </form>
                <div className="oneButtonBox">
                    <Button key="prev" variant="outlined" onClick={this.prev} size="small">
                        上一步
                    </Button>
                </div>
            </>
        );

        return <div className={styles.root}>{step === 1 ? step1Content : step2Content}</div>;
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Activate));
