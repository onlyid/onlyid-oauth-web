import React, { PureComponent } from "react";
import IconAndAvatar from "components/IconAndAvatar";
import OtpInput from "components/OtpInput";
import PasswordInput from "components/PasswordInput";
import { Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { connect } from "react-redux";
import Validator from "async-validator";

const RULES = {
    otpSms: [{ required: true, message: "请输入" }],
    otpEmail: [{ required: true, message: "请输入" }],
    password: [
        { required: true, message: "请输入" },
        { min: 6, message: "密码最少要输入6位" },
        { max: 50, message: "最多输入50字" }
    ]
};

class SetPassword extends PureComponent {
    state = {
        validation: {
            otpSms: {},
            otpEmail: {},
            password: {}
        }
    };

    validateAll = async () => {
        const { mobile, email, otpSms, otpEmail, password, onSave } = this.props;
        const { validation } = this.state;

        // 校验表单
        try {
            const values = { password, otpSms, otpEmail };
            const rules = { password: RULES.password };

            if (mobile) rules.otpSms = RULES.otpSms;
            if (email) rules.otpEmail = RULES.otpEmail;

            await new Validator(rules).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        onSave();
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

    onChange = ({ target }) => {
        const { onChange } = this.props;

        onChange([target.name], target.value);
    };

    onCheckBoxChange = ({ target }) => {
        const { onChange } = this.props;

        onChange("keepLoggedIn", target.checked);
    };

    render() {
        const {
            mobile,
            email,
            keepLoggedIn,
            app: { client },
            onPrev
        } = this.props;
        const { validation } = this.state;

        return (
            <div>
                <IconAndAvatar />
                <form style={{ marginTop: 20 }} className="form1">
                    {mobile && (
                        <OtpInput
                            name="otpSms"
                            error={validation.otpSms.error}
                            onChange={this.onChange}
                            helperText={validation.otpSms.text || `手机号 ${mobile}`}
                            recipient={mobile}
                            clientId={client.id}
                            onBlur={this.validateField}
                            label="短信验证码"
                        />
                    )}
                    {email && (
                        <OtpInput
                            name="otpEmail"
                            error={validation.otpEmail.error}
                            onChange={this.onChange}
                            helperText={validation.otpEmail.text || `邮箱 ${email}`}
                            recipient={email}
                            clientId={client.id}
                            onBlur={this.validateField}
                            label="邮箱验证码"
                        />
                    )}
                    <PasswordInput
                        name="password"
                        error={validation.password.error}
                        onChange={this.onChange}
                        helperText={validation.password.text || "设置密码，方便下次登录"}
                        onBlur={this.validateField}
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
                            onClick={this.validateAll}
                            size="large"
                        >
                            完成设置并登录
                        </Button>
                    </div>
                </form>
                <div className="oneButtonBox">
                    <Button key="prev" variant="outlined" onClick={onPrev} size="small">
                        上一步
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(SetPassword);
