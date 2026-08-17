import styles from "./IconAndAvatar.module.css"
import { useSelector } from "react-redux"
import SwapHoriz from "@mui/icons-material/SwapHoriz"

function IconAndAvatar() {
    const app = useSelector((state) => state.app)

    const { client, avatar, nickname } = app

    return (
        <div className={styles.root}>
            <div className={styles.box}>
                <img src={client.iconUrl} alt="icon" />
                <p>{client.name}</p>
            </div>
            {avatar && (
                <>
                    <SwapHoriz className={styles.swapIcon} />
                    <div className={styles.box}>
                        <img src={avatar} alt="avatar" />
                        <p>{nickname}</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default IconAndAvatar
