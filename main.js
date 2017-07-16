class My {
    myTest(tt) {
        console.log('print my ' + tt)
        return ['11', '22']
    }

    myTest1(qq) {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
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

}

// let t = My.invoke.myTest.index(0).You.invoke.youTest.start()
// console.log(t)
require('./charging-pile.js')

// My.invoke.myTest('tt').contain([['22']]).connect
let t = My.invoke.myTest('1234567890').above(10).connect
console.log(You.invoke.youTest(11))




