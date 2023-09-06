import React, { PureComponent } from "react";
import styles from "./Contact.module.css";
import weChat155 from "assets/wechat-155.jpeg";
import { Hidden, Paper, Popper } from "@material-ui/core";
import classNames from "classnames";

export default class extends PureComponent {
    state = {
        anchorEl: null
    };

    showWeChat = (e) => {
        this.setState({ anchorEl: e.currentTarget });
    };

    closeWeChat = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;

        return (
            <div className={styles.root}>
                <h2>联系客服</h2>
                <Paper style={{ padding: "1px 1rem" }}>
                    <p>如果以上信息不能解决你的问题，欢迎联系我们。</p>
                    <ul>
                        <li>
                            <span className="material-icons">phone</span>电话 / 微信
                            <Hidden xsDown>
                                <span
                                    className="material-icons"
                                    style={{ margin: 0 }}
                                    onMouseEnter={this.showWeChat}
                                    onMouseLeave={this.closeWeChat}
                                >
                                    qr_code
                                </span>
                            </Hidden>
                            ：15521312099
                        </li>
                        <li>
                            <span className={classNames("iconfont", styles.qq)}>&#xe676;</span>
                            QQ：452391310
                        </li>
                        <li>
                            <span className="material-icons">mail</span>邮箱：
                            <a href="mailto:help@onlyid.net" className={styles.mailTo}>
                                help@onlyid.net
                            </a>
                        </li>
                    </ul>
                    <p>客服时间是每天9:00-21:00（国家法定节假日除外）。</p>
                    <p>
                        紧急情况（如账号被盗用）请直接拨打：
                        <span style={{ fontSize: "1.1rem" }}>15521312099</span>，
                        <span style={{ fontWeight: 500 }}>7x24小时随时响应</span>保障你的账号安全。
                    </p>
                </Paper>
                <Popper
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    placement="top"
                    className={styles.popper1}
                >
                    <Paper>
                        <img src={weChat155} alt="weChat" />
                    </Paper>
                </Popper>
            </div>
        );
    }
}
