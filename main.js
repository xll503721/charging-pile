require('./charging-pile.js')
const fetch = require('node-fetch')

class DB {
    GETTest() {
        console.log ("DB.GETTest")
    }
    myTest(tt, qq) {
        console.log('print my ' + tt + ' ' + qq)
        return { code: 0 }
    }

    myTest1(qq) {
        let p = new Promise(function (resolve, reject) {
            fetch('http://127.0.0.1:3000/user/signin/1234567890').then(response => {
                resolve(response.text())
            }).catch(error => {
                reject(error)
            })
        }).catch(error => console.log(error))
        return p
    }
}

class Network {

    GETTest(text) {
        console.log (text)
        console.log ("Network.GETTest")
        return {rr: 12}
    }
    youTest(tt) {
        console.log('you ' + tt)
        return 'yy'
    }

    youTest1(qq) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                console.log('youTest1')
                resolve([qq, '22'])
            }, 2000);
        })
    }

    toString() {
        console.log('hahahah')
    }

}

DB.invoke.myTest1.connect
Network.invoke.GETTest()






