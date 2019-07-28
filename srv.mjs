import WUserServer from './src/WUserServer.mjs'
//import WUserServer from './dist/w-user-server.umd.js'
import fs from 'fs'


//ad
let j = fs.readFileSync('D:\\開源-Javascript-w-user\\ad.txt', 'utf8')
let ad = JSON.parse(j)


//webName
let webName = 'User management system'
// let webName = '使用者管理系統'


//webUrl
let webUrl = 'https://google.com'


//webDescription
let webDescription = "Let's do something and make it easier"
// let webDescription = '讓我們一起做更簡單的事'


//opt
let opt = {
    mongoUrl: 'mongodb://username:password@127.0.0.1:27017',
    mongoDb: 'wuser',
    mongoCl: 'users',
    port: 8080,
    apiName: 'api',
    authUrl: 'http://localhost:8080/auth', //need webUrl+'/'+auth, use 'http://localhost:8080' in test case
    salt: 'zLAUfSLDUuausd0Aasu912SDU', //generate it for sites
    timeTokenExp: 30,

    emSenderName: webName,
    emSenderEmail: ad.srcEmail, //email address for email sender
    emSenderPW: ad.srcPW, //password for email sender

    webName: webName,
    webUrl: webUrl,
    webDescription: webDescription,

    // emLetterTeamMessage: `${webName}開發團隊 敬上`,
    // emLetterDoNotReplayMessage: '本信由系統自動發信，請勿回信',
    emLetterLinks: [{ name: 'Google', url: 'https://google.com' }],

    // emSignUpTitle: '註冊驗證信',
    // emSignUpHtml: `<p>親愛的 {name} 您好：</p><p>已收到您的註冊申請，請點擊下方連結進行驗證，確定驗證成功後即可登入。</p><p><a href="{urlCheckCode}" target="_blank">點擊此處驗證</a></p>`,

    // emResetPWTitle: '重設密碼驗證信',
    // emResetPWHtml: `<p>親愛的 {name} 您好：</p><p>已收到您的重設密碼申請，請點擊下方連結進行驗證，確定驗證成功後即可登入。</p><p><a href="{urlCheckCode}" target="_blank">點擊此處驗證</a></p>`,

    // verifyWebMsgSuccess: '驗證成功',
    // verifyWebMsgExpired: '驗證失敗',
    // verifyWebMsgCount: '{s} 秒後自動前往網站',

    funcs: {},
    routes: [],
}


//new
let wus = new WUserServer(opt)
wus.on('all', function({ eventName, data }) {
    console.log('all:' + eventName, ...data)
})
