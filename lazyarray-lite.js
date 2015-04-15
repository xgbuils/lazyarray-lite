function LazyArray(options) {
    if (!(this instanceof LazyArray)) {}
    this._options = {}
    this._methods = {}

    if (typeof options === 'function') {
        this._methods.get = options
    } else if (options.get) {
        this._methods.get = options.get
    } else if (options.next){
        this._methods.next = options.next
    }

    this._elems = this._methods.get ? {} : []

    for (var key in options) {
        var value = options[key]
        if (/0|[1-9]\d*/.exec(key)) {
            this._elems[key]   = value
        } else if (key === 'init') {
            options.init.call(this._options)
        }
    }
}

function slice(obj, min, max) {
    var arr = []
    for (var i = min; i < max; ++i) {
        arr.push(obj[i])
    }
    return arr
}

LazyArray.prototype.get = function (index) {
    return this.slice(index, index + 1)[0]
}

LazyArray.prototype.slice = function (min, max) {
    var method = this._methods
    if (method.get) {
        for (var i = min; i < max; ++i) {
            if (!this._elems[i]) {
                this._elems[i] = method.get.call(null, i)
            }
        }
    } else {
        var nArgs  = method.next.length
        for (var i = this._elems.length; i < max; ++i) {
            var predecessors = this._elems.slice(i - nArgs).reverse()
            this._elems.push(method.next.apply(this._options, predecessors))
        }
    }

    return slice(this._elems, min, max)
}

module.exports = LazyArray