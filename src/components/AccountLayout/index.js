import React, { PureComponent } from "react";
import { Alert } from "@material-ui/lab";
import { Divider, Link, Snackbar } from "@material-ui/core";
import { eventEmitter } from "my/utils";
import styles from "./index.module.css";
import qs from "qs";
import http from "my/http";
import { connect } from "react-redux";
import { Link as RouterLink, Route, Switch, withRouter } from "react-router-dom";
import logo from "assets/logo.svg";
import Account from "pages/Account";
import SignUp from "pages/SignUp";
import SignIn from "pages/SignIn";
import ResetPassword from "pages/ResetPassword";
import ScanLogin from "pages/ScanLogin";

class AccountLayout extends PureComponent {
    state = {
        toast: {
            open: false,
            severity: null,
            message: null
        }
    };

    componentDidMount() {
        this.initData();
        eventEmitter.on("app/openToast", this.openToast);
    }

    initData = async () => {
        const {
            location: { search },
            dispatch
        } = this.props;

        const query = qs.parse(search, { ignoreQueryPrefix: true });
        const clientId = query["client-id"];
        if (!clientId) return this.disableNext("client id参数错误，请检查");

        const client = await http.get("oauth/clients/" + clientId);
        if (!client) return this.disableNext("应用不存在或client id错误，请检查");

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
                return this.disableNext("应用回调uri未配置，请登录控制台配置");

            if (!client.redirectUris.includes(query["redirect-uri"])) {
                return this.disableNext("redirect uri参数错误，请检查");
            }
        }

        dispatch({ type: "app/save", payload: { client } });
    };

    disableNext = message => {
        const { dispatch } = this.props;

        this.openToast({ message });
        dispatch({ type: "app/save", payload: { nextDisabled: true } });
    };

    openToast = toast => {
        this.setState({ toast: { open: true, ...toast } });
    };

    onClose = (_, reason) => {
        if (reason === "clickaway") return;

        this.setState(({ toast }) => ({ toast: { ...toast, open: false } }));
    };

    render() {
        const {
            toast: { open, severity, message }
        } = this.state;
        const {
            match,
            app: { client }
        } = this.props;

        return (
            <div className={styles.root}>
                <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={this.onClose}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert elevation={1} severity={severity || "error"}>
                        {message}
                    </Alert>
                </Snackbar>
                <div className={styles.card}>
                    <Switch>
                        <Route path={`${match.path}/sign-in`}>
                            <SignIn />
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
                        <Route path={match.path}>
                            <Account />
                        </Route>
                    </Switch>
                </div>
                <footer>
                    <Link component={RouterLink} to="/support">
                        需要帮助？
                    </Link>
                    <Divider style={{ marginTop: 20 }} />
                    <img src={logo} alt="logo" width="100" height="40.5" />
                    <p className="tip">
                        使用一个「唯ID」账号登录所有接入的网站和APP，畅游全球互联网。
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
