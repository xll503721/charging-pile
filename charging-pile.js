class Trouble {
    constructor() {
        this.conditions = []

        this.predicates = {
            a: null,
            an: null,
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

                    let containArray = (containObject) => {
                        containObject.forEach(item => {
                            if (this.__getClass(item) === 'Array') {
                                containArray(item)
                            }
                            else {
                                if (result.indexOf(item) !== -1) {
                                    return true
                                }

                                return false
                            }
                        })
                    }

                    if (this.__getClass(result) === 'Array') {
                        if (this.__getClass(object) === 'Array') {
                            return containArray(object)
                        }
                        else {
                            if (result.indexOf(object) !== -1) {
                                return true
                            }
                            return false
                        }
                    }

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
                return this
            },
            length: (count) => {
                this.conditions.push((result) => {
                    if (result.length !== undefined) {
                        if (result.length === count) {
                            return true
                        }
                        return false
                    }
                })
                return this
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
                return this
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
                return this
            }
        }


        this.loadChain()
    }

    static extend(prop) {
        Object.defineProperty(Trouble.prototype, prop, {
            set: function () {
            },
            get: function () {
                let actionCondition = this.actionConditions[prop]
                return actionCondition !== undefined ? actionCondition : this.collectConditions(prop)
            },
            configurable: true
        })
    }

    loadChain() {
        for (let predicate in this.predicates) {
            Trouble.extend(predicate)
        }

        for (let typeCondition in this.typeConditions) {
            Trouble.extend(typeCondition)
        }

        for (let actionCondition in this.actionConditions) {
            Trouble.extend(actionCondition)
        }
    }

    collectConditions(action) {
        let actionMethod = this.predicates[action] === undefined ? this.typeConditions[action] : this.predicates[action]
        if (actionMethod !== null && actionMethod !== undefined) {
            this.conditions.push(actionMethod)
        }
        return this
    }

    __getClass(object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    };
}

class Pile {
    constructor() {
        this.nextPile = null

        this.class = null
        this.method = null
        this.trouble = null
    }

    loadChain(ClazzOrMethod) {

        let object = new ClazzOrMethod()
        this.class = ClazzOrMethod
        var chain = {}

        Object.getOwnPropertyNames(Object.getPrototypeOf(object)).forEach(name => {
            if (!Pile.prototype.hasOwnProperty(name)) {
                Object.defineProperty(Pile.prototype, name, {
                    set: function () {
                    },
                    get: function () {
                        this.method = name
                        this.trouble = new Trouble()
                        return this.trouble
                    },
                    configurable: true
                })

            }
        })
        return this
    }

    charging(parameter) {

        let condition = (result) => {
            if (!(this.trouble.conditions.length > 0)) {
                this.nextPile.charging(result)
            }
            else {
                let shouldNext = null
                let isNext = true
                this.trouble.conditions.forEach(condition => {
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

        let method = (hasClazz) => {
            if (this.method) {
                let result = null
                if (hasClazz) {
                    let object = new this.class()
                    result = object[this.method](parameter)
                }
                else {
                    result = this.method()
                }

                if (!this.nextPile) {
                    return result
                }

                return condition(result)
            }
        }

        return method(this.class !== null)
    }
}

class Electric {

    constructor() {

    }

    static extend(prop) {
        Object.defineProperty(Electric.prototype, prop, {
            set: function () {
            },
            get: function () {
                return t.load(this)
            },
            configurable: true
        })
    }

    _E_invoke(clazzName) {
        let innerPile = null
        if (!this.rootPile) {
            this.rootPile = new Pile()
            innerPile = this.rootPile
        }
        else {
            let innerNextPile = new Pile()
            this.nextPile = innerNextPile
            this.rootPile.nextPile = innerNextPile
            innerPile = innerNextPile
        }

        return innerPile.loadChain(clazzName)
    }

    method(methodName) {
        if (this.nextPile) {
            this.nextPile.loadChain(methodName)
        }
        else {
            this.rootPile.loadChain(methodName)
        }
    }

    _E_start() {
        let ret = this.rootPile.charging()
        this.rootPile = null
        this.nextPile = null
        return ret
    }

    _E_connect(methodName) {
        this.method(methodName)
        return new Trouble()
    }

    _E_retrun(ClazzName) {
        pile.loadChain(ClazzName)
        return new Trouble()
    }
}

let electric = new Electric()
Trouble.prototype.start = () => {
    return electric._E_start()
}

Object.getOwnPropertyNames(Object.getPrototypeOf(electric)).forEach(method => {
    if (method.startsWith('_E_')) {
        Object.defineProperty(Function.prototype, method.substring(3), {
            set: function () {
            },
            get: function () {
                return electric[method](this)
            },
            configurable: true
        })
    }
})
