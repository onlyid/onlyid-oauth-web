import React, { PureComponent } from "react";
import { Button, TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import http from "my/http";
import { connect } from "react-redux";
import Validator from "async-validator";
import { REG_EXP, DATE_TIME_FORMAT } from "my/constants";
import IconAndAvatar from "components/IconAndAvatar";
import ScanLoginButton from "components/ScanLoginButton";
import { eventEmitter } from "my/utils";
import moment from "moment";

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

class Home extends PureComponent {
    state = {
        validation: {},
        account: ""
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: "app", avatarUrl: null, nickname: null });
    }

    onSubmit = async e => {
        e.preventDefault();

        const {
            history,
            match,
            location: { search },
            app: { client },
            dispatch
        } = this.props;
        const { account } = this.state;

        if (!(await this.validateField())) return;

        const params = { account, tenant: client.tenant };
        const data = await http.get("check-account", { params });
        let route;
        if (data) {
            const { nickname, avatarUrl, activated, blocked, expireDate } = data;
            if (blocked) {
                let text = `你已被屏蔽登录「${client.name}」`;
                if (expireDate)
                    text += `，解除时间：${moment(expireDate).format(DATE_TIME_FORMAT)}`;

                eventEmitter.emit("app/openToast", { text, severity: "error" });
                return;
            }

            if (activated) {
                dispatch({ type: "app", nickname, avatarUrl });
                route = "login";
            } else {
                route = "activate";
            }
        } else {
            route = "sign-up";
        }
        dispatch({ type: "app", account });
        history.push(`${match.url}/${route}${search}`);
    };

    onChange = e => {
        this.setState({ account: e.target.value });
    };

    validateField = async () => {
        const { account } = this.state;
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
        const { validation, account } = this.state;
        const {
            app: { client },
            nextDisabled
        } = this.props;

        return (
            <div>
                <IconAndAvatar />
                <form onSubmit={this.onSubmit} style={{ marginTop: 30 }} noValidate>
                    <TextField
                        label="手机号 / 邮箱"
                        variant="outlined"
                        error={validation.error}
                        helperText={validation.text}
                        fullWidth
                        onChange={this.onChange}
                        value={account}
                        onBlur={this.validateField}
                        type="email"
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

export default connect(({ app }) => ({ app }))(withRouter(Home));
