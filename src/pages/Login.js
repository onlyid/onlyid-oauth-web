import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import http from "my/http";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";
import Validator from "async-validator";
import IconAndAvatar from "components/IconAndAvatar";
import { Edit } from "@material-ui/icons";
import { redirectCode } from "my/utils";
import CaptchaDialog from "components/CaptchaDialog";
import withLayout from "components/MyLayout";

const RULES = [{ required: true, message: "请输入" }];

class Login extends PureComponent {
    state = {
        validation: {},
        inputValue: "",
        loginType: "password",
        captchaOpen: false
    };

    back = () => {
        const { history } = this.props;
        history.goBack();
    };

    onSubmit = async (e) => {
        e && e.preventDefault();

        const { inputValue, loginType } = this.state;
        const {
            app: { account, client },
            location: { search }
        } = this.props;

        if (!(await this.validateField())) return;

        const { authorizationCode, requireCaptcha } = await http.post("auth/login", {
            account,
            [loginType]: inputValue,
            clientId: client.id
        });

        if (requireCaptcha) {
            this.toggleCaptcha();
            return;
        }

        redirectCode(client, search, authorizationCode);
    };

    onChange = (e) => {
        this.setState({ inputValue: e.target.value });
    };

    validateField = async () => {
        const { inputValue } = this.state;
        let validation;
        try {
            const validator = new Validator({ inputValue: RULES });
            await validator.validate({ inputValue }, { first: true });
            validation = {};
            return true;
        } catch ({ errors }) {
            validation = { text: errors[0].message, error: true };
            return false;
        } finally {
            this.setState({ validation });
        }
    };

    toggleLoginType = () => {
        this.setState(({ loginType }) => ({
            loginType: loginType === "password" ? "otp" : "password"
        }));
    };

    resetPassword = () => {
        const {
            history,
            location: { search }
        } = this.props;
        history.push("/reset-password" + search);
    };

    toggleCaptcha = () => {
        this.setState(({ captchaOpen }) => ({ captchaOpen: !captchaOpen }));
    };

    render() {
        const { validation, loginType, captchaOpen } = this.state;
        const {
            app: { account, client }
        } = this.props;

        return (
            <div>
                <IconAndAvatar />
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
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }}>
                    {loginType === "password" ? (
                        <PasswordInput
                            error={validation.error}
                            onChange={this.onChange}
                            helperText={validation.text}
                            onBlur={this.validateField}
                        />
                    ) : (
                        <OtpInput
                            error={validation.error}
                            onChange={this.onChange}
                            helperText={validation.text}
                            recipient={account}
                            clientId={client.id}
                            onBlur={this.validateField}
                        />
                    )}
                    <div style={{ marginTop: 20 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.onSubmit}
                            size="large"
                        >
                            登 录
                        </Button>
                    </div>
                </form>
                <div className="twoButtonBox">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={this.toggleLoginType}
                        size="small"
                    >
                        {loginType === "password" ? "验证码登录" : "密码登录"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={this.resetPassword}
                        size="small"
                        style={{ paddingRight: 3 }}
                    >
                        忘记密码？
                    </Button>
                </div>
                <CaptchaDialog
                    open={captchaOpen}
                    onCancel={this.toggleCaptcha}
                    onSuccess={() => {
                        this.toggleCaptcha();
                        this.onSubmit();
                    }}
                />
            </div>
        );
    }
}

export default withLayout(connect(({ app }) => ({ app }))(withRouter(Login)));
