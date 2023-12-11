import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { Alert } from "@material-ui/lab";
import { Hidden } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import http from "my/http";
import qs from "qs";
import Faq from "./Faq";
import Security from "./Security";
import Contact from "./Contact";

class Support extends PureComponent {
    state = {
        clientName: null
    };

    back = () => {
        const { history } = this.props;
        history.goBack();
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { location } = this.props;

        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        const client = await http.get("clients/" + query["client-id"]);
        this.setState({ clientName: client.name });
    };

    render() {
        const { clientName } = this.state;

        return (
            <div className={styles.bg}>
                <div className={styles.root}>
                    <header>
                        <h1>需要帮助？</h1>
                    </header>
                    <Alert severity="info" className={styles.tipBox}>
                        <p>
                            「{clientName}
                            」支持用唯ID登录。
                        </p>
                        <p>
                            和微信、微博登录一样，用唯ID也可以登录各种网站、APP。不同的是，唯ID本身没有其他业务，是专业的身份认证产品。
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            你的唯ID账号是一张网上“通行证”，可以登录所有支持唯ID的网站和APP。
                        </p>
                    </Alert>
                    <main>
                        <Faq />
                        <Security />
                        <Contact />
                    </main>
                    <footer>
                        &copy; 2017 - {new Date().getFullYear()}
                        <span style={{ marginLeft: 25 }}>爱达斯科技 IDaaS Tech</span>
                        <Hidden xsDown>
                            <span style={{ marginLeft: 25 }}>粤ICP备16120960号</span>
                        </Hidden>
                    </footer>
                </div>
            </div>
        );
    }
}

export default withRouter(Support);
