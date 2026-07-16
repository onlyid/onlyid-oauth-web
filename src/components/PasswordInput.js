import { useState } from "react"
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@material-ui/core"
import { Visibility, VisibilityOff } from "@material-ui/icons"

function PasswordInput({ label = "密码", error, onChange, helperText, ...restProps }) {
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev)
    }

    return (
        <FormControl variant="outlined" fullWidth error={error}>
            <InputLabel htmlFor="password-input">{label}</InputLabel>
            <OutlinedInput
                id="password-input"
                type={showPassword ? "text" : "password"}
                onChange={onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
                {...restProps}
            />
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

export default PasswordInput
