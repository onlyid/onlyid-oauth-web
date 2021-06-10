import React, { Suspense, PureComponent } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import qs from "qs";

const Account = React.lazy(() => import("pages/Account"));
const Support = React.lazy(() => import("pages/Support"));
const DownloadApp = React.lazy(() => import("pages/DownloadApp"));

class App extends PureComponent {
    unlisten = null;

    componentDidMount() {
        const { search } = window.location;
        const query = qs.parse(search, { ignoreQueryPrefix: true });
        // eslint-disable-next-line no-unused-expressions
        if (query.view === "zoomed") import("assets/view-zoomed.css");

        this.listenHistory();
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

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
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
            </>
        );
    }
}

export default withRouter(App);
