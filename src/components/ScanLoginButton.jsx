import styles from "./ScanLoginButton.module.css"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import { useHistory, useLocation } from "react-router-dom"

function ScanLoginButton({ style }) {
    const history = useHistory()
    const location = useLocation()
    const theme = useTheme()
    const isXsDown = useMediaQuery(theme.breakpoints.down("sm"))

    const scanLogin = () => {
        const { search } = location
        history.push("/scan-login" + search)
    }

    if (isXsDown) return null

    return (
        <div className={styles.root} style={style}>
            <div className={styles.button} onClick={scanLogin}>
                <span className="material-icons">qr_code</span>
                <p>扫码登录</p>
            </div>
        </div>
    )
}

export default ScanLoginButton
