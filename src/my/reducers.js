import { combineReducers } from "redux";

const defaultApp = {};

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
