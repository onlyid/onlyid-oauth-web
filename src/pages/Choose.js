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

class Item extends PureComponent {
    state = {
        anchorEl: null,
        isHover: false
    };

    openMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { user, onDelete, onLogout, onClick } = this.props;
        const { anchorEl, isHover } = this.state;
        const loggedIn = new Date(user.expireDate) > new Date();

        return (
            <div className={classNames(styles.item, { [styles.hover]: isHover })}>
                <div
                    className={classNames(
                        loggedIn ? styles.loggedIn : styles.notLoggedIn,
                        styles.mainBox
                    )}
                    onClick={onClick}
                    onMouseEnter={() => this.setState({ isHover: true })}
                    onMouseLeave={() => this.setState({ isHover: false })}
                >
                    <img src={user.avatarUrl} alt="icon" className={styles.avatar} />
                    <div className={styles.box1}>
                        <p className={styles.nickname}>{user.nickname}</p>
                        <p className={styles.accountName}>{user.mobile || user.email}</p>
                    </div>
                    <p className={styles.loginStatus}>{loggedIn ? "已登录" : "未登录"}</p>
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
                    <MenuItem onClick={onLogout} disabled={!loggedIn}>
                        <ListItemText>退出登录</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={onDelete}>
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
        dispatch({ type: "app/save", payload: { avatarUrl: null, nickname: null } });
    }
    onClick = async user => {
        const {
            app: { client },
            history,
            location,
            dispatch
        } = this.props;

        // +5s是防止用户过期的那一刻点 后台报错
        const now = new Date();
        now.setSeconds(now.getSeconds() + 5);
        if (new Date(user.expireDate) < now) {
            const { nickname, avatarUrl, mobile, email } = user;
            dispatch({
                type: "app/save",
                payload: { nickname, avatarUrl, accountName: mobile || email }
            });
            history.push("/account/sign-in" + location.search);
        } else {
            const { authorizationCode } = await http.post("oauth/choose", {
                userId: user.id,
                clientId: client.id
            });

            redirectCode(client, location.search, authorizationCode);
        }
    };

    delete1 = async user => {
        const {
            app: { sessionUsers },
            dispatch,
            history,
            location
        } = this.props;

        await http.delete(`oauth/session-users/${user.id}`);

        dispatch({
            type: "app/save",
            payload: { sessionUsers: sessionUsers.filter(u => u.id !== user.id) }
        });

        if (sessionUsers.length === 0) history.replace("/account" + location.search);

        eventEmitter.emit("app/openToast", { message: "已删除", severity: "success" });
    };

    logout = async user => {
        await http.post(`oauth/session-users/${user.id}/logout`);
        user.expireDate = new Date().toISOString();
        this.forceUpdate();
        eventEmitter.emit("app/openToast", { message: "已退出", severity: "success" });
    };

    useNew = () => {
        const { history, location } = this.props;

        history.push("/account" + location.search);
    };

    render() {
        const {
            app: { client, sessionUsers }
        } = this.props;

        return (
            <div>
                <IconAndAvatar />
                <p className="tip" style={{ marginTop: "1.9rem" }}>
                    正在登录「{client.name}」，选择一个账号继续。
                </p>
                <div className={styles.listBox}>
                    {sessionUsers.map(u => (
                        <Item
                            user={u}
                            key={u.id}
                            onClick={() => this.onClick(u)}
                            onDelete={() => this.delete1(u)}
                            onLogout={() => this.logout(u)}
                        />
                    ))}
                </div>
                <div className={styles.useNew} onClick={this.useNew}>
                    <Add /> 使用新手机号
                </div>
                <ScanLoginButton />
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Choose));
