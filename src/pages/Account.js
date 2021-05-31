import React, { PureComponent } from "react";
import { Button, TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import http from "my/http";
import { connect } from "react-redux";
import Validator from "async-validator";
import { REG_EXP } from "my/constants";
import IconAndAvatar from "components/IconAndAvatar";
import ScanLoginButton from "components/ScanLoginButton";

const RULES = {
    email: [
        { required: true, message: "请输入" },
        { max: 50, message: "最多输入50字" },
        { type: "email", message: "邮箱格式不正确" }
    ],
    mobile: [
        { required: true, message: "请输入" },
        { pattern: REG_EXP.mobile, message: "手机号格式不正确" }
    ]
};

class Account extends PureComponent {
    state = {
        validation: {}
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: "app", avatarUrl: null, nickname: null, account: "" });
    }

    onSubmit = async e => {
        e.preventDefault();

        const {
            history,
            match,
            location: { search },
            app: { account },
            dispatch
        } = this.props;

        if (!(await this.validateField())) return;

        const params = { account };
        const data = await http.get("check-account", { params });
        let route;
        if (data) {
            const { userId, nickname, avatarUrl, activated } = data;
            if (activated) {
                dispatch({ type: "app", userId, nickname, avatarUrl });
                route = "login";
            } else {
                dispatch({ type: "app", userId });
                route = "activate";
            }
        } else {
            route = "sign-up";
        }
        history.push(`${match.url}/${route}${search}`);
    };

    onChange = e => {
        const { dispatch } = this.props;
        dispatch({ type: "app", account: e.target.value });
    };

    validateField = async () => {
        const {
            app: { account }
        } = this.props;
        let validation;
        try {
            const rules = account.includes("@") ? RULES.email : RULES.mobile;
            const validator = new Validator({ account: rules });
            await validator.validate({ account }, { first: true });
            validation = {};
            return true;
        } catch ({ errors }) {
            validation = { text: errors[0].message, error: true };
            return false;
        } finally {
            this.setState({ validation });
        }
    };

    render() {
        const { validation } = this.state;
        const {
            app: { client, account, nextDisabled }
        } = this.props;

        return (
            <div>
                <IconAndAvatar />
                <form onSubmit={this.onSubmit} style={{ marginTop: 30 }}>
                    <TextField
                        label="手机号 / 邮箱"
                        variant="outlined"
                        error={validation.error}
                        helperText={validation.text}
                        fullWidth
                        onChange={this.onChange}
                        value={account}
                        onBlur={this.validateField}
                    />
                    <div style={{ marginTop: 20 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.onSubmit}
                            size="large"
                            disabled={nextDisabled}
                        >
                            下 一 步
                        </Button>
                        <p className="tip">「{client.name}」将获得你的手机号、昵称等账号信息。</p>
                    </div>
                </form>
                <ScanLoginButton />
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Account));
