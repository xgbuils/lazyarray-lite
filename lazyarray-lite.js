function LazyArray(options) {
    if (!(this instanceof LazyArray)) {}
    var values  = this._values = {}
    var methods = this._methods = {}

    if (typeof options === 'function') {
        methods.get = options
    } else if (options.get) {
        methods.get = options.get
    } else if (options.next){
        methods.next = options.next
    }

    var elems = this._elems = methods.get ? {} : []

    for (var key in options) {
        var value = options[key]
        if (/0|[1-9]\d*/.exec(key)) {
            elems[key]   = value
        } else if (key === 'init') {
            options.init.call(values)
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
    var elems   = this._elems
    var methods = this._methods
    if (methods.get) {
        for (var i = min; i < max; ++i) {
            if (!elems[i]) {
                elems[i] = methods.get.call(null, i)
            }
        }
    } else {
        var nArgs  = methods.next.length
        for (var i = elems.length; i < max; ++i) {
            var predecessors = elems.slice(i - nArgs).reverse()
            elems.push(methods.next.apply(this._values, predecessors))
        }
    }

    return slice(elems, min, max)
}

module.exports = LazyArray