import axios from "axios"
import { eventEmitter } from "./utils"

export const baseURL = "/api/oauth"

const request = axios.create({ baseURL })

request.interceptors.response.use(
    (res) => res.data,
    (err) => {
        if (axios.isCancel(err)) return Promise.reject(err)

        let errMsg
        if (err.response) errMsg = err.response.data.error
        if (!errMsg) errMsg = err.message

        eventEmitter.emit("openToast", { text: errMsg, severity: "error" })

        return Promise.reject(err)
    }
)

export default request
