import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import http from "my/http";
import { connect } from "react-redux";
import Validator from "async-validator";
import { REG_EXP } from "my/constants";
import IconAndAvatar from "components/IconAndAvatar";
import ScanLoginButton from "components/ScanLoginButton";
import { Security } from "@material-ui/icons";
import officialDomain from "assets/official-domain.png";
import styles from "./Account.module.css";

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
        helperText: null,
        isError: false,
        dialogVisible: false,
        dialogType: "signUp"
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: "app/save",
            payload: { avatarUrl: null, nickname: null, account: "" }
        });
    }

    onSubmit = async e => {
        e.preventDefault();

        const {
            history,
            location: { search },
            app: { account },
            dispatch
        } = this.props;

        if (!(await this.validateField())) return;

        const params = { account };
        const data = await http.get("oauth/check-account", { params });
        if (data) {
            const { userId, nickname, avatarUrl, activated } = data;
            if (activated) {
                dispatch({ type: "app/save", payload: { userId, nickname, avatarUrl } });
                history.push("/account/login" + search);
            } else {
                dispatch({ type: "app/save", payload: { userId } });
                this.setState({ dialogVisible: true, dialogType: "activate" });
            }
        } else {
            this.setState({ dialogVisible: true });
        }
    };

    onChange = e => {
        const { dispatch } = this.props;
        dispatch({ type: "app/save", payload: { account: e.target.value } });
    };

    validateField = async () => {
        const {
            app: { account }
        } = this.props;
        try {
            const rules = account.includes("@") ? RULES.email : RULES.mobile;
            const validator = new Validator({ account: rules });
            await validator.validate({ account });
            this.setState({ helperText: null, isError: false });
            return true;
        } catch ({ errors }) {
            this.setState({ helperText: errors[0].message, isError: true });
            return false;
        }
    };

    closeDialog = () => {
        this.setState({ dialogVisible: false });
    };

    go = route => {
        const {
            history,
            location: { search }
        } = this.props;
        history.push(`/account/${route}` + search);
    };

    render() {
        const { helperText, isError, dialogVisible, dialogType } = this.state;
        const {
            app: { client, account, nextDisabled }
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
                <Dialog open={dialogVisible} onClose={this.closeDialog}>
                    <DialogTitle>欢迎！</DialogTitle>
                    <DialogContent className={styles.dialog1Content}>
                        <p style={{ marginTop: 0 }}>
                            你要登录的「<span style={{ color: "#f50057" }}>{client.name}</span>
                            」使用了唯ID的账号和认证解决方案。
                        </p>
                        {dialogType === "signUp" ? (
                            <p>
                                <b>新用户请先注册账号</b>，注意，你的账号不仅可以登录「
                                <span style={{ color: "#f50057" }}>{client.name}</span>
                                」，还可以登录其他所有接入唯ID的网站和APP。
                            </p>
                        ) : (
                            <p>
                                你的账号已由开发者导入，
                                <b>请检查是否符合需求，并设置登录密码，即可激活使用</b>
                                。注意，你的账号不仅可以登录「
                                <span style={{ color: "#f50057" }}>{client.name}</span>
                                」，还可以登录其他所有接入唯ID的网站和APP。
                            </p>
                        )}
                        <p>
                            登录时认准官方网址，唯ID为你的安全保驾护航
                            <Security style={{ color: "#3f51b5", verticalAlign: "-20%" }} />。
                        </p>
                        <img
                            src={officialDomain}
                            alt="officialDomain"
                            className={styles.officialDomain}
                        />
                    </DialogContent>
                    <DialogActions>
                        {dialogType === "signUp" ? (
                            <Button onClick={() => this.go("sign-up")} color="primary">
                                开始注册
                            </Button>
                        ) : (
                            <Button onClick={() => this.go("activate")} color="primary">
                                开始激活
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Account));
