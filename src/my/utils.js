import EventEmitter from "eventemitter3";
import qs from "qs";

export const eventEmitter = new EventEmitter();

export function getRandomValue(length = 32) {
    let s = "";
    while (s.length < length) {
        s += Math.random()
            .toString(36)
            .substr(2);
    }

    // 可能超长 截取一下
    if (s.length > length) s = s.substr(0, length);
    return s;
}

export function redirectCode(client, search, code) {
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    const state = query["state"];
    if (client.type === "APP") {
        if (window.android) window.android.onCode(code, state || null);
        else {
            window.webkit.messageHandlers.ios.postMessage({
                method: "onCode",
                data: {
                    code,
                    state: state || null
                }
            });
        }
    } else {
        let url = query["redirect-uri"] + "?code=" + code;
        if (query["state"]) url += "&state=" + query["state"];

        window.location.assign(url);
    }
}
