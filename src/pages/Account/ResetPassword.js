import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    OutlinedInput
} from "@material-ui/core";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";
import Validator from "async-validator";
import http from "my/http";
import IconAndAvatar from "components/IconAndAvatar";
import { redirectCode } from "my/utils";
import { NEW_PASSWORD_RULE } from "my/constants";

const RULES = {
    otp: [{ required: true, message: "请输入" }],
    password: NEW_PASSWORD_RULE
};

class ResetPassword extends PureComponent {
    state = {
        validation: { otp: {}, password: {} },
        otp: null,
        password: null,
        keepLoggedIn: false
    };

    onSubmit = async (e) => {
        e.preventDefault();

        const { otp, password, keepLoggedIn, validation } = this.state;
        const {
            app: { account, client },
            location: { search }
        } = this.props;

        // 校验表单
        try {
            const values = { otp, password };
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        const { authorizationCode } = await http.put("auth/reset-password", {
            account,
            otp,
            password,
            clientId: client.id,
            keepLoggedIn
        });

        redirectCode(client, search, authorizationCode);
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

    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    };

    onCheckBoxChange = (event) => {
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
                <form onSubmit={this.onSubmit} style={{ marginTop: 25 }} className="form1">
                    <FormControl variant="outlined" fullWidth disabled>
                        <InputLabel htmlFor="account-input">账号</InputLabel>
                        <OutlinedInput id="account-input" label="账号" value={account} />
                        <FormHelperText />
                    </FormControl>
                    <OtpInput
                        name="otp"
                        error={validation.otp.error}
                        onChange={this.onChange}
                        helperText={validation.otp.text}
                        recipient={account}
                        clientId={client.id}
                        onBlur={this.validateField}
                    />
                    <PasswordInput
                        name="password"
                        error={validation.password.error}
                        onChange={this.onChange}
                        helperText={validation.password.text}
                        label="新密码"
                        onBlur={this.validateField}
                        autoComplete="new-password"
                    />
                    {client.type !== "APP" && (
                        <FormControlLabel
                            style={{ marginTop: "0.5rem" }}
                            control={
                                <Checkbox
                                    color="primary"
                                    onChange={this.onCheckBoxChange}
                                    checked={keepLoggedIn}
                                />
                            }
                            label="保持登录一个月"
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
                    <Button variant="outlined" onClick={this.back} size="small">
                        取 消
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(ResetPassword));
