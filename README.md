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
> **Note:** `w-user-server` depends on `ws`, `events`, `w-converws` and `w-orm-mongodb`, `w-user-client` depends on `wolfy87-eventemitter`, `w-websocket-client` and `w-converws`.
```alias
npm i w-user
```
#### Example for w-user-server:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/srv.mjs)]
```alias
import WConverwsServer from 'w-user/dist/w-user-server.umd.js'

let opt = {
    mongoUrl: 'mongodb://username:password@127.0.0.1:27017',
    mongoDb: 'wuser',
    mongoCl: 'users',
    port: 8080,
    authenticate: async function(token) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(true)
            }, 1000)
        })
    },
}

//new
let wo = new WUserServer(opt)

wo.on('open', function() {
    console.log(`Server running at: ws://localhost:${opt.port}`)

    // //broadcast
    // let n = 0
    // setInterval(() => {
    //     n += 1
    //     wo.broadcast(`server: broadcast: hi(${n})`)
    // }, 1000)

    // //show eventNames
    // setInterval(() => {
    //     console.log('eventNames:')
    //     _.each(wo.eventNames(), function(v) {
    //         console.log('    ', v, wo.listenerCount(v))
    //     })
    //     console.log('')
    // }, 1000)

})
wo.on('error', function(err) {
    console.log(`Server[port:${opt.port}]: error`, err)
})
wo.on('clientChange', function(clients) {
    console.log(`Server[port:${opt.port}]: now clients: ${clients.length}`)
})
wo.on('execute', function(func, input, cb) {
    console.log(`Server[port:${opt.port}]: execute`, func, input)

    // if (func === 'add') {
    //     let r = input.p1 + input.p2
    //     cb(r)
    // }

})
wo.on('broadcast', function(data) {
    console.log(`Server[port:${opt.port}]: broadcast`, data)
})
wo.on('deliver', function(data) {
    console.log(`Server[port:${opt.port}]: deliver`, data)
})
```
#### Example for w-user-client:
> Consumer, **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/scl-c1p0-cm.mjs)]
> 
`Consumer` gets missions from `Producer`, and handles each queue.
```alias
import WConverwsClient from 'w-user/dist/w-user-client.umd.js'

let opt = {
    url: 'ws://localhost:8080',
    token: '*',
}

let missionTopic = 'parser|texts'

//new
let wo = new WUserClient(opt)

wo.on('open', function() {
    console.log('client nodejs[port:8080]: open')

    //subTopic
    wo.subTopic(missionTopic)

})
wo.on('openOnce', function() {
    console.log('client nodejs[port:8080]: openOnce')
})
wo.on('close', function() {
    console.log('client nodejs[port:8080]: close')
})
wo.on('error', function(err) {
    console.log('client nodejs[port:8080]: error', err)
})
wo.on('reconn', function() {
    console.log('client nodejs[port:8080]: reconn')
})
wo.on('broadcast', function(data) {
    console.log('client nodejs[port:8080]: broadcast', data)
})
wo.on('deliver', function(data) {
    //console.log('client nodejs[port:8080]: deliver', data)
})
wo.on('queueChange', function(topic, id, input, output, state) {
    //console.log('client nodejs[port:8080]: queueChange', topic, id, input, output, state)
    console.log('queueChange', input, output, state)

    //ready queue
    if (topic === missionTopic && state === 'ready') {

        setTimeout(function() {

            //output
            output = 'done(' + input.replace('#', '') + ')'

            //state
            state = 'finish'

            //modifyQueue
            wo.modifyQueue(topic, id, input, output, state)

        }, 1000)

    }

})
```
> Producer, **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/scl-c1p0-pd.mjs)]

`Producer` sends missions to `Consumer`, only for sends.
```alias
import WConverwsClient from 'w-user/dist/w-user-client.umd.js'

let opt = {
    url: 'ws://localhost:8080',
    token: '*',
}

