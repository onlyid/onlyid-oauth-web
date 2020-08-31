import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { Hidden } from "@material-ui/core";
import { withRouter } from "react-router-dom";

class ScanLoginButton extends PureComponent {
    scanLogin = () => {
        const {
            history,
            location: { search }
        } = this.props;
        history.push("/account/scan-login" + search);
    };

    render() {
        return (
            <Hidden xsDown>
                <div className={styles.scanButtonBox}>
                    <div className={styles.scanButton} onClick={this.scanLogin}>
                        <span className="material-icons">qr_code</span>
                        <p>扫码登录</p>
                    </div>
                </div>
            </Hidden>
        );
    }
}

export default withRouter(ScanLoginButton);
