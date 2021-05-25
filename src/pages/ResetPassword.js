import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";
import Validator from "async-validator";
import http from "my/http";
import IconAndAvatar from "components/IconAndAvatar";
import { Edit } from "@material-ui/icons";
import { redirectCode } from "my/utils";
import RememberMe from "components/RememberMe";
import { NEW_PASSWORD_RULE } from "my/constants";

const RULES = {
    otp: [{ required: true, message: "请输入" }],
    password: NEW_PASSWORD_RULE
};

class ResetPassword extends PureComponent {
    state = {
        validation: {
            otp: { helperText: null, isError: false },
            password: { helperText: null, isError: false }
        },
        otp: null,
        password: null,
        keepLoggedIn: false
    };

    onSubmit = async e => {
        e.preventDefault();

        const { otp, password, keepLoggedIn } = this.state;
        const {
            app: { account, client },
            location: { search }
        } = this.props;

        // 校验表单
        const values = await Promise.all([
            await this.validateField("otp"),
            await this.validateField("password")
        ]);
        if (values.includes(false)) return;

        const { authorizationCode } = await http.put("oauth/users/password", {
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

    back = (n = -1) => {
        const { history } = this.props;
        history.go(n);
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
            <div>
                <IconAndAvatar />
                <div className="accountBox">
                    <Button
                        startIcon={<Edit />}
                        size="large"
                        variant="outlined"
                        onClick={() => this.back(-2)}
                    >
                        {account}
                    </Button>
                </div>
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }} className="form1">
                    <OtpInput
                        error={validation.otp.isError}
                        onChange={({ target: { value } }) => this.onChange("otp", value)}
                        helperText={validation.otp.helperText}
                        recipient={account}
                        clientId={client.id}
                        onBlur={() => this.validateField("otp")}
                        updateField="密码"
                    />
                    <PasswordInput
                        error={validation.password.isError}
                        onChange={({ target: { value } }) => this.onChange("password", value)}
                        helperText={validation.password.helperText}
                        label="新密码"
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
                            重设密码并登录
                        </Button>
                    </div>
                </form>
                <div className="oneButtonBox">
                    <Button variant="outlined" onClick={() => this.back()} size="small">
                        取 消
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(ResetPassword));
