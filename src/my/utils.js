import EventEmitter from "eventemitter3";
import qs from "qs";

Storage.prototype.getObj = function (key) {
    const s = this.getItem(key);
    if (!s) return null;

    return JSON.parse(s);
};

Storage.prototype.setObj = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

export const eventEmitter = new EventEmitter();

export function getRandomValue(length = 32) {
    let s = "";
    while (s.length < length) {
        s += Math.random().toString(36).substr(2);
    }

    // 可能超长 截取一下
    if (s.length > length) s = s.substr(0, length);
    return s;
}

export function redirectCode(client, search, code) {
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    const state = query["state"] || null;
    if (client.type === "APP") {
        if (window.android) {
            window.android.onCode(code, state);
        } else {
            window.webkit.messageHandlers.ios.postMessage({
                method: "onCode",
                data: { code, state }
            });
        }
    } else {
        let url = query["redirect-uri"] + "?code=" + code;
        if (state) url += "&state=" + state;

        window.location.assign(url);
    }
}
