import React, { PureComponent } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

export default class extends PureComponent {
    state = {
        expanded: false
    };

    onChange = (panel, expanded1) => {
        this.setState({ expanded: expanded1 ? panel : false });
    };

    render() {
        const { expanded } = this.state;

        return (
            <>
                <h2>账号安全</h2>
                <div>
                    <Accordion
                        expanded={expanded === 1}
                        onChange={(_, expanded1) => this.onChange(1, expanded1)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            设置安全系数高的密码
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <p style={{ marginTop: 0 }}>
                                    设置一个安全系数高的密码可以防止黑客以及其他不怀好意人士盗用你的账号。
                                </p>
                                <p>
                                    唯ID对密码有最低 <span style={{ fontWeight: 500 }}>强制</span>{" "}
                                    要求：
                                </p>
                                <ul>
                                    <li>不能少于6个字符。</li>
                                    <li>必须包含数字、大写字母、小写字母中的两种。</li>
                                </ul>
                                <p>尽管不是强制要求，唯ID建议：</p>
                                <ul>
                                    <li>使用10个字符以上的密码。</li>
                                    <li>不使用同个账号曾经使用过的密码。</li>
                                    <li>不使用和其他应用一样的密码。</li>
                                </ul>
                                <p>设置一个好密码的建议：</p>
                                <ul style={{ marginBottom: 0 }}>
                                    <li>
                                        选择更容易记住的密码，如一句歌词、一句古诗文、一串有意义的数字等等。
                                    </li>
                                    <li>
                                        避免使用容易猜到的个人信息，如名字缩写、生日、居住街道等等。
                                    </li>
                                    <li>
                                        避免使用常见密码和词组，如：“password”、“abcd”、“qwerty”
                                        等等。
                                    </li>
                                </ul>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={expanded === 2}
                        onChange={(_, expanded1) => this.onChange(2, expanded1)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            保持手机号和邮箱正确且最新
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <p style={{ marginTop: 0 }}>
                                    手机号和邮箱对于你的账号{" "}
                                    <span style={{ fontWeight: 500 }}>非常重要</span>：
                                </p>
                                <ul>
                                    <li>
                                        当你忘记密码（或者怀疑密码泄露）时，唯ID会发送验证码到手机（或邮箱）帮助你重新设置密码。
                                    </li>
                                    <li>
                                        当你的账号有可疑活动时（如异地登录），唯ID会通过短信（或邮件）告知你。
                                    </li>
                                </ul>
                                <p style={{ marginBottom: 0 }}>
                                    请使用唯ID APP更新你的手机号和邮箱。
                                </p>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={expanded === 3}
                        onChange={(_, expanded1) => this.onChange(3, expanded1)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            其他提高帐号安全性的建议
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul style={{ margin: 0 }}>
                                <li>
                                    临时使用公共设备（如网吧电脑）时，不要打开 “记住我”
                                    选项。更进一步，推荐使用浏览器的无痕模式（隐身模式）浏览所有网页。
                                </li>
                                <li>
                                    不要把自己的账号借给他人使用，你的唯ID账号可以登录所有支持唯ID的网站和APP，因此，出借你的账号给他人使用非常危险。
                                </li>
                                <li>
                                    为你的电脑和手机设置足够复杂的开机密码，在临时离开设备时，记得锁定设备屏幕。
                                </li>
                                <li>
                                    保持电脑和手机的操作系统、浏览器以及其他应用为最新版本，否则黑客可能会利用旧版本软件的安全漏洞攻击你。
                                </li>
                                <li>
                                    不要访问可疑的网站、不要打开可疑的电子邮件。唯ID不会通过任何方式（包括网页、电子邮件、短信、电话等）问你的账号密码是什么。
                                </li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </>
        );
    }
}
