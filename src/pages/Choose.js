import React, { useState, useEffect } from "react"
import IconAndAvatar from "components/IconAndAvatar"
import { useSelector, useDispatch } from "react-redux"
import styles from "./Choose.module.css"
import { useHistory, useLocation } from "react-router-dom"
import { Add, MoreVert } from "@material-ui/icons"
import { IconButton, ListItemText, Menu, MenuItem } from "@material-ui/core"
import classNames from "classnames"
import request from "my/request"
import ScanLoginButton from "components/ScanLoginButton"
import withLayout from "components/MyLayout"

function Item({ user, onDelete, onClick }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const [isHover, setIsHover] = useState(false)

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const closeMenu = () => {
        setAnchorEl(null)
    }

    return (
        <div className={classNames(styles.item, { [styles.hover]: isHover })}>
            <div
                className={styles.mainBox}
                onClick={onClick}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <img src={user.avatar} alt="avatar" className={styles.avatar} />
                <div className={styles.box1}>
                    <p className={styles.nickname}>{user.nickname}</p>
                    <p className={styles.account}>{user.account}</p>
                </div>
            </div>
            <IconButton onClick={openMenu}>
                <MoreVert />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                getContentAnchorEl={null}
            >
                <MenuItem onClick={() => onDelete() && closeMenu()}>
                    <ListItemText>删除记录</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    )
}

function Choose() {
    const dispatch = useDispatch()
    const app = useSelector((state) => state.app)
    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        dispatch({ type: "app", avatar: null, nickname: null })
    }, [])

    const onClick = async (user) => {
        const { nickname, avatar, account } = user
        dispatch({ type: "app", nickname, avatar, account })
        history.push("/login" + location.search)
    }

    const onDelete = async ({ id }) => {
        const { users } = app

        await request.delete(`user-sessions/${id}`)

        dispatch({ type: "app", users: users.filter((u) => u.id !== id) })

        if (users.length === 1) history.replace("/home" + location.search)
    }

    const useNew = () => {
        history.push("/home" + location.search)
    }

    return (
        <div className={styles.root}>
            <IconAndAvatar />
            <p className="tip">选择一个账号登录</p>
            <div className={styles.listBox}>
                {app.users.map((user) => (
                    <Item
                        user={user}
                        key={user.id}
                        onClick={() => onClick(user)}
                        onDelete={() => onDelete(user)}
                    />
                ))}
            </div>
            <div className={styles.useNew} onClick={useNew}>
                <Add /> 使用新账号
            </div>
            <ScanLoginButton style={{ marginTop: "4rem" }} />
        </div>
    )
}

export default withLayout(Choose)
