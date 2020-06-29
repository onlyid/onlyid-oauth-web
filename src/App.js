import React, { Suspense, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import styles from "pages/index.module.css";
import qs from "qs";

const AccountLayout = React.lazy(() => import("components/AccountLayout"));
const Support = React.lazy(() => import("pages/Support"));

const loading = (
    <div style={{ paddingTop: "40vh", textAlign: "center" }}>
        <CircularProgress />
    </div>
);

function App(props) {
    const { search } = window.location;
    const query = qs.parse(search, { ignoreQueryPrefix: true });

    // eslint-disable-next-line no-unused-expressions
    if (query.view === "zoomed") import("assets/zoomed.css");

    const history = useHistory();
    useEffect(() => {
        const unlisten = history.listen((location, action) => {
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

        return () => {
            unlisten();
        };
    }, [history]);

    return (
        <>
            {query.theme === "dark" && <div className={styles.dark} />}
            <Suspense fallback={loading}>
                <Switch>
                    <Route path="/support">
                        <Support />
                    </Route>
                    <Route path="/account">
                        <AccountLayout />
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

export default App;
