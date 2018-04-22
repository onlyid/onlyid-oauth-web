'use strict'

const prod = {
  authorizeUrl: 'https://oauth.onlyid.net/authorize?response_type=code',
  baseUrl: 'https://oauth.onlyid.net',
  // 表单验证的规则 和后台要对应
  rules: {
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码要大于6位', trigger: 'blur' },
      { max: 16, message: '密码要小于16位', trigger: 'blur' }
    ],
    smsCode: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { pattern: /^[0-9]{4}$/, message: '验证码是4位数字', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^[0-9]{11}$/, message: '手机号是11位数字', trigger: 'blur' }
    ]
  }
}

const dev = {
  authorizeUrl: 'http://oauth.onlyid.net:3001/authorize?response_type=code',
  baseUrl: 'http://oauth.onlyid.net:3001'
}

if (process.env.NODE_ENV !== 'production') {
  for (const k in dev) {
    prod[k] = dev[k]
  }
}
export default prod
