import { useState, useEffect } from "react"
import { eventEmitter, getLength } from "@/my/utils"
import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"

function Toast() {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const [severity, setSeverity] = useState("")
    const [timeout, setTimeout] = useState(0)

    useEffect(() => {
        eventEmitter.on("openToast", show)
        eventEmitter.on("closeToast", close)

        return () => {
            eventEmitter.off("openToast", show)
            eventEmitter.off("closeToast", close)
        }
    }, [])

    const show = ({ text, severity }) => {
        setOpen(true)
        setText(text)
        setSeverity(severity ?? "success")
        setTimeout((getLength(text, 3) / 8) * 1000)
    }

    const close = (_, reason) => {
        if (reason === "clickaway") return

        setOpen(false)
    }

    return (
        <Snackbar
            key={text} // 短时间多次open，只渲染最后一个（用Date.now()不行）
            open={open}
            autoHideDuration={timeout}
            onClose={close}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert elevation={1} severity={severity}>
                {text}
            </Alert>
        </Snackbar>
    )
}

export default Toast
