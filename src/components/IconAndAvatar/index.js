import React, { PureComponent } from "react";
import styles from "./index.module.css";
import { connect } from "react-redux";
import { SwapHoriz } from "@material-ui/icons";

class IconAndAvatar extends PureComponent {
    render() {
        const {
            app: { client, avatarUrl, nickname }
        } = this.props;

        return (
            <div className={styles.root}>
                <div className={styles.box}>
                    <img src={client.iconUrl} alt="icon" width="100" />
                    <p>{client.name}</p>
                </div>
                {avatarUrl && (
                    <>
                        <div className={styles.box1}>
                            <SwapHoriz />
                        </div>
                        <div className={styles.box}>
                            <img src={avatarUrl} alt="icon" width="100" height="100" />
                            <p>{nickname}</p>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(IconAndAvatar);
