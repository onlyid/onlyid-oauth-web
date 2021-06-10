import React, { Suspense, PureComponent } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { CircularProgress, Snackbar } from "@material-ui/core";
import qs from "qs";
import { Alert } from "@material-ui/lab";
import { eventEmitter } from "./my/utils";

const Account = React.lazy(() => import("pages/Account"));
const Support = React.lazy(() => import("pages/Support"));
const DownloadApp = React.lazy(() => import("pages/DownloadApp"));

class App extends PureComponent {
    unlisten = null;
    state = {
        toast: { open: false, text: "", severity: "", timeout: 0 }
    };

    componentDidMount() {
        const { search } = window.location;
        const query = qs.parse(search, { ignoreQueryPrefix: true });
        // eslint-disable-next-line no-unused-expressions
        if (query.view === "zoomed") import("assets/view-zoomed.css");

        this.listenHistory();

        eventEmitter.on("app/openToast", this.openToast);
    }

    componentWillUnmount() {
        this.unlisten();
    }

    listenHistory = () => {
        const { history } = this.props;

        this.unlisten = history.listen((location, action) => {
            // 如果是返回 则让浏览器自动处理
            if (action === "POP") return;

            const { hash } = location;
            if (hash) {
                setTimeout(() => {
                    const element = document.getElementById(hash.substr(1));
                    if (!element) return;

                    element.scrollIntoView();
                }, 100);
            } else {
                window.scrollTo(0, 0);
            }
        });
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
        const { toast } = this.state;
        const { search } = window.location;
        const query = qs.parse(search, { ignoreQueryPrefix: true });

        const loading = (
            <div style={{ paddingTop: "40vh", textAlign: "center" }}>
                <CircularProgress />
            </div>
        );

        return (
            <>
                {query.theme === "dark" && <div className="themeDark" />}
                <Suspense fallback={loading}>
                    <Switch>
                        <Route path="/support">
                            <Support />
                        </Route>
                        <Route path="/download-app">
                            <DownloadApp />
                        </Route>
                        <Route path="/account">
                            <Account />
                        </Route>
                        <Route
                            path="/"
                            render={props => (
                                <Redirect
                                    to={{
                                        pathname: "/account",
                                        search: props.location.search
                                    }}
                                />
                            )}
                        />
                    </Switch>
                </Suspense>
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
            </>
        );
    }
}

export default withRouter(App);
