import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from "@material-ui/core"
import PasswordInput from "@/components/PasswordInput"
import OtpInput from "@/components/OtpInput"
import Validator from "async-validator"
import request from "@/my/request"
import IconAndAvatar from "@/components/IconAndAvatar"
import { redirectCode } from "@/my/utils"
import { NEW_PASSWORD_RULE } from "@/my/constants"
import withLayout from "@/components/MyLayout"

const RULES = {
    otp: [{ required: true, message: "请输入" }],
    password: NEW_PASSWORD_RULE
}
const validator = new Validator(RULES)

function ResetPassword() {
    const [validation, setValidation] = useState({ otp: {}, password: {} })
    const [otp, setOtp] = useState(null)
    const [password, setPassword] = useState(null)
    const app = useSelector((state) => state.app)
    const history = useHistory()
    const location = useLocation()

    const onSubmit = async (e) => {
        e.preventDefault()

        const { account, client } = app
        const { search } = location

        // 校验表单
        try {
            const values = { otp, password }
            await validator.validate(values, { firstFields: true })
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true }

            return setValidation({ ...validation })
        }

        const { authorizationCode } = await request.put("auth/reset-password", {
            account,
            otp,
            password,
            clientId: client.id
        })

        redirectCode(client, search, authorizationCode)
    }

    const validateField = async ({ target: { name: key, value } }) => {
        try {
            await validator.validate({ [key]: value }, { keys: [key], first: true })
            validation[key] = {}
        } catch ({ errors }) {
            validation[key] = { text: errors[0].message, error: true }
        }
        setValidation({ ...validation })
    }

    const back = () => {
        history.goBack()
    }

    const onChange = ({ target: { name, value } }) => {
        if (name === "otp") setOtp(value)
        else if (name === "password") setPassword(value)
    }

    const { account, client } = app

    return (
        <div>
            <IconAndAvatar />
            <form onSubmit={onSubmit} style={{ marginTop: 30 }} className="form1">
                <FormControl variant="outlined" fullWidth disabled>
                    <InputLabel htmlFor="account-input">账号</InputLabel>
                    <OutlinedInput id="account-input" label="账号" value={account} />
                    <FormHelperText />
                </FormControl>
                <OtpInput
                    name="otp"
                    error={validation.otp.error}
                    onChange={onChange}
                    helperText={validation.otp.text}
                    recipient={account}
                    clientId={client.id}
                    onBlur={validateField}
                />
                <PasswordInput
                    name="password"
                    error={validation.password.error}
                    onChange={onChange}
                    helperText={validation.password.text}
                    label="新密码"
                    onBlur={validateField}
                    autoComplete="new-password"
                />
                <div style={{ marginTop: 20 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={onSubmit}
                        size="large"
                    >
                        重设密码并登录
                    </Button>
                </div>
            </form>
            <div className="oneButtonBox" style={{ marginTop: 35 }}>
                <Button variant="outlined" onClick={back} size="small">
                    取 消
                </Button>
            </div>
        </div>
    )
}

export default withLayout(ResetPassword)
