import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import http from "my/http";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";
import Validator from "async-validator";
import IconAndAvatar from "components/IconAndAvatar";
import { Edit } from "@material-ui/icons";
import { redirectCode } from "../my/utils";

const RULES = [{ required: true, message: "请输入" }];

class SignIn extends PureComponent {
    state = {
        helperText: null,
        isError: false,
        inputValue: "",
        loginType: "password"
    };

    componentDidMount() {
        const {
            app: { accountName },
            history,
            location
        } = this.props;
        if (!accountName) {
            history.replace("/account" + location.search);
            return;
        }
    }

    back = () => {
        const { history } = this.props;
        history.goBack();
    };

    onSubmit = async e => {
        e.preventDefault();

        const { inputValue, loginType } = this.state;
        const {
            app: { accountName, client },
            location: { search }
        } = this.props;

        if (!(await this.validateField())) return;

        const { authorizationCode } = await http.post("oauth/sign-in", {
            accountName,
            [loginType]: inputValue,
            clientId: client.id
        });

        redirectCode(client, search, authorizationCode);
    };

    onChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    validateField = async () => {
        const { inputValue } = this.state;
        try {
            const validator = new Validator({ inputValue: RULES });
            await validator.validate({ inputValue });
            this.setState({ helperText: null, isError: false });
            return true;
        } catch ({ errors }) {
            this.setState({ helperText: errors[0].message, isError: true });
            return false;
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
        history.push("/account/reset-password" + search);
    };

    render() {
        const { helperText, isError, loginType } = this.state;
        const {
            app: { accountName, client }
        } = this.props;

        return (
            <div>
                <IconAndAvatar />
                <div className={styles.accountBox}>
                    <Button
                        startIcon={<Edit />}
                        size="large"
                        variant="outlined"
                        onClick={this.back}
                    >
                        {accountName}
                    </Button>
                </div>
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }}>
                    {loginType === "password" ? (
                        <PasswordInput
                            error={isError}
                            onChange={this.onChange}
                            helperText={helperText}
                            onBlur={this.validateField}
                        />
                    ) : (
                        <OtpInput
                            error={isError}
                            onChange={this.onChange}
                            helperText={helperText}
                            recipient={accountName}
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
                <div className={styles.box1}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={this.toggleLoginType}
                        size="small"
                    >
                        {loginType === "password" ? "验证码登录" : "密码登录"}
                    </Button>
                    <Button variant="outlined" onClick={this.resetPassword} size="small">
                        忘记密码
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(SignIn));
