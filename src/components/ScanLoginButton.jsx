import styles from "./ScanLoginButton.module.css"
import { Hidden } from "@material-ui/core"
import { useHistory, useLocation } from "react-router-dom"

function ScanLoginButton({ style }) {
    const history = useHistory()
    const location = useLocation()

    const scanLogin = () => {
        const { search } = location
        history.push("/scan-login" + search)
    }

    return (
        <Hidden xsDown>
            <div className={styles.root} style={style}>
                <div className={styles.button} onClick={scanLogin}>
                    <span className="material-icons">qr_code</span>
                    <p>扫码登录</p>
                </div>
            </div>
        </Hidden>
    )
}

export default ScanLoginButton
