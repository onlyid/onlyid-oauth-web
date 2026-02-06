import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import styles from "./SignUp.module.css"
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import PasswordInput from "components/PasswordInput"
import OtpInput from "components/OtpInput"
import Validator from "async-validator"
import http from "my/http"
import AvatarUpload from "components/AvatarUpload"
import { redirectCode } from "my/utils"
import { NEW_PASSWORD_RULE } from "my/constants"
import withLayout from "components/MyLayout"

const RULES = {
    nickname: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    otp: [{ required: true, message: "请输入" }],
    password: NEW_PASSWORD_RULE
}

class SignUp extends PureComponent {
    state = {
        validation: { nickname: {}, otp: {}, password: {} },
        otp: null,
        password: null,
        nickname: null,
        filename: null
    }

    onSubmit = async (e) => {
        e.preventDefault()

        const { filename, nickname, otp, password, validation } = this.state
        const {
            app: { client, account },
            location: { search }
        } = this.props

        // 校验表单
        try {
            const values = { nickname, otp, password }
            await new Validator(RULES).validate(values, { firstFields: true })
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true }

            return this.setState({ validation: { ...validation } })
        }

        const { authorizationCode } = await http.post("auth/sign-up", {
            filename,
            nickname,
            account,
            otp,
            password,
            clientId: client.id
        })

        redirectCode(client, search, authorizationCode)
    }

    validateField = async ({ target: { name: key, value } }) => {
        const { validation } = this.state
        try {
            await new Validator({ [key]: RULES[key] }).validate({ [key]: value }, { first: true })
            validation[key] = {}
        } catch ({ errors }) {
            validation[key] = { text: errors[0].message, error: true }
        }
        this.setState({ validation: { ...validation } })
    }

    back = () => {
        const { history } = this.props
        history.goBack()
    }

    onChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    onUpload = (filename) => {
        this.setState({ filename })
    }

    render() {
        const {
            app: { account, client }
        } = this.props
        const { validation } = this.state

        return (
            <div className={styles.root}>
                <Alert severity="info" className={styles.tipBox} icon={false}>
                    <p>
                        和微信登录、微博登录一样，用唯ID也可以登录各种网站、APP。
                        新用户请先完成账号注册。
                    </p>
                </Alert>
                <AvatarUpload onUpload={this.onUpload} />
                <form onSubmit={this.onSubmit} style={{ marginTop: 25 }} className="form1">
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
                            onChange={this.onChange}
                            label="昵称"
                            onBlur={this.validateField}
                        />
                        <FormHelperText>{validation.nickname.text}</FormHelperText>
                    </FormControl>
                    <OtpInput
                        name="otp"
                        error={validation.otp.error}
                        onChange={this.onChange}
                        helperText={validation.otp.text}
                        recipient={account}
                        clientId={client.id}
                        onBlur={this.validateField}
                    />
                    <PasswordInput
                        name="password"
                        error={validation.password.error}
                        onChange={this.onChange}
                        helperText={validation.password.text || "设置密码，方便下次登录"}
                        onBlur={this.validateField}
                        autoComplete="new-password"
                    />
                    <div style={{ marginTop: 20 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.onSubmit}
                            size="large"
                        >
                            注册并登录
                        </Button>
                    </div>
                </form>
                <div className="oneButtonBox">
                    <Button variant="outlined" onClick={this.back} size="small">
                        取 消
                    </Button>
                </div>
            </div>
        )
    }
}

export default withLayout(connect(({ app }) => ({ app }))(withRouter(SignUp)))
