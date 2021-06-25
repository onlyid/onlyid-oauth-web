import { combineReducers } from "redux";

const defaultApp = {
    account: "",
    client: {},
    oauthConfig: { background: [] },
    nickname: null,
    avatarUrl: null
};

function app(state = defaultApp, { type, ...rest }) {
    if (type === "app") return { ...state, ...rest };

    return state;
}

export default combineReducers({ app });
