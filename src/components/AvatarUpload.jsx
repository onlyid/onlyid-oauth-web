import styles from "./AvatarUpload.module.css"
import request from "@/my/request"
import { IMG_UPLOAD_TIP } from "@/my/constants"
import { useSelector, useDispatch } from "react-redux"
import cn from "classnames"

function AvatarUpload({ onUpload, requiredVisible }) {
    const app = useSelector((state) => state.app)
    const dispatch = useDispatch()

    const onChange = async (e) => {
        const { files } = e.target

        if (!files.length) return

        const file = files[0]
        e.target.value = null
        const { image } = await window.loadImage(file, { orientation: true, aspectRatio: 1 })
        const scaledImage = window.loadImage.scale(image, { maxWidth: 256, minWidth: 256 })

        const blob = await new Promise((resolve) => {
            scaledImage.toBlob(resolve, file.type)
        })

        const formData = new FormData()
        formData.append("file", blob)
        const { filename } = await request.post("image", formData)

        dispatch({ type: "app", avatar: scaledImage.toDataURL(file.type) })

        onUpload(filename)
    }

    const { avatar } = app

    return (
        <div className={cn(styles.root, { [styles.required]: requiredVisible })}>
            <input
                accept="image/jpeg,image/png"
                id="upload-file"
                type="file"
                style={{ display: "none" }}
                onChange={onChange}
            />
            <label htmlFor="upload-file">
                {avatar ? (
                    <img src={avatar} alt="avatar" />
                ) : (
                    <span className="material-icons">person</span>
                )}
                <br />
                <span className={styles.title}>{requiredVisible && "请"}上传头像</span>
            </label>
            <p className="tip">{IMG_UPLOAD_TIP}</p>
        </div>
    )
}

export default AvatarUpload
