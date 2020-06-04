import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./index.module.css";
import { Button } from "@material-ui/core";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";
import Validator from "async-validator";
import http from "my/http";
import IconAndAvatar from "components/IconAndAvatar";
import { Edit } from "@material-ui/icons";
import { redirectCode } from "my/utils";

class ResetPassword extends PureComponent {
    RULES = {
        otp: [{ required: true, message: "请输入" }],
        password: [
            { required: true, message: "请输入" },
            { min: 6, message: "密码最少要输入6位" },
            { max: 50, message: "最多输入50字" },
            {
                validator: (rule, value, callback) => {
                    const { password1 } = this.state;
                    // 如果重复新密码已经填写 触发一次校验
                    if (password1) this.validateField("password1");

                    callback();
                }
            }
        ],
        password1: [
            { required: true, message: "请输入" },
            {
                validator: (rule, value, callback) => {
                    const { password1, password } = this.state;
                    if (password1 !== password) {
                        callback("两次输入的密码不一致");
                    } else {
                        callback();
                    }
                }
            }
        ]
    };

    state = {
        validation: {
            otp: { helperText: null, isError: false },
            password: { helperText: null, isError: false },
            password1: { helperText: null, isError: false }
        },
        otp: null,
        password: null,
        password1: null
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

    onSubmit = async e => {
        e.preventDefault();

        const { otp, password } = this.state;
        const {
            app: { accountName, client },
            location: { search }
        } = this.props;

        // 校验表单
        const values = await Promise.all([
            await this.validateField("otp"),
            await this.validateField("password"),
            await this.validateField("password1")
        ]);
        if (values.includes(false)) return;

        const { authorizationCode } = await http.put("oauth/users/password", {
            accountName,
            otp,
            password,
            clientId: client.id
        });

        redirectCode(client, search, authorizationCode);
    };

    validateField = async key => {
        const { [key]: value, validation } = this.state;
        try {
            const validator = new Validator({ [key]: this.RULES[key] });
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

    render() {
        const {
            app: { accountName, client }
        } = this.props;
        const { validation } = this.state;

        return (
            <div>
                <IconAndAvatar />
                <div className={styles.accountBox}>
                    <Button
                        startIcon={<Edit />}
                        size="large"
                        variant="outlined"
                        onClick={() => this.back(-2)}
                    >
                        {accountName}
                    </Button>
                </div>
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }} className={styles.form1}>
                    <OtpInput
                        error={validation.otp.isError}
                        onChange={({ target: { value } }) => this.onChange("otp", value)}
                        helperText={validation.otp.helperText}
                        recipient={accountName}
                        clientId={client.id}
                        onBlur={() => this.validateField("otp")}
                    />
                    <PasswordInput
                        error={validation.password.isError}
                        onChange={({ target: { value } }) => this.onChange("password", value)}
                        helperText={validation.password.helperText}
                        label="新密码"
                        onBlur={() => this.validateField("password")}
                    />
                    <PasswordInput
                        error={validation.password1.isError}
                        onChange={({ target: { value } }) => this.onChange("password1", value)}
                        helperText={validation.password1.helperText}
                        label="重复新密码"
                        onBlur={() => this.validateField("password1")}
                    />
                    <div style={{ marginTop: 20 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.onSubmit}
                            size="large"
                        >
                            重设密码
                        </Button>
                    </div>
                </form>
                <div className={styles.box2}>
                    <Button variant="outlined" onClick={() => this.back()} size="small">
                        取 消
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(ResetPassword));
