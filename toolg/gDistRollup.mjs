import rollupFiles from '../tool/rollupFiles.mjs'
import getFiles from '../tool/getFiles.mjs'
import w from 'wsemi'


let fdSrc = './src'
let fdTar = './dist'
let fns = getFiles(fdSrc)
fns = fns.filter((v) => {
    return w.strleft(v, 1) === 'W'
})

rollupFiles({
    fns: fns,
    fdSrc,
    fdTar,
    nameDistType: 'kebabCase',
    globals: {
        '@hapi/hapi': '@hapi/hapi',
        'events': 'events',
        'mongodb': 'mongodb',
        'stream': 'stream',
        'dayjs': 'dayjs',
        'nodemailer': 'nodemailer',
    },
    external: [
        '@hapi/hapi',
        'events',
        'mongodb',
        'stream',
        'dayjs',
        'nodemailer',
    ],
})

