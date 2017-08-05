require('../charging-pile.js')
require("should")

const fetch = require('node-fetch')

class DB {
    GETTest() {
        return "DB.GETTest"
    }
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

class Network {

    GETTest() {
        return "Network.GETTest"
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

describe("测方法桩功能", function() {

    it("测试连续调用", function() {
        Network.invoke.GETTest.before((result)=> {
            result.should.eql("Network.GETTest");
        }).connect
        DB.invoke.GETTest().after((parma)=> {
            parma.should.eql("Network.GETTest");
        }).before((result=> {
            result.should.eql("DB.GETTest");
        }))
    })
    
    it("查询一个记录", function() {
        
    })

    it("更新一个记录", function() {
        
    })

    it("删除一个记录", function() {
        
    })
});