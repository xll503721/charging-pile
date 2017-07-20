class My {
    myTest(tt, qq) {
        console.log('print my ' + tt + ' ' + qq)
        return ['11', '22']
    }

    myTest1(qq) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve([qq, '22'])
            }, 1000);
        })
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
                resolve([qq, '22'])
            }, 2000);
        })
    }

}

// let t = My.invoke.myTest.index(0).You.invoke.youTest.start()
// console.log(t)
require('./charging-pile.js')

// My.invoke.myTest('tt').contain([['22']]).connect
My.invoke.myTest('1234567890', 'qwe', '111').above(0).connect
You.invoke.youTest1.forEach.connect
My.invoke.myTest('1234567890', 'qwe', '111')





