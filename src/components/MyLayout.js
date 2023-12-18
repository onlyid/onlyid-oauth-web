import React, { PureComponent } from "react";
import { Divider, Link } from "@material-ui/core";
import { eventEmitter } from "my/utils";
import styles from "./MyLayout.module.css";
import qs from "qs";
import http from "my/http";
import { connect } from "react-redux";
import { Link as RRLink, withRouter } from "react-router-dom";
import logo from "assets/logo.svg";
import _ from "lodash";
import cn from "classnames";

class Layout extends PureComponent {
    state = {
        loading: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { location, dispatch, history, app } = this.props;

        // 如果已经初始化 则不再重新初始化
        if (app.client.id) return this.setState({ loading: false });

        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        const clientId = query["client-id"];
        const client = await http.get("clients/" + clientId);
        const oauthConfig = await http.get("clients/" + clientId + "/oauth-config");
        dispatch({ type: "app", client, oauthConfig });

        if (client.type === "APP") {
            if (window.android) {
                if (oauthConfig.packageName !== query["package-name"])
                    return this.disableNext("应用包名错误，请检查");

                window.android.setTitle("登录" + client.name);
            }
            // ios
            else {
                if (oauthConfig.bundleId !== query["bundle-id"])
                    return this.disableNext("Bundle ID错误，请检查");

                window.webkit.messageHandlers.ios.postMessage({
                    method: "setTitle",
                    data: { title: "登录" + client.name }
                });
            }
        } else {
            if (!oauthConfig.redirectUris.length)
                return this.disableNext("回调URI未配置，请到控制台配置");

            if (!oauthConfig.redirectUris.includes(query["redirect-uri"]))
                return this.disableNext("回调URI参数错误，请检查");
        }

        const params = { tenant: client.tenant };
        const users = await http.get("user-sessions", { params });
        if (users.length) {
            dispatch({ type: "app", users });
            history.replace("/choose" + location.search);
        } else {
            history.replace("/home" + location.search);
        }

        this.setState({ loading: false });
    };

    disableNext = (text) => {
        const { history, location, dispatch } = this.props;

        eventEmitter.emit("app/openToast", { text, severity: "error" });
        history.replace("/home" + location.search);
        this.setState({ loading: false });
        dispatch({ type: "app", nextDisabled: true });
    };

    render() {
        const { loading } = this.state;
        const { app, location, children, contentClass } = this.props;
        const { oauthConfig } = app;

        const bgStyle = {};
        const bgClass = {};
        // 如果有自定义背景，优先使用
        if (oauthConfig.background.length) {
            for (const item of oauthConfig.background) {
                // 正则是为了只在第一个冒号处split，剩余字符串放到数组第二个元素
                const [p, v] = item.split(/:(.+)/);
                bgStyle[_.camelCase(p)] = v;
            }
        }
        // 如果还在加载中，不apply默认背景
        else if (!loading) {
            bgClass[styles.bg] = true;
        }

        return (
            <div className={cn(styles.root, bgClass)} style={bgStyle}>
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
                    <Link href="https://www.onlyid.net/home" target="_blank">
                        <img src={logo} alt="logo" width="100" />
                    </Link>
                    <p className="tip" style={{ marginTop: 10 }}>
                        用一个唯ID账号登录全球互联网
                    </p>
                </footer>
            </div>
        );
    }
}

const MyLayout = connect(({ app }) => ({ app }))(withRouter(Layout));

// 使用高阶组件，在loading时渲染layout，但不渲染子组件
export default function withLayout(WrappedComponent) {
    return function () {
        return (
            <MyLayout>
                <WrappedComponent />
            </MyLayout>
        );
    };
}
