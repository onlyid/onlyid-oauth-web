import React, { PureComponent } from "react";
import styles from "./Support.module.css";
import logo from "assets/support-logo.png";
import { Alert } from "@material-ui/lab";
import { Button, Hidden, Link } from "@material-ui/core";
import wechat155 from "assets/wechat-155.jpeg";
import { withRouter } from "react-router-dom";

class Support extends PureComponent {
    back = () => {
        const { history } = this.props;
        history.goBack();
    };

    render() {
        return (
            <div className={styles.root}>
                <header>
                    <img src={logo} alt="logo" width="40" />
                    <h1>需要帮助？</h1>
                </header>
                <Alert severity="info" className={styles.tipBox}>
                    <p>
                        本网站/APP使用「唯ID」统一、专业、安全的账号和认证解决方案，用于解决登录和认证过程中可能遇到的各种复杂问题。
                    </p>
                    <p style={{ marginBottom: 0 }}>
                        你的「唯ID」账号是你的网上"身份证"，独立于你登录的网站/APP。只需一个账号，就可以登录所有接入的网站和APP，畅游全球互联网。
                    </p>
                </Alert>
                <main>
                    <p>
                        本页面描述了你使用唯ID过程中可能遇到的问题，你也可以&nbsp;
                        <Link href="#contact">联系客服获取帮助。</Link>
                        （注：对于使用接入网站/APP本身遇到的问题，请寻求对应网站/APP的支持帮助。）
                    </p>
                    <h2>常见问题</h2>
                    <h3>使用唯ID是否收费？</h3>
                    <p>以任何形式使用唯ID任何产品（例如接收短信验证码），均不收取任何费用。</p>
                    <h3>可在哪些平台上使用唯ID？</h3>
                    <p>iOS、Android和网页均支持使用唯ID。</p>
                    <ul>
                        <li>对于iOS，支持iOS 10或更高版本。</li>
                        <li>对于Android，支持Android 5.0或更高版本。</li>
                        <li>对于网页，支持IE 11、Firefox和Chrome等现代浏览器。</li>
                    </ul>
                    <h3>使用唯ID是否会泄露隐私？</h3>
                    <p>
                        我们非常重视用户隐私，只收集产品运行必需的信息，同时使用符合业界规范的方式妥善保存。
                    </p>
                    <p>在网站/APP即将获取你的信息前，也会有清晰明确的提示。</p>
                    <h3>为什么从保存的书签访问登录页，发生异常？</h3>
                    <p>
                        唯ID不是你要登录网站的首页，请不要把唯ID登录页保存书签。你应该永远从要登录的网站跳转过来，否则可能缺失必要的参数，甚至登录非预期的网站。
                    </p>
                    <h2 id="contact">联系客服</h2>
                    <p>如果以上信息不能解决你的问题，请联系客服获取帮助。</p>
                    <div className={styles.contactBox}>
                        <div className={styles.left}>
                            <p>客服电话：15521312099</p>
                            <p>客服邮箱：help@onlyid.net</p>
                            <p>客服QQ：452391310</p>
                            <p>客服微信：15521312099</p>
                        </div>
                        <div className={styles.right}>
                            <img src={wechat155} alt="微信" style={{ verticalAlign: "middle" }} />
                        </div>
                    </div>
                    <div className={styles.backBox}>
                        <Button variant="contained" color="primary" onClick={this.back}>
                            返回
                        </Button>
                    </div>
                </main>
                <footer>
                    &copy; 2015 - {new Date().getFullYear()}
                    <span style={{ marginLeft: 20 }}>深圳市友全科技有限公司</span>
                    <Hidden xsDown>
                        <span style={{ marginLeft: 20 }}>All rights reserved.</span>
                    </Hidden>
                </footer>
            </div>
        );
    }
}

export default withRouter(Support);
