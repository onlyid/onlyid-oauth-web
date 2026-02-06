import { combineReducers } from "redux"

const defaultApp = {
    account: "",
    nickname: null,
    avatar: null,
    client: {},
    oauthConfig: { background: [] },
    users: [],
    nextDisabled: false
}

function app(state = defaultApp, { type, ...rest }) {
    if (type === "app") return { ...state, ...rest }

    return state
}

export default combineReducers({ app })
