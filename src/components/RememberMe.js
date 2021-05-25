import React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

export default function({ onChange, checked, ...restProps }) {
    return (
        <FormControlLabel
            control={<Checkbox color="primary" onChange={onChange} checked={checked} />}
            label={
                <>
                    记住我
                    <span style={{ color: "#7f7f7f", fontSize: "0.9rem" }}>（保持登录一个月）</span>
                </>
            }
            {...restProps}
        />
    );
}
