import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { Provider } from "react-redux"
import { legacy_createStore as createStore } from "redux"
import reducers from "@/my/reducers"
import { CssBaseline } from "@mui/material"
import { StyledEngineProvider, createTheme, ThemeProvider } from "@mui/material/styles"
import { zhCN } from "@mui/material/locale"
import { BrowserRouter } from "react-router-dom"

const store = createStore(reducers)
const fontFamily = `Roboto,"Noto Sans SC","Helvetica Neue","PingFang SC","Segoe UI","Microsoft YaHei",sans-serif`
const theme = createTheme(
    {
        palette: {
            primary: {
                main: "#3F51B5"
            }
        },
        typography: { fontFamily }
    },
    zhCN
)

const content = (
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <CssBaseline />
                    <BrowserRouter basename="/oauth">
                        <App />
                    </BrowserRouter>
                </Provider>
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>
)
ReactDOM.render(content, document.getElementById("root"))
