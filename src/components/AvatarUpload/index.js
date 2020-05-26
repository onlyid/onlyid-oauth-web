import React, { PureComponent } from "react";
import styles from "./index.module.css";
import defaultAvatar from "assets/default-avatar.svg";
import http from "my/http";
import { IMG_UPLOAD_TIP } from "my/constants";

class AvatarUpload extends PureComponent {
    state = {
        avatarUrl: null
    };

    onChange = async e => {
        const { files } = e.target;
        const { onChange } = this.props;

        if (!files.length) return;

        const formData = new FormData();
        formData.append("file", files[0]);
        const { filename } = await http.post("img", formData);

        this.setState({ filename, avatarUrl: URL.createObjectURL(files[0]) });

        onChange(filename);
    };

    render() {
        const { avatarUrl } = this.state;

        return (
            <div className={styles.root}>
                <input
                    accept="image/jpeg,image/png"
                    id="upload-file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={this.onChange}
                />
                <label htmlFor="upload-file">
                    <img src={avatarUrl || defaultAvatar} alt="avatar" width="100" height="100" />
                    <br />
                    <span className={styles.title}>上传头像</span>
                </label>
                <p className="tip">{IMG_UPLOAD_TIP}</p>
            </div>
        );
    }
}

export default AvatarUpload;
