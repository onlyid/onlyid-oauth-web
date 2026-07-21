import React, { useState, useEffect } from "react"
import { Divider, Link } from "@material-ui/core"
import { eventEmitter } from "my/utils"
import styles from "./MyLayout.module.css"
import qs from "qs"
import request from "my/request"
import { useSelector, useDispatch } from "react-redux"
import { Link as RRLink, useHistory, useLocation } from "react-router-dom"
import logo from "assets/logo.svg"
import _ from "lodash"
import cn from "classnames"

function Layout({ children, contentClass }) {
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const history = useHistory()
    const app = useSelector((state) => state.app)
    const dispatch = useDispatch()
    const { oauthConfig, client } = app

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        // 如果已经初始化 则不再重新初始化
        if (app.client.id) return setLoading(false)

        const query = qs.parse(location.search, { ignoreQueryPrefix: true })
        const clientId = query["client-id"]
        const client = await request.get("clients/" + clientId)
        const oauthConfig = await request.get("clients/" + clientId + "/oauth-config")
        dispatch({ type: "app", client, oauthConfig })

        if (client.type === "APP") {
            if (window.android) {
                if (oauthConfig.packageName !== query["package-name"])
                    return disableNext("应用包名错误，请检查")

                // window.android.setTitle("登录" + client.name);
            }
            // ios
            else {
                if (oauthConfig.bundleId !== query["bundle-id"])
                    return disableNext("Bundle ID错误，请检查")

                // window.webkit.messageHandlers.ios.postMessage({
                //     method: "setTitle",
                //     data: { title: "登录" + client.name }
                // });
            }
        } else {
            if (!oauthConfig.redirectUris.length)
                return disableNext("回调URI未配置，请到控制台配置")

            if (!oauthConfig.redirectUris.includes(query["redirect-uri"]))
                return disableNext("回调URI参数错误，请检查")
        }

        const users = await request.get("user-sessions")
        if (users.length) {
            dispatch({ type: "app", users })
            history.replace("/choose" + location.search)
        } else {
            history.replace("/home" + location.search)
        }

        setLoading(false)
    }

    const disableNext = (text) => {
        eventEmitter.emit("openToast", { text, severity: "error" })
        history.replace("/home" + location.search)
        setLoading(false)
        dispatch({ type: "app", nextDisabled: true })
    }

    const bgStyle = {}
    const bgClass = {}
    // 如果有自定义背景，优先使用
    if (oauthConfig.background.length) {
        for (const item of oauthConfig.background) {
            // 正则是为了只在第一个冒号处split，剩余字符串放到数组第二个元素
            const [p, v] = item.split(/:(.+)/)
            bgStyle[_.camelCase(p)] = v
        }
    }
    // 如果还在加载中，不apply默认背景
    else if (!loading) {
        bgClass[styles.bg] = true
    }

    const sdkClass = { [styles.sdk]: client.type === "APP" }

    return (
        <div className={cn(styles.root, bgClass, sdkClass)} style={bgStyle}>
            <div className={styles.cardWrapper}>
                <div className={cn(styles.card, contentClass)}>{!loading && children}</div>
            </div>
            <footer>
                <Link
                    component={RRLink}
                    to={`/support${location.search}`}
                    target="_blank"
                    style={{ marginRight: -8 }}
                >
                    需要帮助？
                </Link>
                <Divider className={styles.divider} />
                <Link href="https://onlyid.net/web" target="_blank">
                    <img src={logo} alt="logo" width="100" />
                </Link>
                <p className="tip" style={{ marginTop: 10 }}>
                    用一个账号登录全球互联网
                </p>
            </footer>
        </div>
    )
}

// 使用高阶组件，在loading时渲染layout，但不渲染子组件
export default function withLayout(WrappedComponent) {
    return function () {
        return (
            <Layout>
                <WrappedComponent />
            </Layout>
        )
    }
}
