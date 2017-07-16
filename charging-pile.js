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
            params: null,
            return: null,
            isForEach: false,
            isSkip: false,
        }
        this.chain = {}
        this.conditions = []

    }

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

                Object.defineProperty(registerMethod, 'forEachConnect', {
                    set: function () {
                    },
                    get: function () {
                        sthis.method.isForEach = true
                        return registerMethod
                    },
                    configurable: true
                })

                Object.defineProperty(registerMethod, 'skipConnect', {
                    set: function () {
                    },
                    get: function () {
                        sthis.method.isForEach = true
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
                        if (result[object] !== undefined) {
                            return true
                        }
                        return false
                    }
                })
                return registerMethod
            },
            // length: (count) => {
            //     this.conditions.push((result) => {
            //         if (result.length !== undefined) {
            //             if (result.length === count) {
            //                 return true
            //             }
            //             return false
            //         }
            //     })
            //     return registerMethod
            // },
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
            below: () => {
                this.conditions.push((result) => {
                    if (result.length !== undefined) {
                        if (result.length < count) {
                            return true
                        }
                        return false
                    }
                })
                return registerMethod
            }
        }

        for (let prop in this.predicates) {
            Object.defineProperty(registerMethod, prop, {
                set: function () {
                },
                get: function () {
                    this.conditions.push(this.predicates[prop])
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
                    this.conditions.push(this.typeConditions[prop])
                    return registerMethod
                },
                configurable: true
            })
        }
        for (let prop in this.actionConditions) {
            registerMethod[prop] = this.actionConditions[prop]
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
                let result = null
                let object = new this.class()

                if (parameter === undefined) {
                    let evalString = 'object[this.method.name](' + this.method.params.join(',') + ')'
                    this.method.result = await eval(evalString)
                }
                else {
                    this.method.result = await object[this.method.name](parameter)
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
