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
                <h2>常见问题</h2>
                <div>
                    <Accordion
                        expanded={expanded === 1}
                        onChange={(_, expanded1) => this.onChange(1, expanded1)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            使用唯ID是否收费？
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <p style={{ marginTop: 0 }}>
                                    唯ID用户端的所有产品和服务都是{" "}
                                    <span style={{ fontWeight: 500 }}>免费</span> 的。
                                </p>
                                <p style={{ marginBottom: 0 }}>
                                    以任何形式使用唯ID的任何产品和服务（如接收短信验证码、使用唯ID
                                    APP扫码登录网站等）均不收取任何费用。
                                </p>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={expanded === 2}
                        onChange={(_, expanded1) => this.onChange(2, expanded1)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            唯ID怎么保护我的隐私？
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul style={{ margin: 0 }}>
                                <li>
                                    唯ID非常重视对用户隐私的保护，我们只收集产品使用、安全风控等必需的信息，同时使用符合业界规范的方式妥善保存。
                                </li>
                                <li>
                                    你的账号信息只有你登录过（视为授权）的应用可以访问，其他应用无权访问，你也可以在唯ID
                                    APP撤销对某个应用的授权。
                                </li>
                                <li>
                                    你可以使用唯ID
                                    APP管理个人账号信息，只填写愿意开放给登录应用访问的信息，如：你认为性别是用户隐私，则可以不填写。
                                </li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={expanded === 3}
                        onChange={(_, expanded1) => this.onChange(3, expanded1)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            唯ID怎么保障我的账号安全？
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <p style={{ marginTop: 0 }}>
                                    用户账号安全是唯ID所有工作的重中之重，我们采用了诸多安全措施，包括：
                                </p>
                                <ul style={{ marginBottom: 0 }}>
                                    <li>
                                        基于OAuth 2.0构建。 OAuth
                                        2.0是授权的工业级标准，可以确保只有你登录过（视为授权）的应用可以访问你的账号信息，其他应用无法访问。
                                    </li>
                                    <li>
                                        全站HTTPS。
                                        HTTPS是网络传输的业界标准加密方式，所有和唯ID服务器交互的请求/响应均通过HTTPS传输，确保数据安全不被窃取。
                                    </li>
                                    <li>
                                        密码安全存储。
                                        对于密码等敏感数据，采用符合业界标准的方式处理和存储。
                                    </li>
                                    <li>
                                        基于人工智能的天网风控。
                                        唯ID团队有前招商银行风控、反欺诈安全专家，打造银行支付级别风控系统，为你的每一次登录保驾护航。
                                    </li>
                                </ul>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={expanded === 4}
                        onChange={(_, expanded1) => this.onChange(4, expanded1)}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            怎么修改我的账号信息？
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <p style={{ marginTop: 0 }}>
                                    你可以更新、新增或删除包括头像、昵称、手机号和邮箱在内的个人账号信息。
                                </p>
                                <p>请下载使用唯ID APP管理你的账号信息。</p>
                                <p style={{ marginBottom: 0 }}>
                                    APP还有一键扫码登录、可信设备管理、授权应用管理等一系列功能，推荐下载使用。
                                </p>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </>
        );
    }
}
