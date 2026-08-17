import { useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import styles from "./SignUp.module.css"
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import PasswordInput from "@/components/PasswordInput"
import OtpInput from "@/components/OtpInput"
import Validator from "async-validator"
import request from "@/my/request"
import AvatarUpload from "@/components/AvatarUpload"
import { redirectCode } from "@/my/utils"
import { NEW_PASSWORD_RULE } from "@/my/constants"
import withLayout from "@/components/MyLayout"

const RULES = {
    nickname: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    otp: [{ required: true, message: "请输入" }],
    password: NEW_PASSWORD_RULE
}
const validator = new Validator(RULES)

function SignUp() {
    const [validation, setValidation] = useState({ nickname: {}, otp: {}, password: {} })
    const [otp, setOtp] = useState(null)
    const [password, setPassword] = useState(null)
    const [nickname, setNickname] = useState(null)
    const [filename, setFilename] = useState(null)
    const app = useSelector((state) => state.app)
    const location = useLocation()
    const history = useHistory()

    const onSubmit = async (e) => {
        e.preventDefault()

        const { client, account } = app
        const { search } = location

        // 校验表单
        try {
            const values = { nickname, otp, password }
            await validator.validate(values, { firstFields: true })
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true }

            return setValidation({ ...validation })
        }

        const { authorizationCode } = await request.post("auth/sign-up", {
            filename,
            nickname,
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

    const onChange = ({ target }) => {
        const setters = {
            nickname: setNickname,
            otp: setOtp,
            password: setPassword
        }
        setters[target.name](target.value)
    }

    const onUpload = (filename) => {
        setFilename(filename)
    }

    const { account, client } = app

    return (
        <div className={styles.root}>
            <Alert severity="info" className={styles.tipBox} icon={false}>
                <p>
                    和微信登录、微博登录一样，用唯ID也可以登录各种网站、APP。
                    新用户请先完成账号注册。
                </p>
            </Alert>
            <AvatarUpload onUpload={onUpload} />
            <form onSubmit={onSubmit} style={{ marginTop: 25 }} className="form1">
                <FormControl variant="outlined" fullWidth disabled>
                    <InputLabel htmlFor="account-input">账号</InputLabel>
                    <OutlinedInput id="account-input" label="账号" value={account} />
                    <FormHelperText />
                </FormControl>
                <FormControl variant="outlined" fullWidth error={validation.nickname.error}>
                    <InputLabel htmlFor="nickname">昵称</InputLabel>
                    <OutlinedInput
                        id="nickname"
                        name="nickname"
                        type="text"
                        onChange={onChange}
                        label="昵称"
                        onBlur={validateField}
                    />
                    <FormHelperText>{validation.nickname.text}</FormHelperText>
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
                    helperText={validation.password.text || "设置密码，方便下次登录"}
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
                        注册并登录
                    </Button>
                </div>
            </form>
            <div className="oneButtonBox">
                <Button variant="outlined" onClick={back} size="small">
                    取 消
                </Button>
            </div>
        </div>
    )
}

export default withLayout(SignUp)
