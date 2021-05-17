import axios from "axios";
import { eventEmitter } from "./utils";

export const baseURL = "/api";

const instance = axios.create({ baseURL });

instance.interceptors.response.use(
    res => res.data,
    err => {
        if (axios.isCancel(err)) return Promise.reject(err);

        let errMsg;
        if (err.response) errMsg = err.response.data.error;
        if (!errMsg) errMsg = err.message;

        eventEmitter.emit("app/openToast", { message: errMsg });

        return Promise.reject(err);
    }
);

export default instance;
