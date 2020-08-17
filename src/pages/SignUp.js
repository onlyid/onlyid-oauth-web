import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./index.module.css";
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from "@material-ui/core";
import PasswordInput from "components/PasswordInput";
import OtpInput from "components/OtpInput";
import Validator from "async-validator";
import http from "my/http";
import AvatarUpload from "components/AvatarUpload";
import { redirectCode } from "../my/utils";
import { Edit } from "@material-ui/icons";

const RULES = {
    nickname: [
        { required: true, message: "请输入" },
        { max: 50, message: "最多输入50字" }
    ],
    otp: [{ required: true, message: "请输入" }],
    password: [
        { required: true, message: "请输入" },
        { min: 6, message: "密码最少要输入6位" },
        { max: 50, message: "最多输入50字" }
    ]
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
        filename: null
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

        const { filename, nickname, otp, password } = this.state;
        const {
            app: { client, accountName },
            location: { search }
        } = this.props;

        // 校验表单
        const values = await Promise.all([
            await this.validateField("nickname"),
            await this.validateField("otp"),
            await this.validateField("password")
        ]);
        if (values.includes(false)) return;

        const { authorizationCode } = await http.post("oauth/users", {
            filename,
            nickname,
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

    render() {
        const {
            app: { accountName, client }
        } = this.props;
        const { validation } = this.state;

        return (
            <div className={styles.signUp}>
                <AvatarUpload onChange={value => this.onChange("filename", value)} />
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
                <form onSubmit={this.onSubmit} style={{ marginTop: 20 }} className={styles.form1}>
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
                        recipient={accountName}
                        clientId={client.id}
                        onBlur={() => this.validateField("otp")}
                    />
                    <PasswordInput
                        error={validation.password.isError}
                        onChange={({ target: { value } }) => this.onChange("password", value)}
                        helperText={validation.password.helperText}
                        onBlur={() => this.validateField("password")}
                        autoComplete="new-password"
                    />
                    <div style={{ marginTop: 20 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.onSubmit}
                            size="large"
                        >
                            注 册
                        </Button>
                    </div>
                </form>
                <div className={styles.box2}>
                    <Button variant="outlined" onClick={this.back} size="small">
                        取 消
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(SignUp));
