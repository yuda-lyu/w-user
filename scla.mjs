import WUserClient from './src/WUserClient.mjs'
//import WUserClient from './dist/w-user-client.umd.js'
import fs from 'fs'


//data
let j = fs.readFileSync('D:\\開源-JS-007-4-w-user\\data.txt', 'utf8')
let data = JSON.parse(j)


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
            email: data.testEmail, //change to user's email
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
                abc: 'def', //can not add abc
            }

            await testModifyInfor(wo, { token, user: userModify })

        }


    })
    .catch(function(err) {
        console.log('client nodejs: catch: ', err)
    })
