import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import http from "my/http";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";

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
        const { inputValue, loginType } = this.state;
        const {
            app: { accountName, client }
        } = this.props;

        if (inputValue) {
            this.setState({ helperText: null, isError: false });

            const { authorizationCode } = await http.post("oauth/sign-in", {
                accountName,
                [loginType]: inputValue,
                clientId: client.id
            });
            console.log(authorizationCode);
        } else {
            this.setState({ helperText: "请输入", isError: true });
        }
    };

    onChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    toggleLoginType = () => {
        this.setState(({ loginType }) => ({
            loginType: loginType === "password" ? "otp" : "password"
        }));
    };

    render() {
        const { helperText, isError, loginType } = this.state;
        const {
            app: { accountName, client }
        } = this.props;

        return (
            <div>
                <div className={styles.accountBox}>
                    <Button
                        startIcon={<span className="material-icons">edit</span>}
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
                        />
                    ) : (
                        <OtpInput
                            error={isError}
                            onChange={this.onChange}
                            helperText={helperText}
                            accountName={accountName}
                            clientId={client.id}
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
                    <Button variant="outlined" color="primary" onClick={this.toggleLoginType}>
                        {loginType === "password" ? "验证码登录" : "密码登录"}
                    </Button>
                    <Button variant="outlined">忘记密码</Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(SignIn));
