import { combineReducers } from "redux";

const defaultApp = {
    accountName: "",
    client: {},
    nickname: null,
    avatarUrl: null,
    nextDisabled: false
};

function app(state = defaultApp, action) {
    const { type, payload } = action;

    switch (type) {
        case "app/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

export default combineReducers({ app });
