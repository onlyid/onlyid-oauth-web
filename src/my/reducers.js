import { combineReducers } from "redux";

const defaultApp = {
    account: "",
    client: {},
    userId: null,
    nickname: null,
    avatarUrl: null,
    nextDisabled: false,
    mySessions: []
};

function app(state = defaultApp, { type, ...rest }) {
    if (type === "app") return { ...state, ...rest };

    return state;
}

export default combineReducers({ app });
