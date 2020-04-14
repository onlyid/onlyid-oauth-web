import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import AccountLayout from "components/AccountLayout";
import styles from "pages/index.module.css";
import qs from "qs";

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

    return (
        <>
            {query.theme === "dark" && <div className={styles.dark} />}
            <BrowserRouter basename="/oauth">
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
            </BrowserRouter>
        </>
    );
}

export default App;
