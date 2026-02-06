import React, { PureComponent } from "react"
import { Dialog, DialogContent, LinearProgress } from "@material-ui/core"
import http from "../my/http"
import { connect } from "react-redux"
import styles from "./CaptchaDialog.module.css"

class CaptchaDialog extends PureComponent {
    state = {
        loading: true
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { open } = this.props
        // 每次打开都init一次
        if (open && !prevProps.open) this.initData()
    }

    initData = async () => {
        this.setState({ loading: true })

        const data = await http.get("geetest/register")
        const params = {
            gt: data.gt,
            challenge: data.challenge,
            new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
            offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
            width: "100%"
        }
        window.initGeetest(params, this.handleCaptchaObj)
    }

    handleCaptchaObj = (captchaObj) => {
        captchaObj.appendTo("#captcha")
        captchaObj.onReady(() => {
            this.setState({ loading: false })
        })
        captchaObj.onSuccess(async () => {
            const {
                onSuccess,
                app: { account }
            } = this.props
            const result = captchaObj.getValidate()

            await http.post("geetest/validate", {
                challenge: result.geetest_challenge,
                validate: result.geetest_validate,
                seccode: result.geetest_seccode,
                account
            })

            onSuccess()
        })
    }

    render() {
        const { open, onCancel } = this.props
        const { loading } = this.state

        return (
            <Dialog open={open} onClose={onCancel}>
                <DialogContent className={styles.content}>
                    <p>为了你的安全，请先完成人机验证：</p>
                    {loading && (
                        <div style={{ padding: "20px 0" }}>
                            <LinearProgress />
                        </div>
                    )}
                    <div id="captcha" />
                </DialogContent>
            </Dialog>
        )
    }
}

export default connect(({ app }) => ({ app }))(CaptchaDialog)
