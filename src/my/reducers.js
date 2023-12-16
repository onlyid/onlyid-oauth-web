import { combineReducers } from "redux";

const defaultApp = {
    account: "",
    nickname: null,
    avatarUrl: null,
    client: {},
    oauthConfig: { background: [] }
};

function app(state = defaultApp, { type, ...rest }) {
    if (type === "app") return { ...state, ...rest };

    return state;
}

export default combineReducers({ app });
