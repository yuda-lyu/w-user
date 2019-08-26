import HtClient from 'w-comor-hapi/src/HtClient.mjs'
//import HtClient from 'w-comor-hapi/dist/ht-client.umd'


/**
 * 建立對使用者Hapi伺服器的客戶端(Node.js與Browser)物件，直接繼承於HtClient
 *
 * Inherit: {@link https://yuda-lyu.github.io/w-comor-hapi/global.html HtClient}
 *
 * @see {@link https://yuda-lyu.github.io/w-comor-hapi/global.html HtClient}
 *
 * @class
 * @example
 * import WUserClient from 'WUserClient/src/w-user-client.mjs'
 *
 *
 * //opt
 * let opt = {
 *     url: 'http://localhost:8080/api',
 *     token: '*',
 *     error: function(err) {
 *         console.log('client nodejs: error:', err)
 *     },
 *     reconn: function() {
 *         console.log('client nodejs: reconn')
 *     },
 * }
 *
 *
 * function testSelect(wo, inp) {
 *
 *     return wo.select(inp)
 *         .then(function(msg) {
 *             console.log('select then: ', msg)
 *         })
 *         .catch(function(err) {
 *             console.log('select catch: ', err)
 *         })
 *
 * }
 *
 *
 * function testSignUp(wo, user) {
 *
 *     wo.signUp(user)
 *         .then(function(msg) {
 *             console.log('signUp then: ', msg)
 *         })
 *         .catch(function(err) {
 *             console.log('signUp catch: ', err)
 *         })
 *
 * }
 *
 *
 * async function testLogIn(wo, user) {
 *     let token = null
 *
 *     await wo.logIn(user)
 *         .then(function(msg) {
 *             console.log('logIn then: ', msg)
 *             token = msg.msg
 *         })
 *         .catch(function(err) {
 *             console.log('logIn catch: ', err)
 *         })
 *
 *     return token
 * }
 *
 *
 * function testIsValidToken(wo, token) {
 *
 *     return wo.isValidToken(token)
 *         .then(function(msg) {
 *             console.log('isValidToken then: ', msg.state === 'success', msg)
 *         })
 *         .catch(function(err) {
 *             console.log('isValidToken catch: ', err)
 *         })
 *
 * }
 *
 *
 * function testRefreshTokenExp(wo, token) {
 *
 *     return wo.refreshTokenExp(token)
 *         .then(function(msg) {
 *             console.log('refreshTokenExp then: ', msg.state === 'success', msg)
 *         })
 *         .catch(function(err) {
 *             console.log('refreshTokenExp catch: ', err)
 *         })
 *
 * }
 *
 *
 * function testLogOut(wo, token) {
 *
 *     return wo.logOut(token)
 *         .then(function(msg) {
 *             console.log('logOut then: ', msg.state === 'success', msg)
 *         })
 *         .catch(function(err) {
 *             console.log('logOut catch: ', err)
 *         })
 *
 * }
 *
 *
 * function testChangePW(wo, user) {
 *
 *     return wo.changePW(user)
 *         .then(function(msg) {
 *             console.log('changePW then: ', msg.state === 'success', msg)
 *         })
 *         .catch(function(err) {
 *             console.log('changePW catch: ', err)
 *         })
 *
 * }
 *
 *
 * function testResetPW(wo, user) {
 *
 *     return wo.resetPW(user)
 *         .then(function(msg) {
 *             console.log('resetPW then: ', msg.state === 'success', msg)
 *         })
 *         .catch(function(err) {
 *             console.log('resetPW catch: ', err)
 *         })
 *
 * }
 *
 *
 * function testModifyInfor(wo, inp) {
 *
 *     return wo.modifyInfor(inp)
 *         .then(function(msg) {
 *             console.log('modifyInfor then: ', msg.state === 'success', msg)
 *         })
 *         .catch(function(err) {
 *             console.log('modifyInfor catch: ', err)
 *         })
 *
 * }
 *
 *
 * //new
 * new WUserClient(opt)
 *     .then(async function(wo) {
 *         //console.log('funcs: ', wo)
 *
 *         //使用者之密碼明碼, 記得於前端需先偵測是否8位以上, 且需含英文大小寫與數字, 傳送至伺服器前需先編碼如用sha512, 減少被盜用後直接洩漏明碼
 *         let pw1 = 'ABCdef123456'
 *         let pw2 = '123456XYZabc'
 *         let pwEnc = pw1
 *         let pwEncNew = pw2
 *
 *         //user
 *         let user = {
 *             name: 'user',
 *             pwEnc: pwEnc,
 *             email: 'your@email', //change to user's email
 *         }
 *
 *         //token
 *         let token = null
 *
 *         //testMode
 *         let testMode = null
 *         // testMode = 'select'
 *         // testMode = 'signUp'
 *         // testMode = 'logIn and logOut'
 *         // testMode = 'changePW'
 *         testMode = 'resetPW'
 *         // testMode = 'modifyInfor'
 *
 *
 *         //select
 *         if (testMode === 'select') {
 *
 *             token = await testLogIn(wo, user)
 *
 *             let find = {}
 *             await testSelect(wo, { token, find })
 *
 *             await testLogOut(wo, token)
 *
 *         }
 *
 *
 *         //signUp
 *         if (testMode === 'signUp') {
 *             testSignUp(wo, user)
 *         }
 *
 *
 *         //logIn and logOut
 *         if (testMode === 'logIn and logOut') {
 *
 *             token = await testLogIn(wo, user) //get token
 *
 *             await testIsValidToken(wo, token) //true
 *
 *             await testRefreshTokenExp(wo, token) //true
 *
 *             await testLogIn(wo, user) //get the same token, for multiple login
 *
 *             await testLogOut(wo, token) //true
 *
 *             await testIsValidToken(wo, token) //false
 *
 *             await testRefreshTokenExp(wo, token) //false
 *
 *         }
 *
 *
 *         //changePW
 *         if (testMode === 'changePW') {
 *             await testChangePW(wo, { pwEncNew, ...user })
 *         }
 *
 *
 *         //resetPW
 *         if (testMode === 'resetPW') {
 *             await testResetPW(wo, { pwEncNew, ...user })
 *         }
 *
 *
 *         //modifyInfor
 *         if (testMode === 'modifyInfor') {
 *
 *             token = await testLogIn(wo, user) //get token
 *
 *             let userModify = {
 *                 id: 'abc',
 *                 //email: 'abc@def.com', //can change email
 *                 address: 'new city',
 *                 abc: 'def',
 *             }
 *
 *             await testModifyInfor(wo, { token, user: userModify })
 *
 *         }
 *
 *
 *     })
 *     .catch(function(err) {
 *         console.log('client nodejs: catch: ', err)
 *     })
 */
let WUserClient = HtClient


//使用@babel/plugin-transform-runtime時, 仍假定node_modules內已編譯成ES5, 各套件已自帶regeneratorRuntime
//若引用HtClient.mjs內含async與await時, 且專案套件內並無使用async與await, 將導致babel編譯出需regeneratorRuntime語法(針對HtClient.mjs), 但專案套件內實際並沒提供regeneratorRuntime的函式, 故會有regeneratorRuntime is not defined
//下方語法為加入無用async語法, 使專案套件內因babel編譯而提供regeneratorRuntime函式, 實際亦不需使用@babel/plugin-transform-runtime, 應該是提供@babel/runtime編譯偵測可自動加入regeneratorRuntime函式
// async function forRegeneratorRuntime() {}
// WUserClient.forRegeneratorRuntime = forRegeneratorRuntime


//目前已針對HtClient.mjs重新處理, 已不含async與await, 故此處程式碼亦不需加入無用async語法


export default WUserClient
