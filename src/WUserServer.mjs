import events from 'events' //rollup編譯時得剔除events
import cloneDeep from 'lodash-es/cloneDeep.js'
import each from 'lodash-es/each.js'
import map from 'lodash-es/map.js'
import get from 'lodash-es/get.js'
import concat from 'lodash-es/concat.js'
import join from 'lodash-es/join.js'
//import wrap from 'lodash-es/wrap.js'
import pick from 'lodash-es/pick.js'
import dayjs from 'dayjs' //rollup編譯時得剔除dayjs
import genPm from 'wsemi/src/genPm.mjs'
import genID from 'wsemi/src/genID.mjs'
import replaceObj from 'wsemi/src/replaceObj.mjs'
import haskey from 'wsemi/src/haskey.mjs'
import now2str from 'wsemi/src/now2str.mjs'
import binstr from 'wsemi/src/binstr.mjs'
import isstr from 'wsemi/src/isstr.mjs'
import isestr from 'wsemi/src/isestr.mjs'
import isobj from 'wsemi/src/isobj.mjs'
import iseobj from 'wsemi/src/iseobj.mjs'
import isarr from 'wsemi/src/isarr.mjs'
import ispint from 'wsemi/src/ispint.mjs'
import isfun from 'wsemi/src/isfun.mjs'
import istimeTZ from 'wsemi/src/istimeTZ.mjs'
import isEmail from 'wsemi/src/isEmail.mjs'
import str2sha512 from 'wsemi/src/str2sha512.mjs'
import pm2resolve from 'wsemi/src/pm2resolve.mjs'
import WComorHapiServer from 'w-comor-hapi/src/WComorHapiServer.mjs' //rollup編譯時得剔除@hapi/hapi
//import WOrm from 'w-orm-mongodb/src/WOrmMongodb.mjs' //rollup編譯時得剔除mongodb與stream
import WEmail from 'w-email/src/WEmail.mjs' //rollup編譯時得剔除nodemailer
import emLetterHtml from './emLetterHtml.mjs'
import emSignUpHtml from './emSignUpHtml.mjs'
import emResetPWHtml from './emResetPWHtml.mjs'
import verifyWebHtml from './verifyWebHtml.mjs'
import verifyWebLogo from './verifyWebLogo.mjs'


function toStrDate(d) {
    return d.format('YYYY-MM-DDTHH:mm:ssZ')
}


function fromStrDate(c) {
    return dayjs(c, 'YYYY-MM-DDTHH:mm:ssZ')
}


function getSuccess(msg = null) {
    return {
        state: 'success',
        msg,
    }
}


function getError(msg = null) {
    return {
        state: 'error',
        msg,
    }
}


//defRole
let defRole = {
    roleSystem: 'system',
    roleGeneral: 'general',
}


//defActive
let defActive = {
    activeYes: 'yes',
    activeNo: 'no',
}


//defExclude
let defExclude = ['<', '>']


/**
 * @class WUserServer::Private
 */


