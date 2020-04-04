import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

// const UserPool = React.lazy(() => import("pages/UserPool"));

function App() {
    return (
        <Router basename="/oauth">
            <Suspense fallback={<div>加载中，请稍候</div>}>
                <Switch>
                    <Route path="/user-pool">{/*<UserPool />*/}</Route>
                </Switch>
            </Suspense>
        </Router>
    );
}

export default App;
