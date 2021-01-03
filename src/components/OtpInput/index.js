import React, { PureComponent } from "react";
import {
    Button,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@material-ui/core";
import http from "my/http";

class OtpInput extends PureComponent {
    static defaultProps = {
        label: "验证码"
    };

    state = {
        sent: false,
        countDown: 60
    };

    sendOtp = async () => {
        const { recipient, clientId, updateField } = this.props;
        await http.post("oauth/send-otp", { recipient, clientId, updateField });

        this.setState({ countDown: 60, sent: true });
        const h = setInterval(() => {
            let { countDown } = this.state;
            countDown--;
            this.setState({ countDown });
            if (countDown === 0) {
                clearInterval(h);
                this.setState({ sent: false });
            }
        }, 1000);
    };

    render() {
        const { error, onChange, helperText, label, ...restProps } = this.props;
        const { sent, countDown } = this.state;

        delete restProps.recipient;
        delete restProps.clientId;

        return (
            <FormControl variant="outlined" fullWidth error={error}>
                <InputLabel htmlFor="input">{label}</InputLabel>
                <OutlinedInput
                    id="input"
                    type="text"
                    onChange={onChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <Button onClick={this.sendOtp} disabled={sent} color="primary">
                                {sent ? countDown + "秒后重试" : "发送验证码"}
                            </Button>
                        </InputAdornment>
                    }
                    label={label}
                    {...restProps}
                />
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        );
    }
}

export default OtpInput;
