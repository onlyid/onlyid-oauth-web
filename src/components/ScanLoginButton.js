import React, { PureComponent } from "react";
import styles from "./ScanLoginButton.module.css";
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
                <div className={styles.root}>
                    <div className={styles.button} onClick={this.scanLogin}>
                        <span className="material-icons">qr_code</span>
                        <p>扫码登录</p>
                    </div>
                </div>
            </Hidden>
        );
    }
}

export default withRouter(ScanLoginButton);
