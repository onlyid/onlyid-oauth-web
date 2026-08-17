import { useRef, useState, useEffect } from "react"
import { eventEmitter, getRandomValue, redirectCode } from "@/my/utils"
import { useSelector } from "react-redux"
import { useLocation, useHistory } from "react-router-dom"
import styles from "./ScanLogin.module.css"
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"
import AndroidIcon from "@mui/icons-material/Android"
import CheckIcon from "@mui/icons-material/Check"
import icon from "@/assets/ic_launcher.png"
import request from "@/my/request"
import axios from "axios"
import DialogClose from "@/components/DialogClose"
import withLayout from "@/components/MyLayout"

function ScanLogin() {
    const source = useRef()
    const ref1 = useRef()
    const ref2 = useRef()
    const [dialogVisible, setDialogVisible] = useState(false)
    const location = useLocation()
    const history = useHistory()
    const app = useSelector((state) => state.app)

    const startLoop = async (params) => {
        const { client } = app
        const { search } = location

        let code
        while (true) {
            try {
                source.current = axios.CancelToken.source()
                const { authorizationCode } = await request.post("auth/scan-login", params, {
                    cancelToken: source.current.token
                })

                if (authorizationCode) {
                    code = authorizationCode
                    break
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    if (err.message === "unmount") {
                        return
                    } else {
                        // do nothing
                    }
                } else {
                    throw err
                }
            }
        }

        if (code === "reject") {
            eventEmitter.emit("openToast", {
                text: "你拒绝了本次登录请求",
                severity: "warning"
            })
            history.goBack()
            return
        }

        redirectCode(client, search, code)
    }

    useEffect(() => {
        const { client } = app

        const text = {
            uid: getRandomValue(),
            clientId: client.id
        }
        new window.QRCode(ref1.current, {
            text: JSON.stringify(text),
            width: 256,
            height: 256
        })

        startLoop(text)

        return () => source.current.cancel("unmount")
    }, [])

    const showDialog = () => {
        setDialogVisible(true)

        setTimeout(() => {
            new window.QRCode(ref2.current, {
                text: window.location.origin + "/oauth/download-app",
                width: 128,
                height: 128
            })
        }, 100)
    }

    const closeDialog = () => {
        setDialogVisible(false)
    }

    const back = () => {
        history.goBack()
    }

    const { client } = app

    return (
        <div className={styles.root}>
            <p className={styles.title1}>扫码登录</p>
            <div ref={ref1} className={styles.qrCodeBox1} />
            <p className="tip">用 唯ID APP 扫码登录「{client.name}」</p>
            <div className={styles.downloadButtonBox}>
                <Button variant="outlined" onClick={showDialog} size="small" color="primary">
                    下载 APP
                </Button>
            </div>
            <div className={styles.accountButtonBox}>
                <Button onClick={back} size="small" color="primary">
                    账号密码登录
                </Button>
            </div>
            <Dialog onClose={closeDialog} open={dialogVisible}>
                <DialogTitle>
                    下载 APP
                    <DialogClose onClose={closeDialog} />
                </DialogTitle>
                <DialogContent>
                    <div className={styles.dialogContent1}>
                        <div className={styles.appBox}>
                            <img src={icon} alt="icon" />
                            <br />
                            <span>唯ID</span>
                        </div>
                        <div className={styles.appDesc}>
                            <p className={styles.title3}>使用唯ID APP：</p>
                            <ul>
                                <li>
                                    <CheckIcon />
                                    管理账号资料
                                </li>
                                <li>
                                    <CheckIcon />
                                    一键扫码登录
                                </li>
                                <li>
                                    <CheckIcon />
                                    管理可信设备
                                </li>
                                <li>
                                    <CheckIcon />
                                    管理授权应用
                                </li>
                            </ul>
                            <p>更多功能等你亲自探索。。。</p>
                        </div>
                    </div>
                    <div className={styles.dialogContent2}>
                        <div>
                            <p className={styles.title2}>
                                <AndroidIcon style={{ color: "#2FD96C" }} />
                                Android
                            </p>
                            <p>用手机浏览器、微信扫码：</p>
                            <div ref={ref2} className={styles.qrCodeBox2} />
                        </div>
                        <div className={styles.divider} />
                        <div>
                            <div>
                                <p className={styles.title2}>
                                    <i className="iconfont" style={{ color: "#3f51b5" }}>
                                        &#xe72c;
                                    </i>
                                    iPhone
                                </p>
                                <p>
                                    App Store 搜索「唯ID」，
                                    <br />
                                    下载安装。
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default withLayout(ScanLogin)
