import React, { PureComponent } from "react";
import { Button, Hidden, TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import http from "my/http";
import { connect } from "react-redux";
import Validator from "async-validator";
import { REG_EXP } from "my/constants";
import IconAndAvatar from "components/IconAndAvatar";
import styles from "./Account.module.css";

const RULES = {
    email: [
        { required: true, message: "请输入" },
        { max: 50, message: "最多输入50字" },
        { type: "email", message: "邮箱格式不正确" }
    ],
    mobile: [
        { required: true, message: "请输入" },
        { max: 50, message: "最多输入50字" },
        { pattern: REG_EXP.mobile, message: "手机号格式不正确" }
    ]
};

class Account extends PureComponent {
    state = {
        helperText: null,
        isError: false
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: "app/save", payload: { avatarUrl: null, nickname: null } });
    }

    onSubmit = async e => {
        e.preventDefault();

        const {
            history,
            location: { search },
            app: { accountName },
            dispatch
        } = this.props;

        if (!(await this.validateField())) return;

        const params = { accountName };
        const { registered, nickname, avatarUrl } = await http.get("oauth/check-registered", {
            params
        });
        if (registered) {
            history.push("/account/sign-in" + search);
            dispatch({ type: "app/save", payload: { nickname, avatarUrl } });
        } else {
            history.push("/account/sign-up" + search);
        }
    };

    onChange = e => {
        const { dispatch } = this.props;
        dispatch({ type: "app/save", payload: { accountName: e.target.value } });
    };

    validateField = async () => {
        const {
            app: { accountName }
        } = this.props;
        try {
            const rules = accountName.includes("@") ? RULES.email : RULES.mobile;
            const validator = new Validator({ accountName: rules });
            await validator.validate({ accountName });
            this.setState({ helperText: null, isError: false });
            return true;
        } catch ({ errors }) {
            this.setState({ helperText: errors[0].message, isError: true });
            return false;
        }
    };

    scanLogin = () => {
        const {
            history,
            location: { search }
        } = this.props;
        history.push("/account/scan-login" + search);
    };

    render() {
        const { helperText, isError } = this.state;
        const {
            app: { client, accountName, nextDisabled }
        } = this.props;

        return (
            <div>
                <IconAndAvatar />
                <form onSubmit={this.onSubmit} style={{ marginTop: 30 }}>
                    <TextField
                        label="手机号/邮箱"
                        variant="outlined"
                        error={isError}
                        helperText={helperText}
                        fullWidth
                        onChange={this.onChange}
                        value={accountName}
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
                <Hidden xsDown>
                    <div className={styles.scanButtonBox}>
                        <div className={styles.scanButton} onClick={this.scanLogin}>
                            <span className="material-icons">qr_code</span>
                            <p>扫码登录</p>
                        </div>
                    </div>
                </Hidden>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Account));
