import React, { PureComponent } from "react";
import { getRandomValue } from "my/utils";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./ScanLogin.module.css";
import { Button, Dialog, DialogTitle, IconButton, DialogContent } from "@material-ui/core";
import { Close, Android } from "@material-ui/icons";

class ScanLogin extends PureComponent {
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
            app: { client },
            history,
            location
        } = this.props;

        // if (!client.id) {
        //     history.replace("/account" + location.search);
        //     return;
        // }

        const text = {
            uid: getRandomValue(),
            clientId: client.id
        };
        new window.QRCode(this.ref1.current, {
            text: JSON.stringify(text),
            width: 256,
            height: 256
        });
    }

    showDialog = () => {
        this.setState({ dialogVisible: true });

        setTimeout(() => {
            this.code = new window.QRCode(this.ref2.current, {
                text: "https://www.onlyid.net/static/downloads/onlyid.apk",
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
                <div ref={this.ref1} className={styles.qrCodeBox} />
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
                        <p className={styles.title2}>
                            <Android style={{ color: "#2FD96C" }} />
                            Android
                        </p>
                        <p>用手机浏览器、微信等扫码：</p>
                        <div ref={this.ref2} className={styles.qrCodeBox1} />
                        <p className={styles.title2}>
                            <i className="iconfont" style={{ color: "#fd2420" }}>
                                &#xe72c;
                            </i>
                            iPhone
                        </p>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(ScanLogin));
