import { useState } from "react"
import {
    Button,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@material-ui/core"
import request from "@/my/request"
import CaptchaDialog from "./CaptchaDialog"

function OtpInput({
    label = "验证码",
    recipient,
    clientId,
    error,
    onChange,
    helperText,
    ...restProps
}) {
    const [countDown, setCountDown] = useState(0)
    const [captchaOpen, setCaptchaOpen] = useState(false)

    const sendOtp = async () => {
        const data = await request.post("send-otp", { recipient, clientId })

        if (data && data.requireCaptcha) {
            openCaptcha()
            return
        }

        setCountDown(60)
        const h = setInterval(() => {
            setCountDown((prev) => {
                const next = prev - 1

                if (next === 0) clearInterval(h)

                return next
            })
        }, 1000)
    }

    const openCaptcha = () => {
        setCaptchaOpen(true)
    }

    const closeCaptcha = () => {
        setCaptchaOpen(false)
    }

    // 正在倒计时，则为已发送状态
    const sent = countDown > 0

    return (
        <FormControl variant="outlined" fullWidth error={error}>
            <InputLabel htmlFor="otp-input">{label}</InputLabel>
            <OutlinedInput
                id="otp-input"
                type="tel"
                autoComplete="off"
                onChange={onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <Button onClick={sendOtp} disabled={sent} color="primary">
                            {sent ? countDown + "秒后重试" : "发送验证码"}
                        </Button>
                    </InputAdornment>
                }
                label={label}
                {...restProps}
            />
            <FormHelperText>{helperText}</FormHelperText>
            <CaptchaDialog
                open={captchaOpen}
                onCancel={closeCaptcha}
                onSuccess={() => {
                    closeCaptcha()
                    sendOtp()
                }}
            />
        </FormControl>
    )
}

export default OtpInput
