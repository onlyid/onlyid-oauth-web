import React, { PureComponent } from "react";
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

class PasswordInput extends PureComponent {
    static defaultProps = {
        label: "密码"
    };

    state = {
        showPassword: false
    };

    toggleShowPassword = () => {
        this.setState(({ showPassword }) => ({ showPassword: !showPassword }));
    };

    render() {
        const { error, onChange, helperText, label, ...restProps } = this.props;
        const { showPassword } = this.state;

        return (
            <FormControl variant="outlined" fullWidth error={error}>
                <InputLabel htmlFor="input">{label}</InputLabel>
                <OutlinedInput
                    id="input"
                    type={showPassword ? "text" : "password"}
                    onChange={onChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={this.toggleShowPassword}>
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
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

export default PasswordInput;
