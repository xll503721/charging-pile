// require('./power-strip.js')

class My {
    myTest() {
        console.log('print my')
        return ['tt1']
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

const connect = require('./charging-pile.js')

My.invoke.myTest.contain('tt').connect

console.log(You.invoke.youTest.start())


