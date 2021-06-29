import React, { PureComponent } from "react";
import styles from "./AvatarUpload.module.css";
import http from "my/http";
import { IMG_UPLOAD_TIP } from "my/constants";
import { connect } from "react-redux";
import classNames from "classnames";

class AvatarUpload extends PureComponent {
    onChange = async e => {
        const { files } = e.target;
        const { onChange, dispatch } = this.props;

        if (!files.length) return;

        const file = files[0];
        e.target.value = null;
        const { image } = await window.loadImage(file, {
            orientation: true,
            aspectRatio: 1,
            canvas: true
        });
        const scaledImage = window.loadImage.scale(image, { maxWidth: 256, minWidth: 256 });

        const blob = await new Promise(resolve => {
            // 兼容IE11
            if (scaledImage.toBlob) scaledImage.toBlob(resolve, file.type);
            else resolve(scaledImage.msToBlob());
        });

        const formData = new FormData();
        formData.append("file", blob);
        const { filename } = await http.post("image", formData);

        dispatch({ type: "app", avatarUrl: scaledImage.toDataURL(file.type) });

        onChange(filename);
    };

    render() {
        const {
            app: { avatarUrl },
            requiredVisible
        } = this.props;

        return (
            <div className={classNames(styles.root, { [styles.required]: requiredVisible })}>
                <input
                    accept="image/jpeg,image/png"
                    id="upload-file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={this.onChange}
                />
                <label htmlFor="upload-file">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" />
                    ) : (
                        <span className="material-icons">person</span>
                    )}
                    <br />
                    <span className={styles.title}>{requiredVisible && "请"}上传头像</span>
                </label>
                <p className="tip">{IMG_UPLOAD_TIP}</p>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(AvatarUpload);
