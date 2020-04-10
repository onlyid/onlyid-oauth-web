import React, { PureComponent } from "react";
import { Button, TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import http from "my/http";
import styles from "./index.module.css";
import { connect } from "react-redux";

class Account extends PureComponent {
    state = {
        helperText: null,
        isError: false
    };

    onSubmit = async e => {
        e.preventDefault();

        const {
            history,
            location: { search },
            match,
            app: { accountName },
            dispatch
        } = this.props;

        if (accountName) {
            this.setState({ helperText: null, isError: false });

            const params = { accountName };
            const { registered, nickname, avatarUrl } = await http.get("oauth/check-registered", {
                params
            });
            if (registered) {
                history.push(match.url + "/sign-in" + search);
                dispatch({ type: "app/save", payload: { nickname, avatarUrl } });
            }
        } else {
            this.setState({ helperText: "请输入", isError: true });
        }
    };

    onChange = e => {
        const { dispatch } = this.props;
        dispatch({ type: "app/save", payload: { accountName: e.target.value } });
    };

    render() {
        const { helperText, isError } = this.state;
        const {
            app: { client, accountName }
        } = this.props;

        return (
            <div>
                <form onSubmit={this.onSubmit} style={{ marginTop: 30 }}>
                    <TextField
                        label="手机号/邮箱"
                        variant="outlined"
                        error={isError}
                        helperText={helperText}
                        fullWidth
                        onChange={this.onChange}
                        value={accountName}
                    />
                    <div style={{ marginTop: 20 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={this.onSubmit}
                            size="large"
                        >
                            下 一 步
                        </Button>
                        <p className="tip">「{client.name}」将获得你的手机号、昵称等账号信息。</p>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Account));
