import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

const Index = React.lazy(() => import("pages/Index"));

function App() {
    return (
        <Router basename="/oauth">
            <CssBaseline />
            <Suspense fallback={<div>加载中，请稍候</div>}>
                <Switch>
                    <Route path="/">{<Index />}</Route>
                </Switch>
            </Suspense>
        </Router>
    );
}

export default App;
