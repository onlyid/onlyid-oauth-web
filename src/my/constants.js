export const GENDER_TEXT = {
    MALE: "男",
    FEMALE: "女",
    OTHER: "其他"
};

export const IMG_UPLOAD_TIP = "JPG/PNG格式、不小于256像素";

export const REG_EXP = {
    mobile: /^1\d{10}$/
};

export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const DATE_FORMAT = "YYYY-MM-DD";

export const NEW_PASSWORD_RULE = [
    { required: true, message: "请输入" },
    { min: 6, message: "密码最少要输入6位" },
    { max: 50, message: "最多输入50字" },
    {
        validator: (rule, value, callback) => {
            if (!value) callback();

            let upper = 0,
                lower = 0,
                num = 0;
            for (const char of value) {
                if ("0" <= char && char <= "9") num = 1;
                else if ("a" <= char && char <= "z") lower = 1;
                else if ("A" <= char && char <= "Z") upper = 1;
            }

            if (upper + lower + num < 2) callback("至少包含数字、大写字母、小写字母中的两种");
            else callback();
        }
    }
];
