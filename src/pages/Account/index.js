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
import Choose from "./Choose";
import Activate from "./Activate";
import _ from "lodash";
import classNames from "classnames";

class Account extends PureComponent {
    ref1;

    state = {
        loading: true,
        nextDisabled: false,
        users: []
    };

    constructor(props) {
        super(props);
        this.ref1 = React.createRef();
    }

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

        // 注入自定义背景
        for (const item of oauthConfig.background) {
            const array = item.split(/:(.+)/);
            this.ref1.current.style[_.camelCase(array[0])] = array[1];
        }

        const params = { tenant: client.tenant };
        const users = await http.get("users/by-session", { params });
        if (users.length) {
            this.setState({ users });
            history.replace("/account/choose" + location.search);
        } else {
            history.replace("/account" + location.search);
        }

        this.setState({ loading: false });
    };

    disableNext = (text) => {
        const { history, location } = this.props;

        eventEmitter.emit("app/openToast", { text, severity: "error" });
        history.replace("/account" + location.search);
        this.setState({ loading: false, nextDisabled: true });
    };

    onDelete = (userId) => {
        this.setState(({ users }) => ({ users: users.filter((u) => u.id !== userId) }));
    };

    render() {
        const { loading, nextDisabled, users } = this.state;
        const {
            match,
            app: { oauthConfig },
            location
        } = this.props;

        return (
            <div
                className={classNames(styles.root, {
                    [styles.bg]: !oauthConfig.background.length && !loading
                })}
                ref={this.ref1}
            >
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
                                    <Choose users={users} onDelete={this.onDelete} />
                                </Route>
                                <Route path={`${match.path}/activate`}>
                                    <Activate />
                                </Route>
                                <Route path={match.path}>
                                    <Home nextDisabled={nextDisabled} />
                                </Route>
                            </Switch>
                        )}
                    </div>
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
                    <Divider style={{ marginTop: 20, width: 250 }} />
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

export default connect(({ app }) => ({ app }))(withRouter(Account));
