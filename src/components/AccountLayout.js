import React, { PureComponent } from "react";
import { Alert } from "@material-ui/lab";
import { Divider, Link, Snackbar } from "@material-ui/core";
import { eventEmitter } from "my/utils";
import styles from "./AccountLayout.module.css";
import qs from "qs";
import http from "my/http";
import { connect } from "react-redux";
import { Link as RouterLink, Route, Switch, withRouter } from "react-router-dom";
import logo from "assets/logo.svg";
import Account from "pages/Account";
import SignUp from "pages/SignUp";
import Login from "pages/Login";
import ResetPassword from "pages/ResetPassword";
import ScanLogin from "pages/ScanLogin";
import Choose from "pages/Choose";
import Activate from "pages/Activate";

class AccountLayout extends PureComponent {
    state = {
        loading: true,
        toast: { open: false, text: "", severity: "", timeout: 0 }
    };

    componentDidMount() {
        this.initData();
        eventEmitter.on("app/openToast", this.openToast);
    }

    initData = async () => {
        const { location, dispatch, history, app } = this.props;

        // 如果已经初始化 则不再重新初始化
        if (app.client.id) return this.setState({ loading: false });

        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        const clientId = query["client-id"];
        if (!clientId) return this.disableNext("Client ID参数错误，请检查");

        const client = await http.get("clients/" + clientId);
        if (!client) return this.disableNext("应用不存在或Client ID错误，请检查");

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
                return this.disableNext("Redirect URI未配置，请登录控制台配置");

            if (!client.redirectUris.includes(query["redirect-uri"]))
                return this.disableNext("Redirect URI参数错误，请检查");
        }

        const mySessions = await http.get("my-sessions");
        if (mySessions.length) {
            dispatch({ type: "app", mySessions });
            history.replace("/account/choose" + location.search);
        } else {
            history.replace("/account" + location.search);
        }

        this.setState({ loading: false });
    };

    disableNext = text => {
        const { dispatch } = this.props;

        this.openToast({ text, severity: "error" });
        dispatch({ type: "app", nextDisabled: true });

        this.setState({ loading: false });
    };

    openToast = async toast => {
        const {
            toast: { open }
        } = this.state;
        if (open) await this.closeToast();

        this.setState({ toast: { open: true, severity: "success", timeout: 4000, ...toast } });
    };

    closeToast = (_, reason) => {
        if (reason === "clickaway") return;

        this.setState(({ toast }) => ({ toast: { ...toast, open: false } }));
    };

    render() {
        const { toast, loading } = this.state;
        const {
            match,
            app: { client }
        } = this.props;

        return (
            <div className={styles.root}>
                <Snackbar
                    open={toast.open}
                    autoHideDuration={toast.timeout}
                    onClose={this.closeToast}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert elevation={1} severity={toast.severity}>
                        {toast.text}
                    </Alert>
                </Snackbar>
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
                                <Route path={`${match.path}/choose`}>
                                    <Choose />
                                </Route>
                                <Route path={`${match.path}/activate`}>
                                    <Activate />
                                </Route>
                                <Route path={match.path}>
                                    <Account />
                                </Route>
                            </Switch>
                        )}
                    </div>
                </div>
                <footer>
                    <Link component={RouterLink} to="/support">
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

export default connect(({ app }) => ({ app }))(withRouter(AccountLayout));
