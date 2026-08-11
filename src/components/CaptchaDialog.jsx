import { useEffect, useState } from "react"
import { Dialog, DialogContent, LinearProgress } from "@material-ui/core"
import request from "../my/request"
import { useSelector } from "react-redux"
import styles from "./CaptchaDialog.module.css"

function CaptchaDialog({ open, onCancel, onSuccess }) {
    const [loading, setLoading] = useState(true)
    const app = useSelector((state) => state.app)

    // 每次打开都init一次
    useEffect(() => {
        if (open) initData()
    }, [open])

    const initData = async () => {
        setLoading(true)

        const data = await request.get("geetest/register")
        const params = {
            gt: data.gt,
            challenge: data.challenge,
            new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
            offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
            width: "100%"
        }
        window.initGeetest(params, handleCaptchaObj)
    }

    const handleCaptchaObj = (captchaObj) => {
        captchaObj.appendTo("#captcha")
        captchaObj.onReady(() => {
            setLoading(false)
        })
        captchaObj.onSuccess(async () => {
            const { account } = app
            const result = captchaObj.getValidate()

            await request.post("geetest/validate", {
                challenge: result.geetest_challenge,
                validate: result.geetest_validate,
                seccode: result.geetest_seccode,
                account
            })

            onSuccess()
        })
    }

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

export default CaptchaDialog
