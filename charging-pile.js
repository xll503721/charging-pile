var globalPile = null

class Trouble {
    constructor() {
        this.conditions = []


    }

    extend(obj, prop, retGet, retSet) {
        let inner = this
        Object.defineProperty(obj, prop, {
            set: function () {
                return retSet
            },
            get: function () {
                let actionCondition = inner.actionConditions[prop]
                actionCondition !== undefined ? actionCondition : inner.collectConditions(prop)
                return retGet
            },
            configurable: true
        })
    }

    setup(action) {
        let actionMethod = this.findCondition(action)

    }


    // setup(obj, prop, retGet, retSet) {
    //     for (let predicate in this.predicates) {
    //         this.extend(obj, predicate, obj)
    //     }

    //     for (let typeCondition in this.typeConditions) {
    //         this.extend(obj, typeCondition, obj)
    //     }

    //     for (let actionCondition in this.actionConditions) {
    //         this.extend(obj, actionCondition, obj)
    //     }
    // }

    findCondition(action) {
        let actionMethod = this.predicates[action]
        if (actionMethod === undefined) {
            actionMethod = this.typeConditions[action]
        }
        if (actionMethod === undefined) {
            actionMethod = this.actionConditions[action]
        }

        return actionMethod
    }

    collectConditions(action) {
        let actionMethod = this.predicates[action]
        if (actionMethod === undefined) {
            actionMethod = this.typeConditions[action]
        }
        if (actionMethod === undefined) {
            actionMethod = this.actionConditions[action]
        }

        if (actionMethod !== null && actionMethod !== undefined) {
            this.conditions.push(actionMethod)
        }
    }

    __getClass(object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    };
}

class Pile {
    constructor() {
        this.nextPile = null

        this.class = null
        this.method = {
            name: null,
            params: [],
            return: null,
            isForEach: false,
            isSkip: false,
        }
        this.chain = {}
        this.conditions = []
        this.selfConditions = {
            flagConditions: []
        }
    }

    __getClass(object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    };

    setupClassInvokeMethod(Clazz) {

        let object = new Clazz()
        this.class = Clazz
        let sthis = this

        Object.getOwnPropertyNames(Object.getPrototypeOf(object)).forEach(name => {
            if (this.chain[name] === undefined && !(this.chain[name] === Function) && name !== 'constructor') {

                let registerMethod = (...args) => {
                    this.method.name = name
                    this.method.params = args

                    setImmediate(() => {
                        if (globalPile !== null) {
                            let ret = globalPile.charging()
                            globalPile = null
                        }
                    })

                    return registerMethod
                }

                //注册 to be
                this.registerTobe(registerMethod)

                //注册class 方法
                Object.defineProperty(this.chain, name, {
                    set: function () {
                    },
                    get: function () {
                        sthis.method.name = name
                        return registerMethod
                    },
                    configurable: true
                })

                Object.defineProperty(registerMethod, 'connect', {
                    set: function () {
                    },
                    get: function () {
                        sthis.method.name = name
                        return registerMethod
                    },
                    configurable: true
                })
            }
        })

        return this.chain
    }