let missionTopic = 'parser|texts'

//new
let wo = new WUserClient(opt)

wo.on('open', function() {
    console.log('client nodejs[port:8080]: open')

    // //delQueueByTopic
    // wo.delQueueByTopic(missionTopic)
    //     .then(function(msg) {
    //         console.log('delQueueByTopic', msg)
    //     })

    //subTopic
    wo.subTopic(missionTopic)

    function addMission(n) {

        //input
        let input = '#' + n

        //option
        let option = {}

        //pushQueue
        wo.pushQueue(missionTopic, input, option)

    }

    //mission
    let n = 0
    let t = setInterval(function() {
        n += 1
        addMission(n)
        if (n === 10) {
            clearInterval(t)
        }
    }, 1)

})
wo.on('openOnce', function() {
    console.log('client nodejs[port:8080]: openOnce')
})
wo.on('close', function() {
    console.log('client nodejs[port:8080]: close')
})
wo.on('error', function(err) {
    console.log('client nodejs[port:8080]: error', err)
})
wo.on('reconn', function() {
    console.log('client nodejs[port:8080]: reconn')
})
wo.on('broadcast', function(data) {
    console.log('client nodejs[port:8080]: broadcast', data)
})
wo.on('deliver', function(data) {
    //console.log('client nodejs[port:8080]: deliver', data)
})
wo.on('queueChange', function(topic, id, input, output, state) {
    //console.log('client nodejs[port:8080]: queueChange', topic, id, input, output, state)
})
```

#### In a complicated situation:
> Consumer, **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/scl-c2p1-cm.mjs)]

> Producer, **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/scl-c2p1-pd.mjs)]

1. `Producer` sends missions to `Consumer`.
2. `Consumer` handles each queue.
3. `Consumer` produces the other result(for combination e.g.), and saves it in a queue.
4. `Producer` gets results from the queue.
5. `Producer` removes users in database.

### In a browser(UMD module):
> **Note:** `w-user-client` does't depend on any package.

[Necessary] Add script for w-user-client.
```alias
<script src="https://cdn.jsdelivr.net/npm/w-user@1.0.0/dist/w-user-client.umd.js"></script>
```
#### Example for w-user-client:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-user/blob/master/web.html)]

`Producer` generates missions on open, and `Consumer` handles each queue on queueChange.
```alias
let opt = {
    url: 'ws://localhost:8080',
    token: '*',
}

let missionTopic = 'parser|texts'

//new
let WUserClient = window['w-user-client']
let wo = new WUserClient(opt)

wo.on('open', function() {
    console.log('client web: open')

    //subTopic
    wo.subTopic(missionTopic)

    function addMission(n) {

        //input
        let input = '#' + n

        //option
        let option = {}

        //pushQueue
        wo.pushQueue(missionTopic, input, option)

    }

    //mission
    let n = 0
    let t = setInterval(function() {
        n += 1
        addMission(n)
        if (n === 10) {
            clearInterval(t)
        }
    }, 50)

})
wo.on('openOnce', function() {
    console.log('client web: openOnce')
})
wo.on('close', function() {
    console.log('client web: close')
})
wo.on('error', function(err) {
    console.log('client web: error', err)
})
wo.on('reconn', function() {
    console.log('client web: reconn')
})
wo.on('broadcast', function(data) {
    console.log('client web: broadcast', data)
})
wo.on('deliver', function(data) {
    //console.log('client web: deliver', data)
})
wo.on('queueChange', function(topic, id, input, output, state) {
    //console.log('client web: queueChange', topic, id, input, output, state)
    console.log('client web: queueChange', input, output, state)
    
    //ready queue
    if (topic === missionTopic && state === 'ready') {

        setTimeout(function() {

            //output
            output = 'done(' + input.replace('#', '') + ')'

            //state
            state = 'finish'

            //modifyQueue
            wo.modifyQueue(topic, id, input, output, state)

        }, 1000)

    }

})
```