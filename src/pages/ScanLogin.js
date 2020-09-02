import React, { PureComponent } from "react";
import { eventEmitter, getRandomValue, redirectCode } from "my/utils";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./ScanLogin.module.css";
import { Button, Dialog, DialogTitle, IconButton, DialogContent } from "@material-ui/core";
import { Close, Android, Check } from "@material-ui/icons";
import icon from "assets/ic_launcher.png";
import http from "my/http";

class ScanLogin extends PureComponent {
    unmounted = false;

    state = {
        dialogVisible: false
    };

    constructor(props) {
        super(props);
        this.ref1 = React.createRef();
        this.ref2 = React.createRef();
    }

    componentDidMount() {
        const {
            app: { client }
        } = this.props;

        const text = {
            uid: getRandomValue(),
            clientId: client.id
        };
        new window.QRCode(this.ref1.current, {
            text: JSON.stringify(text),
            width: 256,
            height: 256
        });

        this.startLoop(text);
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    startLoop = async params => {
        const {
            app: { client },
            location: { search },
            history
        } = this.props;

        let code;
        while (true) {
            const { authorizationCode } = await http.post("oauth/scan-login", params);

            if (this.unmounted) return;

            if (authorizationCode) {
                code = authorizationCode;
                break;
            }
        }

        if (code === "reject") {
            eventEmitter.emit("app/openToast", {
                message: "你拒绝了本次登录请求",
                severity: "warning"
            });
            history.goBack();
            return;
        }

        redirectCode(client, search, code);
    };

    showDialog = () => {
        this.setState({ dialogVisible: true });

        setTimeout(() => {
            this.code = new window.QRCode(this.ref2.current, {
                text: window.location.origin + "/oauth/download-app",
                width: 128,
                height: 128
            });
        }, 100);
    };

    closeDialog = () => {
        this.setState({ dialogVisible: false });
    };

    back = () => {
        const { history } = this.props;
        history.goBack();
    };

    render() {
        const {
            app: { client }
        } = this.props;
        const { dialogVisible } = this.state;

        return (
            <div className={styles.root}>
                <p className={styles.title1}>扫码登录</p>
                <div ref={this.ref1} className={styles.qrCodeBox1} />
                <p className="tip">用 唯ID APP 扫码登录「{client.name}」</p>
                <div className={styles.downloadButtonBox}>
                    <Button
                        variant="outlined"
                        onClick={this.showDialog}
                        size="small"
                        color="primary"
                    >
                        下载 APP
                    </Button>
                </div>
                <div className={styles.accountButtonBox}>
                    <Button onClick={this.back} size="small" color="primary">
                        账号密码登录
                    </Button>
                </div>
                <Dialog onClose={this.closeDialog} open={dialogVisible}>
                    <DialogTitle>
                        下载 APP
                        <IconButton className="dialogCloseButton" onClick={this.closeDialog}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <div className={styles.dialogContent1}>
                            <div className={styles.appBox}>
                                <img src={icon} alt="icon" />
                                <br />
                                <span>唯ID</span>
                            </div>
                            <div className={styles.appDesc}>
                                <p className={styles.title3}>使用唯ID 客户端：</p>
                                <ul>
                                    <li>
                                        <Check />
                                        管理账号资料
                                    </li>
                                    <li>
                                        <Check />
                                        一键扫码登录
                                    </li>
                                    <li>
                                        <Check />
                                        管理可信设备
                                    </li>
                                    <li>
                                        <Check />
                                        管理授权应用
                                    </li>
                                </ul>
                                <p>更多功能等你亲自探索。。。</p>
                            </div>
                        </div>
                        <div className={styles.dialogContent2}>
                            <div>
                                <p className={styles.title2}>
                                    <Android style={{ color: "#2FD96C" }} />
                                    Android
                                </p>
                                <p>用手机浏览器、微信扫码：</p>
                                <div ref={this.ref2} className={styles.qrCodeBox2} />
                            </div>
                            <div className={styles.divider} />
                            <div>
                                <div>
                                    <p className={styles.title2}>
                                        <i className="iconfont" style={{ color: "#3f51b5" }}>
                                            &#xe72c;
                                        </i>
                                        iPhone
                                    </p>
                                    <p>
                                        App Store 搜索「唯ID」，
                                        <br />
                                        下载安装。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(ScanLogin));