/**
 * 建立使用者hapi伺服器
 *
 * @class
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {Object} [opt.orm={}] 輸入操作資料庫物件，預設{}
 * @param {Object} [opt.serverHapi={}] 輸入hapi伺服器物件，若提供，本服務將自動加入api至route。使用外部hapi伺服器時，需開啟跨域功能，或是使用nginx反向代理轉入api請求
 * @param {Integer} [opt.port=8080] 輸入Hapi伺服器所在port整數，預設8080
 * @param {String} [opt.apiName='api'] 輸入Hapi伺服器api接口名稱字串，預設'api'
 * @param {String} [opt.authUrl='http://localhost:8080/auth'] 輸入Hapi伺服器外部連入驗證網址字串，末端api路徑需為auth，預設'http://localhost:8080/auth'
 * @param {String} [opt.salt=''] 輸入密碼加密用鹽字串，預設''
 * @param {Integer} [opt.timeTokenExp=30] 輸入token過期時間整數，預設30(分鐘)
 * @param {String} [opt.webName=''] 輸入email模板內網站名稱字串，預設''
 * @param {String} [opt.webUrl=''] 輸入email模板內網站外部網址首頁字串，預設''
 * @param {String} [opt.webDescription=''] 輸入email模板內網站簡易描述字串，預設''
 * @param {String} [opt.emSenderName='WUserServer'] 輸入寄件人顯示名稱字串，預設'WUserServer'
 * @param {String} opt.emSenderEmail 輸入寄件人email信箱字串
 * @param {String} [opt.emSenderPW=''] 輸入寄件人email密碼字串，預設''
 * @param {String} [opt.emBCC=''] 輸入寄信備份用之密件收件人email字串，預設''
 * @param {String} [opt.emLetterHtml='file:emLetterHtml.mjs'] 輸入email模板字串，大括號標注字串為系統取代字串，預設模板文字放於'emLetterHtml.mjs'
 * @param {String} [opt.emLetterTeamMessage='Global-User International Company'] 輸入email模板內標注團隊字串，預設'Global-User International Company'
 * @param {String} [opt.emLetterDoNotReplayMessage='This letter is automatically sent by the system, please do not reply to this email.'] 輸入email模板內請勿回覆字串，預設'This letter is automatically sent by the system, please do not reply to this email.'
 * @param {Array} [opt.emLetterLinks=[]] 輸入email模板內超連結資訊物件，超連結物件需給予name與url兩屬性，預設[]
 * @param {String} [opt.emSignUpTitle='Verification letter'] 輸入註冊驗證email標題字串，預設'Verification letter'
 * @param {String} [opt.emSignUpHtml='file:emSignUpHtml.mjs'] 輸入註冊驗證email html模板字串，大括號標注字串為系統取代字串，預設模版文字放於'emSignUpHtml.mjs'
 * @param {String} [opt.emResetPWTitle='Password reset letter'] 輸入重設密碼驗證email標題字串，預設'Password reset letter'
 * @param {String} [opt.emResetPWHtml='file:emResetPWHtml.mjs'] 輸入重設密碼驗證email html模板字串，大括號標注字串為系統取代字串，預設模版文字放於'emResetPWHtml.mjs'
 * @param {String} [opt.verifyWebHtml='file:verifyWebHtml.mjs'] 輸入驗證連結網站html模板字串，大括號標注字串為系統取代字串，預設模版文字放於'verifyWebHtml.mjs'
 * @param {String} [opt.verifyWebLogo='file:verifyWebLogo.mjs'] 輸入驗證連結網站用logo圖字串，預設圖字串放於'verifyWebLogo.mjs'，為svg圖字串
 * @param {String} [opt.verifyWebMsgSuccess='Verify successfully'] 輸入驗證連結網站當成功驗證時之顯示字串，預設'Verify successfully'
 * @param {String} [opt.verifyWebMsgExpired='Code has expired'] 輸入驗證連結網站當無法驗證時之顯示字串，預設'Code has expired'
 * @param {String} [opt.verifyWebMsgCount='Go to the website automatically after {s} seconds...'] 輸入驗證連結網站當成功驗證時之倒數文字字串，預設'Go to the website automatically after {s} seconds..Promise.'
 * @param {Object} [opt.funcs={}] 輸入擴充指定執行函數物件，預設{}
 * @param {Array} [opt.routes=[]] 輸入擴充hapi routes陣列，預設[]
 * @returns {Object} 回傳通訊物件
 * @example
 * import WUserServer from 'WUserServer/src/w-user-server.mjs'
 *
 *
 * //webName
 * let webName = 'User management system'
 * // let webName = '使用者管理系統'
 *
 *
 * //webUrl
 * let webUrl = 'https://google.com'
 *
 *
 * //webDescription
 * let webDescription = "Let's do something and make it easier"
 * // let webDescription = '讓我們一起做更簡單的事'
 *
 *
 * //orm
 * let orm = WOrmMongodb({
 *     url: 'mongodb://username:password@127.0.0.1:27017',
 *     db: 'wuser',
 *     cl: 'users',
 * })
 *
 *
 * //opt
 * let opt = {
 *     orm,
 *     port: 8080,
 *     apiName: 'api',
 *     authUrl: 'http://localhost:8080/auth', //need webUrl+'/'+auth, use 'http://localhost:8080' in test case
 *     salt: 'zLAUfSLDUuausd0Aasu912SDU', //generate it for sites
 *     timeTokenExp: 30,
 *
 *     emSenderName: webName,
 *     emSenderEmail: "sender's email", //email address for email sender
 *     emSenderPW: "sender's password", //password for email sender
 *
 *     webName,
 *     webUrl,
 *     webDescription,
 *
 *     // emLetterTeamMessage: `${webName}開發團隊 敬上`,
 *     // emLetterDoNotReplayMessage: '本信由系統自動發信，請勿回信',
 *     emLetterLinks: [{ name: 'Google', url: 'https://google.com' }],
 *
 *     // emSignUpTitle: '註冊驗證信',
 *     // emSignUpHtml: `<p>親愛的 {name} 您好：</p><p>已收到您的註冊申請，請點擊下方連結進行驗證，確定驗證成功後即可登入。</p><p><a href="{urlCheckCode}" target="_blank">點擊此處驗證</a></p>`,
 *
 *     // emResetPWTitle: '重設密碼驗證信',
 *     // emResetPWHtml: `<p>親愛的 {name} 您好：</p><p>已收到您的重設密碼申請，請點擊下方連結進行驗證，確定驗證成功後即可登入。</p><p><a href="{urlCheckCode}" target="_blank">點擊此處驗證</a></p>`,
 *
 *     // verifyWebMsgSuccess: '驗證成功',
 *     // verifyWebMsgExpired: '驗證失敗',
 *     // verifyWebMsgCount: '{s} 秒後自動前往網站',
 *
 *     funcs: {},
 *     routes: [],
 * }
 *
 *
 * //new
 * let wus = new WUserServer(opt)
 * wus.on('all', function({ eventName, data }) {
 *     console.log('all:' + eventName, ...data)
 * })
 */