    registerTobe(registerMethod) {
        this.predicates = {
            a: () => true,
            an: () => true,
            is: (result) => true,
            not: (result) => false,
        }

        this.typeConditions = {
            number: (result) => this.__getClass(result) === 'Number',
            string: (result) => this.__getClass(result) === 'String',
            date: (result) => this.__getClass(result) === 'Date',
            array: (result) => this.__getClass(result) === 'Array',
            undefined: (result) => result === undefined,
            null: (result) => result === null,
        }

        this.flagConditions = {
            forEach: '',
            forEachParam: ''
        }

        this.selfActionConditions = {
            before: (beforeFunc) => {
                this.selfConditions.before = beforeFunc
                return registerMethod
            },
            after: (afterFunc) => {
                this.selfConditions.after = afterFunc
                return registerMethod
            },
        }

        this.actionConditions = {
            contain: (object) => {
                this.conditions.push((result) => {

                    if (this.__getClass(result) === 'Array') {
                        if (result.indexOf(object) !== -1) {
                            return true
                        }

                        return false
                    }
                    else if (this.__getClass(result) === 'Object') {
                        for (let prop in object) {
                            if (result[prop] === object[prop]) {
                                return true
                            }
                        }
                        return false
                    }
                })
                return registerMethod
            },
            lengthEqual: (count) => {
                this.conditions.push((result) => {
                    if (result.length !== undefined) {
                        if (result.length === count) {
                            return true
                        }
                        return false
                    }
                })
                return registerMethod
            },
            above: (count) => {
                this.conditions.push((result) => {
                    if (result.length !== undefined) {
                        if (result.length > count) {
                            return true
                        }
                        return false
                    }
                })
                return registerMethod
            },
            below: (count) => {
                this.conditions.push((result) => {
                    if (result.length !== undefined) {
                        if (result.length <= count) {
                            return true
                        }
                        return false
                    }
                })
                return registerMethod
            }
        }

        let sthis = this

        for (let prop in this.predicates) {
            Object.defineProperty(registerMethod, prop, {
                set: function () {
                },
                get: function () {
                    sthis.conditions.push(this.predicates[prop])
                    return registerMethod
                },
                configurable: true
            })
        }
        for (let prop in this.typeConditions) {
            Object.defineProperty(registerMethod, prop, {
                set: function () {
                },
                get: function () {
                    sthis.conditions.push(this.typeConditions[prop])
                    return registerMethod
                },
                configurable: true
            })
        }
        for (let prop in this.flagConditions) {
            Object.defineProperty(registerMethod, prop, {
                set: function () {
                },
                get: function () {
                    sthis.selfConditions.flagConditions.push(prop)
                    return registerMethod
                },
                configurable: true
            })
        }
        for (let prop in this.actionConditions) {
            registerMethod[prop] = this.actionConditions[prop]
        }
        for (let prop in this.selfActionConditions) {
            registerMethod[prop] = this.selfActionConditions[prop]
        }
    }

    charging(parameter) {

        let condition = (result) => {
            if (!(this.conditions.length > 0)) {
                return this.nextPile.charging(result)
            }
            else {
                let shouldNext = null
                let isNext = true
                this.conditions.forEach(condition => {
                    let retFlgs = condition(result)
                    if (shouldNext === null) {
                        shouldNext = retFlgs
                    } else {
                        isNext = retFlgs
                    }
                })
                if (shouldNext === isNext) {
                    return this.nextPile.charging(result)
                }
                return result
            }
        }

        let method = async () => {
            if (this.method && this.class) {
                let object = new this.class()

                let before = this.selfConditions.before
                let after = this.selfConditions.after
                let params = [parameter]
                let loop = 1
                if (this.method.params.length > 0) {
                    params = this.method.params
                    if (this.method.params[0].params !== undefined) {
                        params = [this.method.params[0].params]
                    }
                }

                if (this.__getClass(params) === 'Array' && this.selfConditions.flagConditions.indexOf('forEach') !== -1) {
                    loop = params.length
                }

                for (let i = 0; i < loop; i++) {
                    let param = params
                    if (loop > 1) {
                        param = [params[i]]
                    }
                    before && before(param, i)
                    this.method.result = await object[this.method.name].apply(object, param)
                    after && after(this.method.result, i)
                }

                if (!this.nextPile) {
                    return this.method.result
                }

                return condition(this.method.result)
            }
        }

        return method()
    }
}

Object.defineProperty(Function.prototype, 'invoke', {
    set: function () {
    },
    get: function () {
        let retPile = globalPile
        if (globalPile === null) {
            globalPile = new Pile()
            retPile = globalPile
        }
        else {
            while (retPile.nextPile !== null) {
                retPile = retPile.nextPile
            }

            let pile = new Pile()
            retPile.nextPile = pile

            retPile = pile
        }
        return retPile.setupClassInvokeMethod(this)
    },
    configurable: true
})
