import { Checkbox, Link } from "@material-ui/core";
import React from "react";
import styles from "./TermsCheckbox.module.css";
import { connect } from "react-redux";

function TermsCheckbox({ checked, onChange, app }) {
    const {
        oauthConfig: { termsUrl, privacyUrl },
        client
    } = app;

    return (
        <div className={styles.root}>
            <Checkbox color="primary" checked={checked} onChange={onChange} />
            <p>
                阅读并同意
                {(termsUrl || privacyUrl) && <>{client.name} </>}
                {termsUrl && (
                    <Link href={termsUrl} target="_blank">
                        服务协议
                    </Link>
                )}
                {termsUrl && privacyUrl && "、"}
                {privacyUrl && (
                    <Link href={privacyUrl} target="_blank">
                        隐私政策
                    </Link>
                )}
                {(termsUrl || privacyUrl) && <> 以及</>}
                <>唯ID </>
                <Link href="https://www.onlyid.net/static/terms.html" target="_blank">
                    服务协议
                </Link>
                、
                <Link href="https://www.onlyid.net/static/privacy.html" target="_blank">
                    隐私政策
                </Link>
            </p>
        </div>
    );
}

export default connect(({ app }) => ({ app }))(TermsCheckbox);
