import React, { PureComponent } from "react";
import { Alert } from "@material-ui/lab";
import { Divider, Link, Snackbar } from "@material-ui/core";
import { eventEmitter } from "my/utils";
import styles from "./index.module.css";
import qs from "qs";
import http from "my/http";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Link as RouterLink } from "react-router-dom";
import logo from "assets/logo.svg";
import IconAndAvatar from "components/IconAndAvatar";

const Account = React.lazy(() => import("pages/Account"));
const SignUp = React.lazy(() => import("pages/SignUp"));
const SignIn = React.lazy(() => import("pages/SignIn"));

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
        if (!clientId) {
            this.openToast({ message: "client id参数错误，请检查" });
            return;
        }

        const client = await http.get("oauth/clients/" + query["client-id"]);
        if (!client) {
            this.openToast({ message: "应用不存在或client id错误，请检查" });
            return;
        }

        dispatch({ type: "app/save", payload: { client } });
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
        const { match } = this.props;

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
                <div>
                    <IconAndAvatar />
                    <Switch>
                        <Route path={`${match.path}/sign-in`}>
                            <SignIn />
                        </Route>
                        <Route path={`${match.path}/sign-up`}>
                            <SignUp />
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
                    <img src={logo} alt="logo" width="100" />
                    <p className="tip">
                        使用一个「唯ID」账号登录所有接入的网站和APP，畅游全球互联网。
                        <Link href="https://www.onlyid.net/home/about/manifesto" target="_blank">
                            了解更多
                        </Link>
                    </p>
                </footer>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(AccountLayout));
