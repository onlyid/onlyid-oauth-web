import React, { PureComponent } from "react";
import { Alert } from "@material-ui/lab";
import styles from "./index.module.css";
import AvatarUpload from "components/AvatarUpload";
import {
    Button,
    FormControl,
    FormHelperText,
    Input,
    InputAdornment,
    MenuItem,
    Select
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import RegionInput from "components/RegionInput";
import { connect } from "react-redux";
import { GENDER_TEXT, REG_EXP } from "my/constants";
import Validator from "async-validator";
import { withRouter } from "react-router-dom";

const RULES = {
    nickname: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    mobile: { pattern: REG_EXP.mobile, message: "手机号格式不正确" },
    email: [
        { max: 50, message: "最多输入50字" },
        { type: "email", message: "邮箱格式不正确" }
    ],
    bio: [{ max: 200, message: "最多输入200字" }]
};

class Review extends PureComponent {
    state = {
        validation: {
            nickname: {},
            mobile: {},
            email: {},
            bio: {}
        },
        avatarRequiredVisible: false
    };

    next = async () => {
        const {
            dispatch,
            app: { avatarUrl },
            filename,
            nickname,
            mobile,
            email,
            bio,
            onNext
        } = this.props;
        const { validation } = this.state;

        if (!filename && !avatarUrl) {
            this.setState({ avatarRequiredVisible: true });
            return;
        }

        try {
            const values = { nickname, mobile, email, bio };
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        onNext();
        dispatch({ type: "app", nickname });
    };

    onChange = ({ target }) => {
        const { onChange } = this.props;

        onChange([target.name], target.value);
    };

    validateField = async ({ target: { name: key, value } }) => {
        const { validation } = this.state;
        try {
            await new Validator({ [key]: RULES[key] }).validate({ [key]: value }, { first: true });
            validation[key] = {};
        } catch ({ errors }) {
            validation[key] = { text: errors[0].message, error: true };
        }
        this.setState({ validation: { ...validation } });
    };

    back = () => {
        const { history } = this.props;

        history.goBack();
    };

    onUpload = filename => {
        const { onChange } = this.props;

        onChange("filename", filename);
        this.setState({ avatarRequiredVisible: false });
    };

    render() {
        const {
            app: { account, client },
            onChange,
            nickname,
            mobile,
            email,
            gender,
            birthDate,
            region,
            bio
        } = this.props;
        const { validation, avatarRequiredVisible } = this.state;

        return (
            <div>
                <Alert severity="info" className={styles.tipBox} icon={false}>
                    <p>
                        「{client.name}
                        」支持用唯ID登录，和微信、微博登录一样，用唯ID也可以登录各种网站、APP。
                        你的账号已导入，设置密码即可使用。
                    </p>
                </Alert>
                <AvatarUpload onUpload={this.onUpload} requiredVisible={avatarRequiredVisible} />
                <form className={styles.form1}>
                    <FormControl fullWidth error={validation.nickname.error}>
                        <Input
                            name="nickname"
                            onChange={this.onChange}
                            onBlur={this.validateField}
                            value={nickname || ""}
                            startAdornment={
                                <InputAdornment position="start" className={styles.required}>
                                    昵称
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>{validation.nickname.text}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={validation.mobile.error}>
                        <Input
                            name="mobile"
                            onChange={this.onChange}
                            startAdornment={
                                <InputAdornment position="start">手机号</InputAdornment>
                            }
                            onBlur={this.validateField}
                            value={mobile || ""}
                            disabled={account === mobile}
                            type="tel"
                        />
                        <FormHelperText>{validation.mobile.text}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={validation.email.error}>
                        <Input
                            name="email"
                            onChange={this.onChange}
                            startAdornment={<InputAdornment position="start">邮箱</InputAdornment>}
                            onBlur={this.validateField}
                            value={email || ""}
                            disabled={account === email}
                            type="email"
                        />
                        <FormHelperText>{validation.email.text}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                        <Select
                            name="gender"
                            value={gender || ""}
                            onChange={this.onChange}
                            startAdornment={<InputAdornment position="start">性别</InputAdornment>}
                        >
                            {Object.keys(GENDER_TEXT).map(key => (
                                <MenuItem value={key} key={key}>
                                    {GENDER_TEXT[key]}
                                </MenuItem>
                            ))}
                            <MenuItem value="" key="empty">
                                暂不设置
                            </MenuItem>
                        </Select>
                        <FormHelperText />
                    </FormControl>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                            clearLabel="暂不设置"
                            cancelLabel="取 消"
                            okLabel={null}
                            fullWidth
                            name="date-picker"
                            format="YYYY-MM-DD"
                            value={birthDate}
                            onChange={date => onChange("birthDate", date)}
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
                    <RegionInput value={region} onChange={value => onChange("region", value)} />
                    <FormControl fullWidth error={validation.bio.error}>
                        <Input
                            name="bio"
                            onChange={this.onChange}
                            startAdornment={<InputAdornment position="start">简介</InputAdornment>}
                            onBlur={this.validateField}
                            value={bio || ""}
                            multiline
                        />
                        <FormHelperText>{validation.bio.text}</FormHelperText>
                    </FormControl>
                    <div style={{ marginTop: "1.5rem" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.next}
                            size="large"
                        >
                            下 一 步
                        </Button>
                    </div>
                </form>
                <div className="oneButtonBox">
                    <Button key="back" variant="outlined" onClick={this.back} size="small">
                        取 消
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Review));