function WUserServer(opt = {}) {


    //ee
    let ee = new events.EventEmitter()


    //eeEmit
    function eeEmit(name, ...args) {
        setTimeout(() => {
            ee.emit(name, ...args)
            ee.emit('all', { eventName: name, data: [...args] })
        }, 1)
    }


    //pmWithEmit
    function pmWithEmit(fn, eventName = null) {
        return function() {
            let pm = genPm()

            //args
            let args = cloneDeep(arguments) //因物件記憶體同區, 進函式之後被更改皆會有影響, 等then或catch結束, 原本函數的輸入數據會變成已變更數據

            function core(msg) {
                if (eventName) {
                    eeEmit(eventName, {
                        input: args,
                        output: msg,
                    })
                }
            }

            fn.apply(this, arguments)
                .then(function(msg) {
                    core(msg)
                    pm.resolve(msg)
                })
                .catch(function(err) {
                    core(err)
                    pm.resolve(err)
                })

            return pm
        }
    }
    // function pmWithEmit(f, eventName = null) {
    //     return wrap(f, function(func, ...args) {
    //         let pm = genPm()

    //         function core(msg) {
    //             if (eventName) {
    //                 eeEmit(eventName, {
    //                     input: [...args],
    //                     output: msg,
    //                 })
    //             }
    //         }

    //         func(...args)
    //             .then(function(msg) {
    //                 core(msg)
    //                 pm.resolve(msg)
    //             })
    //             .catch(function(err) {
    //                 core(err)
    //                 pm.resolve(err)
    //             })

    //         return pm
    //     })
    // }


    //cloneDeep
    opt = cloneDeep(opt)


    //default
    if (!ispint(opt.port)) {
        opt.port = 8080
    }
    if (!isestr(opt.apiName)) {
        opt.apiName = 'api'
    }
    if (!isestr(opt.authUrl)) {
        opt.authUrl = 'http://localhost:8080/auth'
    }
    if (!isestr(opt.salt)) {
        opt.salt = '' //salt for password
    }
    if (!ispint(opt.timeTokenExp)) {
        opt.timeTokenExp = 30
    }
    if (!isestr(opt.webName)) {
        opt.webName = ''
    }
    if (!isestr(opt.webUrl)) {
        opt.webUrl = ''
    }
    if (!isestr(opt.webDescription)) {
        opt.webDescription = ''
    }
    if (!isestr(opt.emSenderName)) {
        opt.emSenderName = 'WUserServer'
    }
    if (!isestr(opt.emSenderEmail)) {
        console.log('invalid emSenderEmail')
        return ee
    }
    if (!isestr(opt.emSenderPW)) {
        opt.emSenderPW = ''
    }
    if (!isestr(opt.emBCC)) {
        opt.emBCC = ''
    }
    if (!isestr(opt.emLetterHtml)) {
        opt.emLetterHtml = emLetterHtml
    }
    if (!isestr(opt.emLetterTeamMessage)) {
        opt.emLetterTeamMessage = 'Global-User International Company'
    }
    if (!isestr(opt.emLetterDoNotReplayMessage)) {
        opt.emLetterDoNotReplayMessage = 'This letter is automatically sent by the system, please do not reply to this email.'
    }
    if (!isarr(opt.emLetterLinks)) {
        opt.emLetterLinks = []
    }
    if (!isestr(opt.emSignUpTitle)) {
        opt.emSignUpTitle = 'Verification letter'
    }
    if (!isestr(opt.emSignUpHtml)) {
        opt.emSignUpHtml = emSignUpHtml
    }
    if (!isestr(opt.emResetPWTitle)) {
        opt.emResetPWTitle = 'Password reset letter'
    }
    if (!isestr(opt.emResetPWHtml)) {
        opt.emResetPWHtml = emResetPWHtml
    }
    if (!isestr(opt.verifyWebHtml)) {
        opt.verifyWebHtml = verifyWebHtml
    }
    if (!isestr(opt.verifyWebLogo)) {
        opt.verifyWebLogo = verifyWebLogo
    }
    if (!isestr(opt.verifyWebMsgSuccess)) {
        opt.verifyWebMsgSuccess = 'Verify successfully'
    }
    if (!isestr(opt.verifyWebMsgExpired)) {
        opt.verifyWebMsgExpired = 'Code has expired'
    }
    if (!isestr(opt.verifyWebMsgCount)) {
        opt.verifyWebMsgCount = 'Go to the website automatically after {s} seconds...'
    }
    if (!isobj(opt.funcs)) {
        opt.funcs = {}
    }
    if (!isarr(opt.routes)) {
        opt.routes = []
    }
    let bfSelect = isfun(get(opt, 'orm.select', null))
    let bfInsert = isfun(get(opt, 'orm.insert', null))
    let bfSave = isfun(get(opt, 'orm.save', null))
    if (!bfSelect || !bfInsert || !bfSave) {
        console.log('invalid orm')
        return ee
    }


    //worm, need select insert save
    let worm = opt.orm


    //schema
    let sc = {
        id: {
            type: 'String',
            public: true,
            necessary: true,
            exclude: [],
            canModify: false,
        },
        name: {
            type: 'String',
            public: true,
            necessary: false,
            exclude: defExclude,
            canModify: true,
        },
        pwEnc: {
            type: 'String',
            public: false,
            necessary: true,
            exclude: [],
            canModify: false,
        },
        email: {
            type: 'String',
            public: true,
            necessary: true,
            exclude: defExclude,
            canModify: true,
        },
        address: {
            type: 'String',
            public: true,
            necessary: false,
            exclude: defExclude,
            canModify: true,
        },
        phone: {
            type: 'String',
            public: true,
            necessary: false,
            exclude: defExclude,
            canModify: true,
        },
        organization: {
            type: 'String',
            public: true,
            necessary: false,
            exclude: defExclude,
            canModify: true,
        },
        position: {
            type: 'String',
            public: true,
            necessary: false,
            exclude: defExclude,
            canModify: true,
        },
        role: {
            type: 'String', //roleGeneral|roleSystem
            public: true,
            necessary: true,
            exclude: defExclude,
            canModify: false,
        },
        checkCode: {
            type: 'String',
            public: false,
            necessary: false,
            exclude: [],
            canModify: false,
        },
        token: {
            type: 'String',
            public: false,
            necessary: false,
            exclude: [],
            canModify: false,
        },
        tokenExp: {
            type: 'String',
            public: false,
            necessary: false,
            exclude: [],
            canModify: false,
        },
        timeCreate: {
            type: 'String',
            public: false,
            necessary: true,
            exclude: [],
            canModify: false,
        },
        timeLogin: {
            type: 'String',
            public: false,
            necessary: false,
            exclude: [],
            canModify: false,
        },
        remark: {
            type: 'String', //'Object',
            public: true,
            necessary: false,
            exclude: [],
            canModify: true,
        },
        active: {
            type: 'String', //activeYes|activeNo
            public: false,
            necessary: true,
            exclude: [],
            canModify: false,
        },
    }


    let wsaveR = pm2resolve(worm.save)


    function verifyPropCore(k, v) {
        if (haskey(sc, k)) {
            let t = sc[k].type
            let e = sc[k].exclude
            if (t === 'String') {
                if (!isstr(v)) {
                    return getError('value is not string: ' + v)
                }
                if (binstr(v, e)) {
                    return getError('can not contain special characters: "<" or ">"')
                }
                return getSuccess()
            }
            else if (t === 'Object') {
                if (!isobj(v)) {
                    return getError('value is not object: ' + v)
                }
                return getSuccess()
            }
            return getError('type is not defined: ' + t)
        }
        else {
            return getError('invalid key: ' + k)
        }
    }


    /**
     * 驗證使用者資料欄位
     *
     * @param {Object} u 輸入使用者資料物件
     * @returns {Object} 回傳判斷物件，state為'success'為成功驗證，state為'error'為有錯誤，msg為儲存錯誤訊息
     */
    function verifyProp(u) {
        each(u, function(v, k) {
            let r = verifyPropCore(k, v)
            if (r.state === 'error') {
                return r
            }
        })
        return getSuccess()
    }


    /**
     * 針對使用者資料物件處理，若無給指定欄位，則自動給予預設值
     *
     * @param {Object} u 輸入使用者資料物件
     * @returns {Object} 回傳使用者資料物件，指定欄位若沒給則自動填入預設值
     */
    function defaultProp(u) {
        each(sc, function(v, k) {
            let def = ''
            if (v.type === 'Object') {
                def = {}
            }
            if (!haskey(u, k)) {
                u[k] = def
            }
            else if (u[k] === null || u[k] === undefined) {
                u[k] = def
            }
        })
        return u
    }


    async function selectPublic({ token, find }) {
        let pm = genPm()
        let r = null

        //isValidTokenR
        r = await isValidTokenR(token)

        //cehck
        if (r.state === 'error') {
            pm.reject(r.msg)
            return pm
        }

        //select
        worm.select(find)
            .then(function(msg) {
                if (msg.length >= 1) {

                    //uesrs
                    let users = msg

                    //cols, 允許公開的欄位
                    let cols = []
                    each(sc, function(v, k) {
                        if (v.public) {
                            cols.push(k)
                        }
                    })

                    //user, 重新提取允許公開的欄位
                    users = map(users, function(u) {
                        return pick(u, cols)
                    })

                    pm.resolve(users) //公開查詢用, 只能提供公開欄位資訊
                }
                else {
                    pm.reject('can not find user')
                }
            })
            .catch(function(err) {
                console.log('selectPublic catch:', err, 'find:', find)
                pm.reject('error')
            })

        return pm
    }
    let selectPublicR = pm2resolve(selectPublic)


    /**
     * 新增使用者
     *
     * @memberof WUserServer::Private
     * @function insert
     * @param {Object} user 輸入使用者物件
     * @returns {Promise} 回傳Promise，resolve回傳使用者id與驗證碼(checkCode)，reject代表錯誤並回傳錯誤訊息
     */
    async function insert(user) {
        let pm = genPm()
        let r = null

        //check, 需有加密密碼
        if (!isestr(user.pwEnc)) {
            pm.reject('invalid password')
            return pm
        }

        //check, 需有email
        if (!isEmail(user.email)) {
            pm.reject('invalid email')
            return pm
        }

        //check email
        let existEmail = await isExist({ email: user.email })
        if (existEmail) {
            pm.reject('email has been used')
            return pm
        }

        //verifyProp
        r = verifyProp(user)
        if (r.state === 'error') {
            pm.reject(r.msg)
            return pm
        }

        //defaultProp
        user = defaultProp(user)

        //id
        user.id = genID()

        //加密密碼加鹽再加密
        if (opt.salt !== '') {
            user.pwEnc = str2sha512(user.pwEnc + opt.salt)
        }

        //checkCode
        user.checkCode = genID()

        //timeCreate
        user.timeCreate = now2str()

        //role
        user.role = defRole.roleGeneral

        //active
        user.active = defActive.activeYes

        //insert
        worm.insert(user)
            .then(function(msg) {
                pm.resolve({
                    id: user.id,
                    checkCode: user.checkCode,
                })
            })
            .catch(function(err) {
                console.log('insert catch:', err, 'user:', user)
                pm.reject('error')
            })

        return pm
    }
    let insertR = pm2resolve(insert)


    /**
     * 查詢單一使用者
     *
     * @memberof WUserServer::Private
     * @function selectOne
     * @param {Object} find 輸入查詢物件
     * @returns {Promise} 回傳Promise，resolve回傳單一使用者資訊物件，reject代表錯誤並回傳錯誤訊息
     */
    function selectOne(find) {
        let pm = genPm()

        //select
        worm.select(find)
            .then(function(msg) {
                if (msg.length === 1) {
                    pm.resolve(msg[0])
                }
                else if (msg.length > 1) {
                    pm.reject(`find ${msg.length} users`)
                }
                else {
                    pm.reject('can not find user')
                }
            })
            .catch(function(err) {
                console.log('selectOne catch:', err, 'find:', find)
                pm.reject('error')
            })

        return pm
    }
    let selectOneR = pm2resolve(selectOne)


    /**
     * 判斷使用者是否存在
     *
     * @memberof WUserServer::Private
     * @function isExist
     * @param {Object} find 輸入查詢物件
     * @returns {Promise} 回傳Promise，resolve回傳是否存在，reject代表錯誤並回傳錯誤訊息
     */
    function isExist(find) {
        let pm = genPm()

        //check
        if (!iseobj(find)) {
            pm.reject('invalid find')
            return pm
        }

        //select
        worm.select(find)
            .then(function(msg) {
                if (msg.length >= 1) { //不管找到超過1位使用者是否合理, 有就代表存在
                    pm.resolve(true)
                }
                else {
                    pm.resolve(false)
                }
            })
            .catch(function(err) {
                console.log('select catch:', err, 'find:', find)
                pm.reject('error')
            })

        return pm
    }


    async function signUp(user) {
        let pm = genPm()
        let r = null

        //insertR
        r = await insertR(user)

        //cehck
        if (r.state === 'error') {
            pm.reject(r.msg) //已封裝過可直接回傳
            return pm
        }

        //user
        let id = r.msg.id
        user.id = id

        //checkCode
        let checkCode = r.msg.checkCode
        user.checkCode = checkCode

        //urlCheckCode
        let urlCheckCode = `${opt.authUrl}?checkCode=${checkCode}`

        //sendEmailWhenSignUpR, 寄信給使用者驗證碼(checkCode), 點擊後才視為驗證成功
        r = await sendEmailWhenSignUpR(user.name, urlCheckCode, user.email)

        //cehck
        if (r.state === 'error') {
            console.log('signUp catch:', r.msg, 'emailObj:', { name: user.name, urlCheckCode, email: user.email })
            pm.reject('can not send email')
            return pm
        }

        pm.resolve(user.id)
        return pm
    }
    let signUpR = pm2resolve(signUp)


    async function logIn({ email, pwEnc }) {
        let pm = genPm()
        let r = null

        //check
        if (!isestr(email)) {
            pm.reject('invalid email')
            return pm
        }
        if (!isestr(pwEnc)) {
            pm.reject('invalid password')
            return pm
        }

        //find
        let find = { email } //先查詢email是否存在

        //selectOneR
        r = await selectOneR(find)

        //cehck
        if (r.state === 'error') {
            console.log('logIn catch:', r.msg, 'find:', find)
            pm.reject('email or password is incorrect') //找不到使用者, 回傳訊息統一為email或密碼不正確
            return pm
        }

        //user
        let user = r.msg

        //check checkCode, 帳號需驗證後才能登入, 於檢查密碼之前檢查, 避免使用者更換密碼未驗證前檢核密碼一定錯誤問題
        if (user.checkCode !== '') {
            pm.reject('account is not verified')
            return pm
        }

        //加密密碼加鹽再加密
        if (opt.salt !== '') {
            pwEnc = str2sha512(pwEnc + opt.salt)
        }

        //check pwEnc, 確認密碼是否正確
        if (user.pwEnc !== pwEnc) {
            pm.reject('email or password is incorrect') //密碼錯誤, 回傳訊息統一為email或密碼不正確
            return pm
        }

        //check active, 帳號需有效才能登入
        if (user.active !== defActive.activeYes) {
            pm.reject('account is suspended')
            return pm
        }

        //isValidTokenR
        r = await isValidTokenR(user.token)

        //cehck
        if (r.state === 'success') {

            pm.resolve(user.token) //已登入則改回傳既有token
            return pm
        }

        //token
        let token = genID()

        //userModify
        let userModify = {
            id: user.id,
            token,
            tokenExp: toStrDate(dayjs().add(opt.timeTokenExp, 'minute')),
            timeLogin: now2str()
        }

        //wsaveR
        r = await wsaveR(userModify)

        //cehck
        if (r.state === 'error') {
            console.log('logIn catch:', r.msg, 'userModify:', userModify)
            pm.reject('can not save token')
            return pm
        }

        pm.resolve(token)
        return pm
    }
    let logInR = pm2resolve(logIn)


    async function logOut(token) {
        let pm = genPm()
        let r = null

        //check
        if (!isestr(token)) {
            pm.reject('invalid token')
            return pm
        }

        //find
        let find = { token }

        //selectOneR
        r = await selectOneR(find)

        //cehck
        if (r.state === 'error') {
            console.log('logOut catch:', r.msg, 'find:', find)
            pm.reject('invalid token')
            return pm
        }

        //user
        let user = r.msg

        //userModify
        let userModify = {
            id: user.id,
            token: '',
            tokenExp: ''
        }

        //wsaveR
        r = await wsaveR(userModify)

        //cehck
        if (r.state === 'error') {
            console.log('logOut catch:', r.msg, 'userModify:', userModify)
            pm.reject('can not update token')
            return pm
        }

        pm.resolve('ok')
        return pm
    }
    let logOutR = pm2resolve(logOut)


    /**
     * 清除驗證瑪
     *
     * @memberof WUserServer::Private
     * @function verifyCheckCode
     * @param {String} checkCode
     * @returns {Promise} 回傳Promise，resolve回傳使用者id，reject代表錯誤並回傳錯誤訊息
     */
    function verifyCheckCode(checkCode) {
        let pm = genPm()

        //check
        if (!isestr(checkCode)) {
            pm.reject(opt.verifyWebMsgExpired)
            return pm
        }

        //find
        let find = { checkCode }

        //selectOne
        selectOne(find)
            .then(function(user) {

                //userModify
                let userModify = {
                    id: user.id,
                    checkCode: ''
                }

                //save
                return worm.save(userModify)
            })
            .then(function(msg) {
                pm.resolve(opt.verifyWebMsgSuccess)
            })
            .catch(function(err) {
                console.log('verifyCheckCode catch:', err, 'find:', find)
                pm.reject(opt.verifyWebMsgExpired)
            })

        return pm
    }


    /**
     * 產生驗證結果網站用html
     *
     * @memberof WUserServer::Private
     * @function genVerifyHtml
     * @param {String} [rdMessage=''] 輸入訊息字串
     * @param {String} [rdCountdown='false'] 輸入是否顯示倒數文字字串，可選為'true'或'false'
     * @param {String} [rdCountdownMessage=''] 輸入顯示倒數文字字串
     * @returns {String} 回傳html字串
     */
    function genVerifyHtml(rdMessage = '', rdCountdown = 'false', rdCountdownMessage = '') {

        //tmp
        let tmp = opt.verifyWebHtml

        //replaceObj
        tmp = replaceObj(tmp, {
            '{rdWebName}': opt.webName,
            '{rdWebDescription}': opt.webDescription,
            '{rdWebUrl}': opt.webUrl,
            '{rdLogo}': opt.verifyWebLogo,
            '{rdMessage}': rdMessage, //驗證成功|驗證失敗
            '{rdCountdown}': rdCountdown, //true|false
            '{rdCountdownMessage}': rdCountdownMessage, //秒後自動前往網站
        })

        return tmp
    }


    function verifyCheckCodeAndGetHtml(checkCode) {
        let pm = genPm()

        //rdCountdownMessage
        let rdCountdownMessage = opt.verifyWebMsgCount

        verifyCheckCode(checkCode)
            .then(function(msg) {
                eeEmit('verifyCheckCodeAndGetHtml', { state: 'success', msg, checkCode })
                pm.resolve(genVerifyHtml(msg, 'true', rdCountdownMessage))
            })
            .catch(function(err) {
                eeEmit('verifyCheckCodeAndGetHtml', { state: 'error', msg: err, checkCode })
                pm.resolve(genVerifyHtml(err, 'false', ''))
            })

        return pm
    }


    /**
     * 評估驗證碼過期時間並回傳狀態
     *
     * @memberof WUserServer::Private
     * @function verifyTokenExp
     * @param {String} tokenExp
     * @returns {Promise} 回傳Promise，resolve表示成功，reject代表錯誤並回傳錯誤訊息
     */
    function verifyTokenExp(tokenExp) {
        //可不用回傳promise, 為統一函數型態
        let pm = genPm()

        //check
        if (!istimeTZ(tokenExp)) {
            pm.reject('no expire time for token')
        }
        else {

            //現在時間
            let dnow = dayjs()

            //token有效時間
            let dtoken = fromStrDate(tokenExp)

            //相差分鐘
            let iMinutes = dtoken.diff(dnow, 'minute')

            //check
            if (iMinutes > 0) {
                pm.resolve('ok')
            }
            else if (iMinutes > opt.timeTokenExp) {
                console.log('verifyTokenExp error:', 'iMinutes=' + iMinutes, '>', 'timeTokenExp=' + opt.timeTokenExp)
                pm.reject('invalid tokenExp')
            }
            else {
                pm.reject('token expired')
            }

        }

        return pm
    }
    let verifyTokenExpR = pm2resolve(verifyTokenExp)


    async function isValidToken(token) {
        let pm = genPm()
        let r = null

        //check
        if (!isestr(token)) {
            pm.reject('invalid token')
            return pm
        }

        //find
        let find = { token }

        //selectOneR
        r = await selectOneR(find)

        //cehck
        if (r.state === 'error') {
            console.log('isValidToken catch:', r.msg, 'find:', find)
            pm.reject('invalid token')
            return pm
        }

        //user
        let user = r.msg

        //verifyTokenExpR
        r = verifyTokenExpR(user.tokenExp)

        //cehck
        if (r.state === 'error') {
            pm.reject(r.msg)
            return pm
        }

        pm.resolve('ok')
        return pm
    }
    let isValidTokenR = pm2resolve(isValidToken)


    async function refreshTokenExp(token) {
        let pm = genPm()
        let r = null

        //check
        if (!isestr(token)) {
            pm.reject('invalid token')
            return pm
        }

        //find
        let find = { token }

        //selectOneR
        r = await selectOneR(find)

        //cehck
        if (r.state === 'error') {
            console.log('refreshTokenExp catch:', r.msg, 'find:', find)
            pm.reject('invalid token')
            return pm
        }

        //user
        let user = r.msg

        //verifyTokenExp
        r = verifyTokenExp(user.tokenExp)
        if (r.state === 'error') {
            pm.reject(r.err)
            return pm
        }

        //userModify
        let userModify = {
            id: user.id,
            tokenExp: toStrDate(dayjs().add(opt.timeTokenExp, 'minute')),
        }

        //wsaveR
        r = await wsaveR(userModify)

        //cehck
        if (r.state === 'error') {
            console.log('refreshTokenExp catch:', r.msg, 'userModify:', userModify)
            pm.reject('can not update token')
            return pm
        }

        pm.resolve('ok')
        return pm
    }
    let refreshTokenExpR = pm2resolve(refreshTokenExp)


    /**
     * 由token取得使用者資訊
     *
     * @memberof WUserServer::Private
     * @function getUserFromToken
     * @param {String} token
     * @returns {Promise} 回傳Promise，resolve代表成功直接回傳使用者資訊物件，reject代表錯誤並回傳錯誤訊息
     */
    async function getUserFromToken(token) {
        let pm = genPm()
        let r = null

        //find
        let find = { token }

        //selectOneR
        r = await selectOneR(find)

        //cehck
        if (r.state === 'error') {
            console.log('getUserFromToken catch:', r.msg, 'find:', find)
            pm.reject('invalid token')
            return pm
        }

        //user
        let user = r.msg

        pm.resolve(user)
        return pm
    }

    async function changePW({ email, pwEnc, pwEncNew }) {
        let pm = genPm()
        let r = null

        //check
        if (!isestr(email)) {
            pm.reject('invalid email')
            return pm
        }
        if (!isestr(pwEnc)) {
            pm.reject('invalid old password')
            return pm
        }
        if (!isestr(pwEncNew)) {
            pm.reject('invalid new password')
            return pm
        }

        //find
        let find = { email } //先查詢email是否存在

        //selectOneR
        r = await selectOneR(find)

        //cehck
        if (r.state === 'error') {
            console.log('changePW catch:', r.msg, 'find:', find)
            pm.reject('email or password is incorrect') //找不到使用者, 回傳訊息統一為email或密碼不正確
            return pm
        }

        //user
        let user = r.msg

        //check checkCode, 帳號需驗證後才能更改密碼
        if (user.checkCode !== '') {
            pm.reject('account is not verified')
            return pm
        }

        //check active, 帳號需有效才能更改密碼
        if (user.active !== defActive.activeYes) {
            pm.reject('account is suspended')
            return pm
        }

        //加密密碼加鹽再加密
        if (opt.salt !== '') {
            pwEnc = str2sha512(pwEnc + opt.salt)
            pwEncNew = str2sha512(pwEncNew + opt.salt)
        }

        //check pwEnc, 確認密碼是否正確
        if (user.pwEnc !== pwEnc) {
            pm.reject('email or password is incorrect') //回傳訊息統一為email或密碼不正確
            return pm
        }

        //userModify
        let userModify = {
            id: user.id,
            pwEnc: pwEncNew
        }

        //wsaveR
        r = await wsaveR(userModify)

        //cehck
        if (r.state === 'error') {
            console.log('changePW catch:', r.msg, 'userModify:', userModify)
            pm.reject('can not update password')
            return pm
        }

        pm.resolve('ok')
        return pm
    }
    let changePWR = pm2resolve(changePW)


    async function resetPW({ email, pwEncNew }) {
        let pm = genPm()
        let r = null

        //check
        if (!isestr(email)) {
            pm.reject('invalid email')
            return pm
        }
        if (!isestr(pwEncNew)) {
            pm.reject('invalid new password')
            return pm
        }

        //find
        let find = { email } //先查詢email是否存在

        //selectOneR
        r = await selectOneR(find)

        //cehck
        if (r.state === 'error') {
            console.log('resetPW catch:', r.msg, 'find:', find)
            pm.reject('email is incorrect')
            return pm
        }

        //user
        let user = r.msg

        //check checkCode, 帳號不需驗證亦可申請重設密碼驗證信

        //check active, 帳號需有效才能申請重設密碼驗證信
        if (user.active !== defActive.activeYes) {
            pm.reject('account is suspended')
            return pm
        }

        //加密密碼加鹽再加密
        if (opt.salt !== '') {
            pwEncNew = str2sha512(pwEncNew + opt.salt)
        }

        //checkCode
        let checkCode = genID()

        //userModify
        let userModify = {
            id: user.id,
            pwEnc: pwEncNew,
            checkCode
        }

        //wsaveR
        r = await wsaveR(userModify)

        //cehck
        if (r.state === 'error') {
            console.log('resetPW catch:', r.msg, 'userModify:', userModify)
            pm.reject('can not update password')
            return pm
        }

        //urlCheckCode
        let urlCheckCode = `${opt.authUrl}?checkCode=${checkCode}`

        //sendEmailWhenResetPWR, 寄信給使用者驗證碼(checkCode), 點擊後才視為驗證成功
        r = await sendEmailWhenResetPWR(user.name, urlCheckCode, user.email)

        //cehck
        if (r.state === 'error') {
            console.log('resetPW catch:', r.msg, 'emailObj:', { name: user.name, urlCheckCode, email: user.email })
            pm.reject('can not send email')
            return pm
        }

        pm.resolve('ok')
        return pm
    }
    let resetPWR = pm2resolve(resetPW)


    async function modifyInfor({ token, user }) {
        let pm = genPm()
        let r = null

        //isValidTokenR
        r = await isValidTokenR(token)

        //cehck
        if (r.state === 'error') {
            pm.reject(r.msg)
            return pm
        }

        //verifyProp
        r = verifyProp(user)
        if (r.state === 'error') {
            pm.reject(r.msg)
            return pm
        }

        //getUserFromToken
        let userOld = await getUserFromToken(token)

        //userModify
        let userModify = {
            id: userOld.id,
        }

        //modify
        let bModify = false
        each(sc, function(v, k) {
            if (v.canModify) {
                if (user[k] && userOld[k] !== user[k]) {
                    bModify = true
                    userModify[k] = user[k]
                }
            }
        })

        //check
        if (!bModify) {
            pm.resolve('no change')
            return pm
        }

        //wsaveR
        r = await wsaveR(userModify)

        //cehck
        if (r.state === 'error') {
            console.log('modifyInfor catch:', r.msg, 'userModify:', userModify)
            pm.reject('can not modify')
            return pm
        }

        pm.resolve('ok')
        return pm
    }
    let modifyInforR = pm2resolve(modifyInfor)


    /**
     * 寄送email
     *
     * @param {String} emTitle 輸入郵件名稱字串
     * @param {String} emContent 輸入郵件訊息字串
     * @param {String|Array} toEmails 輸入收件人email字串或陣列
     * @param {String|Array} [toEmailsCC=[]] 輸入副本收件人email字串或陣列，預設[]
     * @param {String|Array} [toEmailsBCC=[]] 輸入密件副本收件人email字串或陣列，預設[]
     * @returns {Promise} 回傳Promise，resolve回傳成功訊息，reject回傳錯誤訊息
     */
    function sendEmail(emTitle, emContent, toEmails, toEmailsCC = [], toEmailsBCC = []) {

        //optEmail
        let optEmail = {
            srcName: opt.emSenderName,
            srcEmail: opt.emSenderEmail,
            srcPW: opt.emSenderPW,
            emTitle,
            emContent,
            toEmails,
            toEmailsCC,
            toEmailsBCC,
        }

        //WEmail
        return new WEmail(optEmail)
    }


    /**
     * 使用模板呈現內文並寄送email
     *
     * @param {String} emTitle 輸入郵件名稱字串
     * @param {String} emContent 輸入郵件訊息字串
     * @param {String|Array} toEmails 輸入收件人email字串或陣列
     * @param {String|Array} [toEmailsCC=[]] 輸入副本收件人email字串或陣列，預設[]
     * @param {String|Array} [toEmailsBCC=[]] 輸入密件副本收件人email字串或陣列，預設[]
     * @returns {Promise} 回傳Promise，resolve回傳成功訊息，reject回傳錯誤訊息
     */
    function sendEmailByLetter(emTitle, emContent, toEmails, toEmailsCC, toEmailsBCC) {

        //tmp
        let tmp = opt.emLetterHtml

        //webName, webUrl, emLetterLinks
        let webName = opt.webName
        let webUrl = opt.webUrl
        let emLetterLinks = opt.emLetterLinks
        if (webName !== '' && webUrl !== '') {
            emLetterLinks = concat({ name: webName, url: webUrl }, emLetterLinks)
        }
        emLetterLinks = map(emLetterLinks, function(v) {
            let name = get(v, 'name', '')
            let url = get(v, 'url', '')
            return `<a style="text-decoration:none" href="${url}" target="_blank" >${name}</a>`
        })
        emLetterLinks = `| ${join(emLetterLinks, ' | ')} |`

        //replaceObj
        tmp = replaceObj(tmp, {
            '{emMessage}': emContent,
            '{emWebName}': webName,
            '{emWebUrl}': webUrl,
            '{emWebDescription}': opt.webDescription,
            '{emLetterDoNotReplayMessage}': opt.emLetterDoNotReplayMessage,
            '{emLetterTeamMessage}': opt.emLetterTeamMessage,
            '{emLetterLinks}': emLetterLinks,
        })

        //sendEmail
        return sendEmail(emTitle, tmp, toEmails, toEmailsCC, toEmailsBCC)
    }


    function sendEmailWhenSignUp(name, urlCheckCode, toEmails) {

        //emTitle
        let emTitle = opt.emSignUpTitle

        //tmp
        let tmp = opt.emSignUpHtml

        //replaceObj
        tmp = replaceObj(tmp, {
            '{name}': name,
            '{urlCheckCode}': urlCheckCode,
        })

        return sendEmailByLetter(emTitle, tmp, toEmails, [], opt.emBCC)
    }
    let sendEmailWhenSignUpR = pm2resolve(sendEmailWhenSignUp)


    function sendEmailWhenResetPW(name, urlCheckCode, toEmails) {

        //emTitle
        let emTitle = opt.emResetPWTitle

        //tmp
        let tmp = opt.emResetPWHtml

        //replaceObj
        tmp = replaceObj(tmp, {
            '{name}': name,
            '{urlCheckCode}': urlCheckCode,
        })

        return sendEmailByLetter(emTitle, tmp, toEmails, [], opt.emBCC)
    }
    let sendEmailWhenResetPWR = pm2resolve(sendEmailWhenResetPW)


    //funcs
    let funcs = {


        /**
         * 公開用查詢使用者
         *
         * @memberof WUserServer
         * @function select
         * @param {Object} inp 輸入token與查詢物件
         * @param {String} inp.token 輸入使用者token字串
         * @param {Object} [inp.find={}] 輸入查詢物件，預設{}
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，於msg為使用者資料陣列，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        select: function(inp) {
            return pmWithEmit(selectPublicR, 'selectPublic')(inp)
        },


        /**
         * 使用者註冊新帳號
         *
         * 1.使用者用email註冊帳號，且email於全系統唯一不得重複，已申請過不得再被使用
         *
         * 2.註冊之後，使用者需收信驗證通過，帳號才會有效(active為activeYes)
         *
         * 3.若使用者忘記點擊或沒收到信，則該email不能再被申請，需由使用者用忘記密碼功能，系統重新寄送驗證信後進行驗證
         *
         * 4.被停權者(active非activeYes)，需由系統管理員復權
         *
         * @memberof WUserServer
         * @function signUp
         * @param {Object} user 輸入使用者物件
         * @param {String} user.email 輸入email字串
         * @param {String} user.pwEnc 輸入密碼加密後字串
         * @param {String} [user.address=''] 輸入地址字串
         * @param {String} [user.phone=''] 輸入電話字串
         * @param {String} [user.organization=''] 輸入組織字串
         * @param {String} [user.position=''] 輸入職位字串
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，於msg顯示使用者id，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        signUp: function(user) {
            return pmWithEmit(signUpR, 'signUp')(user)
        },


        /**
         * 使用者登入
         *
         * 1.使用者以email與密碼為登入，且帳號需為有效(active為activeYes)
         *
         * 2.帳號需驗證後才能登入，使用者需先收信驗證
         *
         * 3.無驗證則重寄驗證信。若使用者忘記點擊或沒收到信，則該email不能再被申請，需由使用者用忘記密碼功能，系統重新寄送驗證信後進行驗證
         *
         * 4.忘記密碼則重寄驗證信。若使用者登入失敗或忘記密碼，請使用者確認自己email是否正確。若是忘記密碼，則使用忘記密碼功能，系統重新寄送驗證信後進行驗證
         *
         * 5.支援多點登入。若使用者重複或多點登入時，且token亦於有效時限內，則直接給予當前token而不再另外產生，避免造成前次token失效
         *
         * @memberof WUserServer
         * @function logIn
         * @param {Object} user 輸入使用者物件
         * @param {String} user.email 輸入email字串
         * @param {String} user.pwEnc 輸入密碼加密後字串
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，於msg顯示使用者token，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        logIn: function(user) {
            return pmWithEmit(logInR, 'logIn')(user)
        },


        /**
         * 更新使用者token過期時間
         *
         * 1.token需仍於有效時限內才能刷新
         *
         * @memberof WUserServer
         * @function refreshTokenExp
         * @param {String} token 輸入使用者token字串
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        refreshTokenExp: function(token) {
            return pmWithEmit(refreshTokenExpR, 'refreshTokenExp')(token)
        },


        /**
         * 確認使用者token是否有效
         *
         * 1.確認使用者token是否仍於有效時限內
         *
         * @memberof WUserServer
         * @function isValidToken
         * @param {String} token 輸入使用者token字串
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        isValidToken: function(token) {
            return pmWithEmit(isValidTokenR, 'isValidToken')(token)
        },


        /**
         * 使用者登出
         *
         * 1.使用者憑token登出
         *
         * @memberof WUserServer
         * @function logOut
         * @param {String} token 輸入使用者token字串
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        logOut: function(token) {
            return pmWithEmit(logOutR, 'logOut')(token)
        },


        /**
         * 使用者變更密碼
         *
         * 1.帳號需為有效(active為activeYes)
         *
         * 2.帳號需驗證後才能更改密碼
         *
         * @memberof WUserServer
         * @function changePW
         * @param {Object} user 輸入使用者物件
         * @param {String} user.email 輸入email字串
         * @param {String} user.pwEnc 輸入密碼加密後字串
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        changePW: function(user) {
            return pmWithEmit(changePWR, 'changePW')(user)
        },


        /**
         * 使用者重設密碼
         *
         * 1.帳號需為有效(active為activeYes)
         *
         * 2.使用者忘記密碼時，可直接設定新密碼並寄送驗證信
         *
         * 2.帳號不需通過驗證也可申請變更密碼，當使用者申請帳號但忘記收信驗證時，以此可重新設定新密碼並收信驗證
         *
         * @memberof WUserServer
         * @function resetPW
         * @param {Object} user 輸入使用者物件
         * @param {String} user.email 輸入email字串
         * @param {String} user.pwEncNew 輸入新密碼加密後字串
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        resetPW: function(user) {
            return pmWithEmit(resetPWR, 'resetPW')(user)
        },


        /**
         * 使用者更改自己資料
         *
         * @memberof WUserServer
         * @function modifyInfor
         * @param {Object} inp 輸入token與查詢物件
         * @param {String} inp.token 輸入使用者token字串
         * @param {Object} [inp.user={}] 輸入使用者資訊物件，預設{}
         * @returns {Promise} 回傳Promise，resolve回傳物件，成功則state為'success'，失敗則state為'error'，於msg顯示錯誤訊息，無reject
         */
        modifyInfor: function(inp) {
            return pmWithEmit(modifyInforR, 'modifyInfor')(inp)
        },


    }
    each(opt.funcs, function(v, k) {
        if (haskey(funcs, k)) {
            console.log('invalid func: ' + k)
        }
        else {
            funcs[k] = opt.funcs[k]
        }
    })


    //routes
    let routes = [
        {
            method: 'GET',
            path: '/auth',
            handler: async function (req, res) {
                //console.log(`Server[port:${opt.port}][api:auth]:`, 'checkCode: ' + req.query.checkCode)

                //checkCode
                let checkCode = req.query.checkCode

                /**
                 * 接收使用者點擊信內提供的驗證碼連結
                 *
                 * 1.判斷並清除使用者驗證瑪
                 *
                 * 2.成功與失敗會回傳顯示網站html
                 *
                 * @memberof WUserServer::Private
                 * @function verifyCheckCodeAndGetHtml
                 * @param {String} checkCode
                 * @returns {Promise} 回傳Promise，resolve回傳驗證結果html，無reject
                 */
                return verifyCheckCodeAndGetHtml(checkCode)
            }
        },
    ]
    each(opt.routes, function(v) {
        routes.push(v)
    })


    //merge opt
    opt = {
        ...opt,
        // filterFuncs: function(token, funcs) {
        //     return new Promise(function(resolve, reject) {
        //         funcs = funcs.filter(function(v) {
        //             return v.indexOf('Hide') < 0
        //         })
        //         resolve(funcs)
        //     })
        // },
        onClientChange: function(clients, opt) {
            //console.log(`Server[port:${opt.port}] now clients: ${clients.length}`)
            eeEmit('clientChange', clients.length, clients)
        },
        funcs,
        routes,
    }


    //new
    new WComorHapiServer(opt)


    return ee
}


export default WUserServer
