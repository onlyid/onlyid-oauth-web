import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./SignUp.module.css";
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";
import Validator from "async-validator";
import http from "my/http";
import AvatarUpload from "components/AvatarUpload";
import { redirectCode } from "my/utils";
import { Edit } from "@material-ui/icons";
import RememberMe from "components/RememberMe";
import { NEW_PASSWORD_RULE } from "my/constants";

const RULES = {
    nickname: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    otp: [{ required: true, message: "请输入" }],
    password: NEW_PASSWORD_RULE
};

class SignUp extends PureComponent {
    state = {
        validation: {
            nickname: { helperText: null, isError: false },
            otp: { helperText: null, isError: false },
            password: { helperText: null, isError: false }
        },
        otp: null,
        password: null,
        nickname: null,
        filename: null,
        keepLoggedIn: false
    };

    onSubmit = async e => {
        e.preventDefault();

        const { filename, nickname, otp, password, keepLoggedIn } = this.state;
        const {
            app: { client, account },
            location: { search }
        } = this.props;

        // 校验表单
        const values = await Promise.all([
            await this.validateField("nickname"),
            await this.validateField("otp"),
            await this.validateField("password")
        ]);
        if (values.includes(false)) return;

        const { authorizationCode } = await http.post("oauth/sign-up", {
            filename,
            nickname,
            account,
            otp,
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
        const { validation, keepLoggedIn } = this.state;

        return (
            <div className={styles.root}>
                <Alert severity="info" className={styles.tipBox} icon={false}>
                    <p>
                        「{client.name}
                        」支持用唯ID登录，和微信、微博登录一样，用唯ID也可以登录各种网站、APP。
                        新用户请先完成账号注册。
                    </p>
                </Alert>
                <AvatarUpload onChange={value => this.onChange("filename", value)} />
                <div className="accountBox">
                    <Button
                        startIcon={<Edit />}
                        size="large"
                        variant="outlined"
                        onClick={this.back}
                    >
                        {account}
                    </Button>
                </div>
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }} className="form1">
                    <FormControl variant="outlined" fullWidth error={validation.nickname.isError}>
                        <InputLabel htmlFor="nickname">昵称</InputLabel>
                        <OutlinedInput
                            id="nickname"
                            type="text"
                            onChange={({ target: { value } }) => this.onChange("nickname", value)}
                            label="昵称"
                            onBlur={() => this.validateField("nickname")}
                        />
                        <FormHelperText>{validation.nickname.helperText}</FormHelperText>
                    </FormControl>
                    <OtpInput
                        error={validation.otp.isError}
                        onChange={({ target: { value } }) => this.onChange("otp", value)}
                        helperText={validation.otp.helperText}
                        recipient={account}
                        clientId={client.id}
                        onBlur={() => this.validateField("otp")}
                    />
                    <PasswordInput
                        error={validation.password.isError}
                        onChange={({ target: { value } }) => this.onChange("password", value)}
                        helperText={validation.password.helperText || "设置密码，方便下次登录"}
                        onBlur={() => this.validateField("password")}
                        autoComplete="new-password"
                    />
                    {client.type !== "APP" && (
                        <RememberMe
                            style={{ marginTop: "0.5rem" }}
                            onChange={this.onCheckBoxChange}
                            checked={keepLoggedIn}
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
                            注册并登录
                        </Button>
                    </div>
                </form>
                <div className="oneButtonBox">
                    <Button variant="outlined" onClick={this.back} size="small">
                        取 消
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(SignUp));
