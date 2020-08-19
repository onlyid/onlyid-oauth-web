import React, { PureComponent } from "react";
import openWithBrowser from "assets/open-with-browser.png";
import styles from "./DownloadApp.module.css";
import guideArrow from "assets/guide-arrow.png";

class DownloadApp extends PureComponent {
    state = {
        isWeChat: true
    };

    componentDidMount() {
        document.title = "下载 唯ID APP";

        if (!navigator.userAgent.includes("MicroMessenger")) {
            window.location.replace(window.location.origin + "/static/downloads/onlyid.apk");
            this.setState({ isWeChat: false });
        }
    }

    render() {
        const { isWeChat } = this.state;

        if (!isWeChat) return null;

        return (
            <div className={styles.root}>
                <div className={styles.guideArrow}>
                    <img src={guideArrow} alt="guideArrow" />
                </div>
                <div className={styles.box1}>
                    <p>右上角菜单选择：</p>
                    <img
                        src={openWithBrowser}
                        alt="openWithBrowser"
                        className={styles.openWithBrowser}
                    />
                </div>
            </div>
        );
    }
}

export default DownloadApp;
