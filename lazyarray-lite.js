function LazyArray(options) {
    var values  = this._values = {}
    var methods = this._methods = {}
    this.maxLength = Infinity

    if (typeof options === 'function') {
        methods.get = options
    } else {
        this.maxLength = typeof options.maxLength === 'number' ? options.maxLength : Infinity

        if (options.get) {
            methods.get = options.get
        } else if (options.next){
            methods.next = options.next
        }
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

LazyArray.prototype.get = function (index) {
    return this.slice(index, index + 1)[0]
}

LazyArray.prototype.slice = function (min, max) {
    var elems   = this._elems
    var methods = this._methods
    if (methods.get) {
        pushEach.call(this, min, max, function (index) {
            return methods.get.call(null, index)
        })
    } else {
        var nArgs  = methods.next.length
        pushEach.call(this, elems.length, max, function (index) {
            var predecessors = this._elems.slice(index - nArgs).reverse()
            return methods.next.apply(this._values, predecessors)
        })
    }

    return slice(elems, min, max)
}

module.exports = LazyArray

function slice(obj, min, max) {
    var arr = []
    for (var i = min; i < max; ++i) {
        var item = obj[i]
        if (item === undefined) {
            break
        } else {
            arr.push(item)
        }
    }
    return arr
}

function pushEach(min, max, cb) {
    var elems = this._elems
    var len   = this.maxLength
    if (len !== undefined && len < max)
        max = len

    for (var i = min; i < max; ++i) {
        if (elems[i] === undefined) {
            var item = cb.call(this, i)
            if (item === undefined) {
                this.maxLength = i
                break
            } else {
                elems[i] = item
            }
        }
    }
}