import React, { PureComponent } from "react";
import IconAndAvatar from "components/IconAndAvatar";
import { connect } from "react-redux";
import styles from "./Choose.module.css";
import { withRouter } from "react-router-dom";
import { Add, MoreVert } from "@material-ui/icons";
import { IconButton, ListItemText, Menu, MenuItem } from "@material-ui/core";
import classNames from "classnames";
import http from "my/http";
import ScanLoginButton from "components/ScanLoginButton";

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
        const { user, onDelete, onClick } = this.props;
        const { anchorEl, isHover } = this.state;

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
                        <p className={styles.account}>{user.account}</p>
                    </div>
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
        const { history, location, dispatch } = this.props;

        const { nickname, avatarUrl, account } = user;
        dispatch({ type: "app", nickname, avatarUrl, account });
        history.push("/account/login" + location.search);
    };

    delete1 = async (user) => {
        const { users, onDelete, history, location } = this.props;

        await http.delete(`user-sessions/${user.id}`);

        onDelete(user.id);

        if (users.length === 1) history.replace("/account" + location.search);
    };

    useNew = () => {
        const { history, location } = this.props;

        history.push("/account" + location.search);
    };

    render() {
        const { users } = this.props;

        return (
            <div className={styles.root}>
                <IconAndAvatar />
                <p className="tip">选择一个账号登录</p>
                <div className={styles.listBox}>
                    {users.map((user) => (
                        <Item
                            user={user}
                            key={user.id}
                            onClick={() => this.onClick(user)}
                            onDelete={() => this.delete1(user)}
                        />
                    ))}
                </div>
                <div className={styles.useNew} onClick={this.useNew}>
                    <Add /> 使用新账号
                </div>
                <ScanLoginButton style={{ marginTop: "4rem" }} />
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Choose));
