import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import AccountLayout from "components/AccountLayout";

const Support = React.lazy(() => import("pages/Support"));

const loading = (
    <div style={{ marginTop: "40vh", textAlign: "center" }}>
        <CircularProgress />
    </div>
);

function App(props) {
    return (
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
    );
}

export default App;
