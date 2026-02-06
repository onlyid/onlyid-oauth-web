import React, { PureComponent } from "react"
import {
    Button,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@material-ui/core"
import http from "my/http"
import CaptchaDialog from "./CaptchaDialog"

class OtpInput extends PureComponent {
    static defaultProps = {
        label: "验证码"
    }

    state = {
        sent: false,
        countDown: 60,
        captchaOpen: false
    }

    sendOtp = async () => {
        const { recipient, clientId } = this.props
        const data = await http.post("send-otp", { recipient, clientId })

        if (data && data.requireCaptcha) {
            this.toggleCaptcha()
            return
        }

        this.setState({ countDown: 60, sent: true })
        const h = setInterval(() => {
            let { countDown } = this.state
            countDown--
            this.setState({ countDown })
            if (countDown === 0) {
                clearInterval(h)
                this.setState({ sent: false })
            }
        }, 1000)
    }

    toggleCaptcha = () => {
        this.setState(({ captchaOpen }) => ({ captchaOpen: !captchaOpen }))
    }

    render() {
        const { error, onChange, helperText, label, ...restProps } = this.props
        const { sent, countDown, captchaOpen } = this.state

        delete restProps.recipient
        delete restProps.clientId

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
                            <Button onClick={this.sendOtp} disabled={sent} color="primary">
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
                    onCancel={this.toggleCaptcha}
                    onSuccess={() => {
                        this.toggleCaptcha()
                        this.sendOtp()
                    }}
                />
            </FormControl>
        )
    }
}

export default OtpInput
