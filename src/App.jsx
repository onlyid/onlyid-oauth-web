import React, { Suspense } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { CircularProgress } from "@material-ui/core"

// 关键页面不要延迟加载
import Home from "pages/Home"
import SignUp from "pages/SignUp"
import Login from "pages/Login"
import ResetPassword from "pages/ResetPassword"
import ScanLogin from "pages/ScanLogin"
import Choose from "pages/Choose"
import Hi from "pages/Hi"
import Toast from "components/Toast"

const Support = React.lazy(() => import("pages/Support"))
const DownloadApp = React.lazy(() => import("pages/DownloadApp"))

function App() {
    const loading = (
        <div style={{ paddingTop: "40vh", textAlign: "center" }}>
            <CircularProgress />
        </div>
    )

    return (
        <>
            <Suspense fallback={loading}>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/sign-up">
                        <SignUp />
                    </Route>
                    <Route path="/reset-password">
                        <ResetPassword />
                    </Route>
                    <Route path="/scan-login">
                        <ScanLogin />
                    </Route>
                    <Route path="/choose">
                        <Choose />
                    </Route>
                    <Route path="/home">
                        <Home />
                    </Route>
                    <Route path="/support">
                        <Support />
                    </Route>
                    <Route path="/download-app">
                        <DownloadApp />
                    </Route>
                    <Route path="/hi">
                        <Hi />
                    </Route>
                    <Route
                        render={(props) => (
                            <Redirect to={{ pathname: "/home", search: props.location.search }} />
                        )}
                    />
                </Switch>
            </Suspense>
            <Toast />
        </>
    )
}

export default App
