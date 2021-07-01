import React, { PureComponent } from "react";
import styles from "./IconAndAvatar.module.css";
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
                    <img src={client.iconUrl} alt="icon" />
                    <p>{client.name}</p>
                </div>
                {avatarUrl && (
                    <>
                        <SwapHoriz className={styles.swapIcon} />
                        <div className={styles.box}>
                            <img src={avatarUrl} alt="avatar" />
                            <p>{nickname}</p>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(IconAndAvatar);
