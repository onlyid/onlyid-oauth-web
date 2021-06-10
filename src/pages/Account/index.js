import React, { PureComponent } from "react";
import { Divider, Link } from "@material-ui/core";
import { eventEmitter } from "my/utils";
import styles from "./index.module.css";
import qs from "qs";
import http from "my/http";
import { connect } from "react-redux";
import { Link as RRLink, Route, Switch, withRouter } from "react-router-dom";
import logo from "assets/logo.svg";
import Home from "./Home";
import SignUp from "./SignUp";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import ScanLogin from "./ScanLogin";
import Select from "./Select";
import Activate from "./Activate";

class Account extends PureComponent {
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
        const client = await http.get("clients/" + query["client-id"]);

        dispatch({ type: "app", client });

        if (client.type === "APP") {
            if (window.android) {
                if (client.packageName !== query["package-name"])
                    return this.disableNext("应用包名错误，请检查");

                window.android.setTitle("登录" + client.name);
            }
            // ios
            else {
                if (client.bundleId !== query["bundle-id"])
                    return this.disableNext("Bundle ID错误，请检查");

                window.webkit.messageHandlers.ios.postMessage({
                    method: "setTitle",
                    data: { title: "登录" + client.name }
                });
            }
        } else {
            if (!client.redirectUris.length)
                return this.disableNext("回调URI未配置，请到控制台配置");

            if (!client.redirectUris.includes(query["redirect-uri"]))
                return this.disableNext("回调URI参数错误，请检查");
        }

        const mySessions = await http.get("my-sessions");
        if (mySessions.length) {
            dispatch({ type: "app", mySessions });
            history.replace("/account/select" + location.search);
        } else {
            history.replace("/account" + location.search);
        }

        this.setState({ loading: false });
    };

    disableNext = text => {
        const { dispatch } = this.props;

        eventEmitter.emit("app/openToast", { text, severity: "error" });
        dispatch({ type: "app", nextDisabled: true });

        this.setState({ loading: false });
    };

    render() {
        const { loading } = this.state;
        const {
            match,
            app: { client },
            location
        } = this.props;

        return (
            <div className={styles.root}>
                <div className={styles.cardWrapper}>
                    <div className={styles.card}>
                        {!loading && (
                            <Switch>
                                <Route path={`${match.path}/login`}>
                                    <Login />
                                </Route>
                                <Route path={`${match.path}/sign-up`}>
                                    <SignUp />
                                </Route>
                                <Route path={`${match.path}/reset-password`}>
                                    <ResetPassword />
                                </Route>
                                <Route path={`${match.path}/scan-login`}>
                                    <ScanLogin />
                                </Route>
                                <Route path={`${match.path}/select`}>
                                    <Select />
                                </Route>
                                <Route path={`${match.path}/activate`}>
                                    <Activate />
                                </Route>
                                <Route path={match.path}>
                                    <Home />
                                </Route>
                            </Switch>
                        )}
                    </div>
                </div>
                <footer>
                    <Link component={RRLink} to={`/support${location.search}`} target="_blank">
                        需要帮助？
                    </Link>
                    <Divider style={{ marginTop: 20 }} />
                    <a href="https://www.onlyid.net/home" target="_blank" rel="noopener noreferrer">
                        <img src={logo} alt="logo" width="100" height="40.5" />
                    </a>
                    <p className="tip">
                        用一个「唯ID」账号登录全球互联网。
                        {client.type !== "APP" && (
                            <Link href="https://www.onlyid.net/home" target="_blank">
                                了解更多
                            </Link>
                        )}
                    </p>
                </footer>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Account));
