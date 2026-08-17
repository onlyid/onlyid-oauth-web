import { useState, useEffect } from "react"
import { Button, TextField } from "@mui/material"
import { useLocation, useHistory } from "react-router-dom"
import request from "@/my/request"
import { useSelector, useDispatch } from "react-redux"
import Validator from "async-validator"
import { REG_EXP } from "@/my/constants"
import IconAndAvatar from "@/components/IconAndAvatar"
import ScanLoginButton from "@/components/ScanLoginButton"
import { eventEmitter } from "@/my/utils"
import TermsCheckbox from "./TermsCheckbox"
import withLayout from "@/components/MyLayout"

const RULES = {
    email: [
        { required: true, message: "请输入" },
        { max: 50, message: "最多输入50字" },
        { type: "email", message: "邮箱格式不正确" }
    ],
    mobile: [
        { required: true, message: "请输入" },
        { pattern: REG_EXP.mobile, message: "手机号格式不正确" }
    ]
}
const validator = new Validator(RULES)

function Home() {
    const [validation, setValidation] = useState({})
    const [account, setAccount] = useState("")
    const [termsChecked, setTermsChecked] = useState(false)
    const app = useSelector((state) => state.app)
    const dispatch = useDispatch()
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        dispatch({ type: "app", avatar: null, nickname: null })
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!(await validateField())) return

        if (!termsChecked) {
            const text = "请阅读并同意服务协议和隐私政策"
            eventEmitter.emit("openToast", { text, severity: "warning" })
            return
        }

        const params = { account }
        const data = await request.get("check-account", { params })
        let route
        if (data) {
            dispatch({ type: "app", ...data })
            route = "login"
        } else {
            route = "sign-up"
        }
        dispatch({ type: "app", account })
        history.push(`/${route}${location.search}`)

        eventEmitter.emit("closeToast")
    }

    const onChange = (e) => {
        setAccount(e.target.value)
    }

    const onCheckChange = (event) => {
        setTermsChecked(event.target.checked)
    }

    const validateField = async () => {
        let validation
        try {
            const key = account.includes("@") ? "email" : "mobile"
            await validator.validate({ [key]: account }, { keys: [key], first: true })
            validation = {}
            return true
        } catch ({ errors }) {
            validation = { text: errors[0].message, error: true }
            return false
        } finally {
            setValidation(validation)
        }
    }

    return (
        <div>
            <IconAndAvatar />
            <form onSubmit={onSubmit} style={{ marginTop: 40 }} noValidate>
                <TextField
                    label="手机号 / 邮箱"
                    variant="outlined"
                    error={validation.error}
                    helperText={validation.text}
                    fullWidth
                    onChange={onChange}
                    value={account}
                    onBlur={validateField}
                    type="email"
                />
                <TermsCheckbox onChange={onCheckChange} checked={termsChecked} />
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={onSubmit}
                        size="large"
                        disabled={app.nextDisabled}
                    >
                        下 一 步
                    </Button>
                </div>
            </form>
            <ScanLoginButton style={{ marginTop: 85 }} />
        </div>
    )
}

export default withLayout(Home)
