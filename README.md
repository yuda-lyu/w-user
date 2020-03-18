# w-user
A simple server for users in nodejs and browser, like a simple SSO.

![language](https://img.shields.io/badge/language-JavaScript-orange.svg) 
[![npm version](http://img.shields.io/npm/v/w-user.svg?style=flat)](https://npmjs.org/package/w-user) 
[![Build Status](https://travis-ci.org/yuda-lyu/w-user.svg?branch=master)](https://travis-ci.org/yuda-lyu/w-user) 
[![license](https://img.shields.io/npm/l/w-user.svg?style=flat)](https://npmjs.org/package/w-user) 
[![gzip file size](http://img.badgesize.io/yuda-lyu/w-user/master/dist/w-user-server.umd.js.svg?compression=gzip)](https://github.com/yuda-lyu/w-user)
[![npm download](https://img.shields.io/npm/dt/w-user.svg)](https://npmjs.org/package/w-user) 
[![jsdelivr download](https://img.shields.io/jsdelivr/npm/hm/w-user.svg)](https://www.jsdelivr.com/package/npm/w-user)

## Documentation
To view documentation or get support, visit [docs](https://yuda-lyu.github.io/w-user/WUserServer.html).

## Parts
`w-user` includes 2 parts: 
* `w-user-server`: for nodejs server
* `w-user-client`: for nodejs and browser client

## Installation
### Using npm(ES6 module):
> **Note:** `w-user-server` depends on `@hapi/hapi`, `events`, `mongodb`, `stream`, `dayjs`, `nodemailer`, `w-comor-hapi`, `w-orm-mongodb` and `w-email`.

> **Note:** `w-user-client` depends on `axios`.

```alias
npm i w-user
```
#### Example for w-user-server:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/srv.mjs)]
```alias
import WUserServer from 'WUserServer/src/w-user-server.mjs'


//webName
let webName = 'User management system'
// let webName = '使用者管理系統'


//webUrl
let webUrl = 'https://google.com'


//webDescription
let webDescription = "Let's do something and make it easier"
// let webDescription = '讓我們一起做更簡單的事'


async function startServer() {

    //orm
    let orm
    let ormType = 'sqlite' //mongodb, sqlite
    let username = 'username'
    let password = 'password'
    let db = 'wuser'
    let cl = 'users'
    if (ormType === 'mongodb') {
        orm = WOrmMongodb({
            url: `mongodb://${username}:${password}@127.0.0.1:27017`,
            db,
            cl,
        })
    }
    else {
        orm = WOrmReladb({
            url: `sqlite://${username}:${password}`,
            db,
            cl,
            fdModels: './models',
            //autoGenPK: false,
            storage: `./${db}.sqlite`,
        })
        await orm.createStorage()
    }

    //opt
    let opt = {
        orm,
        port: 8080,
        apiName: 'api',
        authUrl: 'http://localhost:8080/auth', //need webUrl+'/'+auth, webUrl='http://localhost:8080' in test case
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

}
startServer()
```
#### Example for w-user-client:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/scla.mjs)]
> 
```alias
import WUserClient from 'WUserClient/src/w-user-client.mjs'


//opt
let opt = {
    url: 'http://localhost:8080/api',
    token: '*',
    error: function(err) {
        console.log('client nodejs: error:', err)
    },
    reconn: function() {
        console.log('client nodejs: reconn')
    },
}


function testSelect(wo, inp) {

    return wo.select(inp)
        .then(function(msg) {
            console.log('select then: ', msg)
        })
        .catch(function(err) {
            console.log('select catch: ', err)
        })

}


function testSignUp(wo, user) {

    wo.signUp(user)
        .then(function(msg) {
            console.log('signUp then: ', msg)
        })
        .catch(function(err) {
            console.log('signUp catch: ', err)
        })

}


async function testLogIn(wo, user) {
    let token = null

    await wo.logIn(user)
        .then(function(msg) {
            console.log('logIn then: ', msg)
            token = msg.msg
        })
        .catch(function(err) {
            console.log('logIn catch: ', err)
        })

    return token
}


function testIsValidToken(wo, token) {

    return wo.isValidToken(token)
        .then(function(msg) {
            console.log('isValidToken then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('isValidToken catch: ', err)
        })

}


function testRefreshTokenExp(wo, token) {

    return wo.refreshTokenExp(token)
        .then(function(msg) {
            console.log('refreshTokenExp then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('refreshTokenExp catch: ', err)
        })

}


function testLogOut(wo, token) {

    return wo.logOut(token)
        .then(function(msg) {
            console.log('logOut then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('logOut catch: ', err)
        })

}


function testChangePW(wo, user) {

    return wo.changePW(user)
        .then(function(msg) {
            console.log('changePW then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('changePW catch: ', err)
        })

}


function testResetPW(wo, user) {

    return wo.resetPW(user)
        .then(function(msg) {
            console.log('resetPW then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('resetPW catch: ', err)
        })

}


function testModifyInfor(wo, inp) {

    return wo.modifyInfor(inp)
        .then(function(msg) {
            console.log('modifyInfor then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('modifyInfor catch: ', err)
        })

}


//new
new WUserClient(opt)
    .then(async function(wo) {
        //console.log('funcs: ', wo)

        //使用者之密碼明碼, 記得於前端需先偵測是否8位以上, 且需含英文大小寫與數字, 傳送至伺服器前需先編碼如用sha512, 減少被盜用後直接洩漏明碼
        let pw1 = 'ABCdef123456'
        let pw2 = '123456XYZabc'
        let pwEnc = pw1
        let pwEncNew = pw2

        //user
        let user = {
            name: 'user',
            pwEnc: pwEnc,
            email: 'your@email', //change to user's email
        }

        //token
        let token = null

        //testMode
        let testMode = null
        // testMode = 'select'
        testMode = 'signUp'
        // testMode = 'logIn and logOut'
        // testMode = 'changePW'
        // testMode = 'resetPW'
        // testMode = 'modifyInfor'


        //select
        if (testMode === 'select') {

            token = await testLogIn(wo, user)

            let find = {}
            await testSelect(wo, { token, find })

            await testLogOut(wo, token)

        }


        //signUp
        if (testMode === 'signUp') {
            testSignUp(wo, user)
        }


        //logIn and logOut
        if (testMode === 'logIn and logOut') {

            token = await testLogIn(wo, user) //get token

            await testIsValidToken(wo, token) //true

            await testRefreshTokenExp(wo, token) //true

            await testLogIn(wo, user) //get the same token, for multiple login

            await testLogOut(wo, token) //true

            await testIsValidToken(wo, token) //false

            await testRefreshTokenExp(wo, token) //false

        }


        //changePW
        if (testMode === 'changePW') {
            await testChangePW(wo, { pwEncNew, ...user })
        }


        //resetPW
        if (testMode === 'resetPW') {
            await testResetPW(wo, { pwEncNew, ...user })
        }


        //modifyInfor
        if (testMode === 'modifyInfor') {

            token = await testLogIn(wo, user) //get token

            let userModify = {
                id: 'abc',
                //email: 'abc@def.com', //can change email
                address: 'new city',
                abc: 'def',
            }

            await testModifyInfor(wo, { token, user: userModify })

        }


    })
    .catch(function(err) {
        console.log('client nodejs: catch: ', err)
    })
```

### In a browser(UMD module):
> **Note:** `w-user-client` depends on `axios`.

[Optional] Add script with nomodule for IE11.
```alias
<script nomodule src="https://cdn.jsdelivr.net/npm/@babel/polyfill/dist/polyfill.min.js"></script>
```
[Necessary] Add script for axios.
```alias
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```
[Necessary] Add script for w-user-client.
```alias
<script src="https://cdn.jsdelivr.net/npm/w-user@1.0.16/dist/w-user-client.umd.js"></script>
```
#### Example for w-user-client:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/web.html)]

```alias
//Need to convert async, await and spread operator in IE11, or test it in Chrome or Firefox.

//opt
let opt = {
    url: 'http://localhost:8080/api',
    token: '*',
    error: function(err) {
        console.log('client web: error:', err)
    },
    reconn: function() {
        console.log('client web: reconn')
    },
}


function testSelect(wo, inp) {

    return wo.select(inp)
        .then(function(msg) {
            console.log('select then: ', msg)
        })
        .catch(function(err) {
            console.log('select catch: ', err)
        })

}


function testSignUp(wo, user) {

    wo.signUp(user)
        .then(function(msg) {
            console.log('signUp then: ', msg)
        })
        .catch(function(err) {
            console.log('signUp catch: ', err)
        })

}


async function testLogIn(wo, user) {
    let token = null

    await wo.logIn(user)
        .then(function(msg) {
            console.log('logIn then: ', msg)
            token = msg.msg
        })
        .catch(function(err) {
            console.log('logIn catch: ', err)
        })

    return token
}


function testIsValidToken(wo, token) {

    return wo.isValidToken(token)
        .then(function(msg) {
            console.log('isValidToken then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('isValidToken catch: ', err)
        })

}


function testRefreshTokenExp(wo, token) {

    return wo.refreshTokenExp(token)
        .then(function(msg) {
            console.log('refreshTokenExp then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('refreshTokenExp catch: ', err)
        })

}


function testLogOut(wo, token) {

    return wo.logOut(token)
        .then(function(msg) {
            console.log('logOut then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('logOut catch: ', err)
        })

}


function testChangePW(wo, user) {

    return wo.changePW(user)
        .then(function(msg) {
            console.log('changePW then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('changePW catch: ', err)
        })

}


function testResetPW(wo, user) {

    return wo.resetPW(user)
        .then(function(msg) {
            console.log('resetPW then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('resetPW catch: ', err)
        })

}


function testModifyInfor(wo, inp) {

    return wo.modifyInfor(inp)
        .then(function(msg) {
            console.log('modifyInfor then: ', msg.state === 'success', msg)
        })
        .catch(function(err) {
            console.log('modifyInfor catch: ', err)
        })

}


//new
let WUserClient = window['w-user-client']
new WUserClient(opt)
    .then(async function(wo) {
        //console.log('funcs: ', wo)

        //使用者之密碼明碼, 記得於前端需先偵測是否8位以上, 且需含英文大小寫與數字, 傳送至伺服器前需先編碼如用sha512, 減少被盜用後直接洩漏明碼
        let pw1 = 'ABCdef123456'
        let pw2 = '123456XYZabc'
        let pwEnc = pw1
        let pwEncNew = pw2

        //user
        let user = {
            name: 'user',
            pwEnc: pwEnc,
            email: 'your@email', //change to user's email
        }

        //token
        let token = null

        //testMode
        let testMode = null
        // testMode = 'select'
        testMode = 'signUp'
        // testMode = 'logIn and logOut'
        // testMode = 'changePW'
        // testMode = 'resetPW'
        // testMode = 'modifyInfor'


        //select
        if (testMode === 'select') {

            token = await testLogIn(wo, user)

            let find = {}
            await testSelect(wo, { token, find })

            await testLogOut(wo, token)

        }


        //signUp
        if (testMode === 'signUp') {
            testSignUp(wo, user)
        }


        //logIn and logOut
        if (testMode === 'logIn and logOut') {

            token = await testLogIn(wo, user) //get token

            await testIsValidToken(wo, token) //true

            await testRefreshTokenExp(wo, token) //true

            await testLogIn(wo, user) //get the same token, for multiple login

            await testLogOut(wo, token) //true

            await testIsValidToken(wo, token) //false

            await testRefreshTokenExp(wo, token) //false

        }


        //changePW
        if (testMode === 'changePW') {
            await testChangePW(wo, { pwEncNew, ...user })
        }


        //resetPW
        if (testMode === 'resetPW') {
            await testResetPW(wo, { pwEncNew, ...user })
        }


        //modifyInfor
        if (testMode === 'modifyInfor') {

            token = await testLogIn(wo, user) //get token

            let userModify = {
                id: 'abc',
                //email: 'abc@def.com', //can change email
                address: 'new city',
                abc: 'def',
            }

            await testModifyInfor(wo, { token, user: userModify })

        }


    })
    .catch(function(err) {
        console.log('client web: catch: ', err)
    })
```