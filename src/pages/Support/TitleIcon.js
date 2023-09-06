import React from "react";
import styles from "./TitleIcon.module.css";
import classNames from "classnames";

export default function () {
    return (
        <div className={styles.root}>
            <span className={classNames("material-icons", styles.shield)}>shield</span>
            <span className={classNames("material-icons", styles.account)}>account_circle</span>
        </div>
    );
}
