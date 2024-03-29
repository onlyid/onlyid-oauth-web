import React, { PureComponent } from "react";
import IconAndAvatar from "components/IconAndAvatar";
import { connect } from "react-redux";
import styles from "./Choose.module.css";
import { withRouter } from "react-router-dom";
import { Add, MoreVert } from "@material-ui/icons";
import { IconButton, ListItemText, Menu, MenuItem } from "@material-ui/core";
import classNames from "classnames";
import http from "my/http";
import { eventEmitter, redirectCode } from "my/utils";
import ScanLoginButton from "components/ScanLoginButton";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";

class Item extends PureComponent {
    state = {
        anchorEl: null,
        isHover: false
    };

    openMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { user, onDelete, onLogout, onClick } = this.props;
        const { anchorEl, isHover } = this.state;
        const loggedIn = moment(user.sessionExpireDate) > moment();
        const account = user[user.sessionExtra.accountType] || user.mobile || user.email;

        return (
            <div className={classNames(styles.item, { [styles.hover]: isHover })}>
                <div
                    className={styles.mainBox}
                    onClick={onClick}
                    onMouseEnter={() => this.setState({ isHover: true })}
                    onMouseLeave={() => this.setState({ isHover: false })}
                >
                    <img src={user.avatarUrl} alt="avatar" className={styles.avatar} />
                    <div className={styles.box1}>
                        <p className={styles.nickname}>{user.nickname}</p>
                        <p className={styles.account}>{account}</p>
                    </div>
                    <p className={styles.loginStatus}>{!loggedIn && "未登录"}</p>
                </div>
                <IconButton onClick={this.openMenu}>
                    <MoreVert />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    open={Boolean(anchorEl)}
                    onClose={this.closeMenu}
                    getContentAnchorEl={null}
                >
                    <MenuItem onClick={() => onLogout() && this.closeMenu()} disabled={!loggedIn}>
                        <ListItemText>退出登录</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => onDelete() && this.closeMenu()}>
                        <ListItemText>删除记录</ListItemText>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

class Choose extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: "app", avatarUrl: null, nickname: null });
    }

    onClick = async (user) => {
        const {
            app: { client },
            history,
            location,
            dispatch
        } = this.props;

        if (user.blocked) {
            let text = `你已被屏蔽登录「${client.name}」`;
            if (user.blockedExpireDate)
                text += `，解除时间：${moment(user.blockedExpireDate).format(DATE_TIME_FORMAT)}`;

            eventEmitter.emit("app/openToast", { text, severity: "error" });
            return;
        }

        // +5s是防止用户过期的那一刻点 后台报错
        const now = moment();
        now.add(5, "seconds");
        if (moment(user.sessionExpireDate) < now) {
            const { nickname, avatarUrl, mobile, email } = user;
            const account = user[user.sessionExtra.accountType] || mobile || email;
            dispatch({ type: "app", nickname, avatarUrl, account });
            history.push("/account/login" + location.search);
        } else {
            const { authorizationCode } = await http.post("auth/sso", {
                userId: user.id,
                clientId: client.id
            });

            redirectCode(client, location.search, authorizationCode);
        }
    };

    delete1 = async (user) => {
        const { users, onDelete, history, location } = this.props;

        await http.delete(`users/${user.id}/sessions`);

        onDelete(user.id);

        if (users.length === 1) history.replace("/account" + location.search);

        eventEmitter.emit("app/openToast", { text: "已删除记录", timeout: 2000 });
    };

    logout = async (user) => {
        await http.post(`users/${user.id}/logout`);

        user.sessionExpireDate = moment().format(DATE_TIME_FORMAT);
        this.forceUpdate();

        eventEmitter.emit("app/openToast", { text: "已退出登录", timeout: 2000 });
    };

    useNew = () => {
        const { history, location } = this.props;

        history.push("/account" + location.search);
    };

    render() {
        const {
            app: { client },
            users
        } = this.props;

        return (
            <div className={styles.root}>
                <IconAndAvatar />
                <p className="tip">选择一个账号登录「{client.name}」</p>
                <div className={styles.listBox}>
                    {users.map((user) => (
                        <Item
                            user={user}
                            key={user.id}
                            onClick={() => this.onClick(user)}
                            onDelete={() => this.delete1(user)}
                            onLogout={() => this.logout(user)}
                        />
                    ))}
                </div>
                <div className={styles.useNew} onClick={this.useNew}>
                    <Add /> 使用新账号
                </div>
                <ScanLoginButton />
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Choose));
