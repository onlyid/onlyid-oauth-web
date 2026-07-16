import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useHistory } from "react-router-dom"
import { Button } from "@material-ui/core"
import http from "my/http"
import PasswordInput from "components/PasswordInput"
import OtpInput from "components/OtpInput"
import Validator from "async-validator"
import IconAndAvatar from "components/IconAndAvatar"
import { Edit } from "@material-ui/icons"
import { redirectCode } from "my/utils"
import CaptchaDialog from "components/CaptchaDialog"
import withLayout from "components/MyLayout"

const RULES = {
    otp: [{ required: true, message: "请输入" }],
    password: [{ required: true, message: "请输入" }]
}
const validator = new Validator(RULES)

function Login() {
    const [validation, setValidation] = useState({})
    const [inputValue, setInputValue] = useState("")
    const [loginType, setLoginType] = useState("password")
    const [captchaOpen, setCaptchaOpen] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const app = useSelector((state) => state.app)

    const back = () => {
        history.goBack()
    }

    const onSubmit = async (e) => {
        e && e.preventDefault()

        const { account, client } = app
        const { search } = location

        if (!(await validateField())) return

        const { authorizationCode, requireCaptcha } = await http.post("auth/login", {
            account,
            [loginType]: inputValue,
            clientId: client.id
        })

        if (requireCaptcha) {
            openCaptcha()
            return
        }

        redirectCode(client, search, authorizationCode)
    }

    const onChange = (e) => {
        setInputValue(e.target.value)
    }

    const validateField = async () => {
        let validation
        try {
            const key = loginType
            await validator.validate({ [key]: inputValue }, { keys: [key], first: true })
            validation = {}
            return true
        } catch ({ errors }) {
            validation = { text: errors[0].message, error: true }
            return false
        } finally {
            setValidation(validation)
        }
    }

    const toggleLoginType = () => {
        setLoginType(loginType === "password" ? "otp" : "password")
        setInputValue("")
    }

    const resetPassword = () => {
        const { search } = location
        history.push("/reset-password" + search)
    }

    const openCaptcha = () => {
        setCaptchaOpen(true)
    }

    const closeCaptcha = () => {
        setCaptchaOpen(false)
    }

    const { account, client } = app

    return (
        <div>
            <IconAndAvatar />
            <div className="accountBox">
                <Button startIcon={<Edit />} size="large" variant="outlined" onClick={back}>
                    {account}
                </Button>
            </div>
            <form onSubmit={onSubmit} style={{ marginTop: 20 }}>
                {loginType === "password" ? (
                    <PasswordInput
                        error={validation.error}
                        onChange={onChange}
                        helperText={validation.text}
                        onBlur={validateField}
                    />
                ) : (
                    <OtpInput
                        error={validation.error}
                        onChange={onChange}
                        helperText={validation.text}
                        recipient={account}
                        clientId={client.id}
                        onBlur={validateField}
                    />
                )}
                <div style={{ marginTop: 20 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={onSubmit}
                        size="large"
                    >
                        登 录
                    </Button>
                </div>
            </form>
            <div className="twoButtonBox">
                <Button variant="outlined" color="primary" onClick={toggleLoginType} size="small">
                    {loginType === "password" ? "验证码登录" : "密码登录"}
                </Button>
                <Button
                    variant="outlined"
                    onClick={resetPassword}
                    size="small"
                    style={{ paddingRight: 3 }}
                >
                    忘记密码？
                </Button>
            </div>
            <CaptchaDialog
                open={captchaOpen}
                onCancel={closeCaptcha}
                onSuccess={() => {
                    closeCaptcha()
                    onSubmit()
                }}
            />
        </div>
    )
}

export default withLayout(Login)
