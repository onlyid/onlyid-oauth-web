import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import http from "my/http";
import { redirectCode } from "my/utils";
import { DATE_FORMAT } from "my/constants";
import Review from "./Review";
import SetPassword from "./SetPassword";
import moment from "moment";

class Activate extends PureComponent {
    state = {
        userId: null,
        filename: null,
        nickname: null,
        mobile: null,
        email: null,
        gender: null,
        birthDate: null,
        region: null,
        bio: null,
        otpSms: null,
        otpEmail: null,
        password: null,
        keepLoggedIn: false,
        step: 1 // 1 检查账号 2 设置密码
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const {
            app: { account },
            dispatch
        } = this.props;

        const {
            id,
            avatarUrl,
            nickname,
            mobile,
            email,
            gender,
            birthDate,
            province,
            city,
            bio
        } = await http.get("users", { params: { account } });

        this.setState({ userId: id, nickname, mobile, email, gender, bio });

        if (province) this.setState({ region: [province, city] });

        if (birthDate) this.setState({ birthDate: moment(birthDate) });

        dispatch({ type: "app", avatarUrl });
    };

    onSubmit = async () => {
        const {
            userId,
            filename,
            nickname,
            mobile,
            email,
            gender,
            birthDate,
            region,
            bio,
            otpSms,
            otpEmail,
            password,
            keepLoggedIn
        } = this.state;
        const {
            app: { client, account },
            location: { search }
        } = this.props;

        const values = {
            userId,
            filename,
            nickname,
            mobile,
            email,
            gender: gender || null,
            bio,
            otpSms,
            otpEmail,
            password,
            clientId: client.id,
            keepLoggedIn,
            account
        };

        if (region) {
            values.province = region[0];
            values.city = region[1];
        }

        if (birthDate) {
            values.birthDate = birthDate.format(DATE_FORMAT);
        }

        const { authorizationCode } = await http.post("activate-account", values);

        redirectCode(client, search, authorizationCode);
    };

    onNext = () => {
        this.setState({ step: 2 });
    };

    onPrev = () => {
        this.setState({ step: 1 });
    };

    onChange = (key, value) => {
        this.setState({ [key]: value });
    };

    render() {
        const {
            filename,
            nickname,
            mobile,
            email,
            gender,
            birthDate,
            region,
            bio,
            otpSms,
            otpEmail,
            password,
            keepLoggedIn,
            step
        } = this.state;

        return step === 1 ? (
            <Review
                filename={filename}
                nickname={nickname}
                mobile={mobile}
                email={email}
                gender={gender}
                birthDate={birthDate}
                region={region}
                bio={bio}
                onChange={this.onChange}
                onNext={this.onNext}
            />
        ) : (
            <SetPassword
                mobile={mobile}
                email={email}
                otpSms={otpSms}
                otpEmail={otpEmail}
                password={password}
                keepLoggedIn={keepLoggedIn}
                onChange={this.onChange}
                onPrev={this.onPrev}
                onSave={this.onSubmit}
            />
        );
    }
}

export default connect(({ app }) => ({ app }))(withRouter(Activate));
