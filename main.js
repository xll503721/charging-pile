const fetch = require('node-fetch')

class My {
    myTest(tt, qq) {
        console.log('print my ' + tt + ' ' + qq)
        return {code: 0}
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

class You {
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

console.log(new You)

let tt = {
    params: null
}

// let t = My.invoke.myTest.index(0).You.invoke.youTest.start()
// console.log(t)
require('./charging-pile.js')

// My.invoke.myTest('tt').contain([['22']]).connect
My.invoke.myTest('1234567890', 'qwe', '111').before(()=> {
    tt.params = {id: '111', }
}).connect
You.invoke.youTest().forEach





