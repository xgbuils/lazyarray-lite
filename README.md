# lazyarray-lite

A light lazy array class implementation.

Instead of generating a potentially huge array of objects (permutations, subsets, or whatever) only the required items are generated. Items that are not used by the program will never be generated and do not waste time and space in them.

### Version
0.2.1

### Install
```sh
$ npm install lazyarray-lite
```

### Usage
``` javascript
var LazyArray = require('lazyarray-lite')

var la = new LazyArray(function (i) {
    return 2 * i
}) // 0, 2, 4, 6, 8...

la.slice(2, 5) // gets slice of infinite sequence: [4, 6, 8]
la.get(5) // gets 5-th element of infinite sequence: 10
```

### API

- [constructor(options)](#constructor-options)
  - [options](#options)
  - [options.get(position)](#optionsgetposition)
  - [options.next(predecessors...)](#optionsnextpredecessors)
  - [options.{index integer}](#optionsinteger-index)
  - [options.init()](#optionsinit)
  - [options.maxLength](#optionsmaxlength)
- [.get(index)](#get-index)
- [.slice(begin, end)](#slicebegin-end)
- [.maxLength](#maxlength)


#### constructor (options)
It creates a new lazy array data type.
##### options
- Type: Object

  Options passed to lazy array constructor

- Type: Function

  Syntactic sugar for `options.get`

  Example:
  ``` javascript
  var la = new LazyArray(function (n) {
      return n * n
  }) // 0, 1, 4, 9, 16, 25...

  ```
  For more information see `option.get`.

##### options.get(n)
Type: Function

Callback that defines the formula to get `n`-th element of instance of lazy array.

Example:
``` javascript
var la = new LazyArray({
    get: function (n) {
        return n * n
    }
}) // 0, 1, 4, 9, 16, 25...
```

The callback options.get must return element of lazy array or `undefined`. If `options.get(n)` returns `undefined` and instance of lazy array computes `n`-th element (0-index based), then it will assume that the whole elements in positions greater than `n` returns undefined. Furthermore, intance of lazy array is considered finite and its maximum length is `n`.

Example:
``` javascript
var la = new LazyArray({
    get: function (n) {
        if (n === 4) {
            return undefined
        } else {
            return n * n
        }
    }
}) // 0, 1, 4, 9. STOP
la.get(3) // gets 9
la.get(4) // gets undefined and assumes that there are not more greater elements in lazy array. 
la.get(5) // gets undefined
la.maxLength // is 4
```

##### options.next(predecessors...)
Type: Function

When it is not possible to define element of lazy array based on its position, `options.next` define the formula to get the value based on its predecessors.

`options.next` must be used together with some `integer index` option that defines the firsts values of the lazy array.

Example:
``` javascript
// odd list
la = new LazyArray({
    0: 1, // integer index
    next: function (n) {
        return n + 2
    }
}) // 1, 3, 5, 7, 9, 11...
```
or
``` javascript
// Fibonacci list
la = new LazyArray({
    0: 0,
    1: 1,
    next: function (a, b) {
        return a + b
    }
}) // 0, 1, 1, 2, 3, 5, 8, 13...
```

It returns element of lazy array or `undefined`. In the same way that `options.get`, if `options.next` returns `undefined`, intance of lazy array assumes that there are not more elements and lazy array is finite.

##### options.{integer index}
Type: !== undefined

Integer indexs (0, 1, 2, 10, 234, etc) correspond to elements of lazy array that are computed before to get for first time.

##### options.init
Type: Function

There are sequences that can not be expressed with a formula or based on its predecessors. It possible to use extra values in `options.next` with `this` context and initialize this values in `options.init`.

Example:
``` javascript
// triangular sequence
la = new LazyArray({
    0: 0,
    init: function () {
        this.value = 0
    },
    next: function (n) {
        this.value++
        return n + this.value
    }
}) // 0, 1, 3, 6, 10, 15, 21...
```
or
``` javascript
// Primes list
la = new LazyArray({
    init: function () {
        this.nextToCheck = 2
    },
    next: function () {
        var toCheck = this.nextToCheck
        while (!isPrime(toCheck)) {
            toCheck++
        }
        this.nextToCheck = toCheck + 1
        return toCheck
    }
}) // 2, 3, 5, 7, 11, 13, 17, 19...

function isPrime (num) {
    var top = Math.floor(Math.sqrt(num))
    for (i = 2; i <= top; ++i) {
        if (num % i === 0) {
            break
        }
    }
    return i > top
}
```

##### options.maxLength
Type: Integer | undefined

It defines the maximum length of lazy array. If `options.maxLength` is `undefined` or not defined, the lazy array created is infinity in potencial.

Example:
``` javascript
var la = new LazyArray({
    get: function (position) {
        return position * position
    },
    maxLength: 5
}) // 0, 1, 4, 9, 16. (STOP)

la.get(2) // 4
la.get(6) // undefined
```

###### Advice:
It is advisable to use `options.get` on constructor whenever possible because it has a higher performance with `.get` and `.slice` methods. Using `options.next` property function, these methods need to compute all predecessors in the first call.

#### .get (n)
returns the specified element from a lazy array.
##### index
Type: Integer

`n` is zero-based index to get element of lazy array. 

**Caution:**
This method uses memoization. It is advisable not to change element that is returned by `.get` method because might occur unexpected behaviours.

Example:
``` javascript
var la = new LazyArray({
    get: function (n) {
        return { number: n }
    },
    maxLength: 5
}) // {number: 0}, {number: 1}, {number: 2}, {number: 3}, ...

var item = la.get(2) // {number: 2}
item.number = 'modified'
la.get(2) // Now it returns {number: 'modified'}
```

#### .slice(begin, end)
returns a portion of a lazy array into a new array object.

The method behaves in the same way as [Array.prototype.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

**Caution:**
This method uses memoization. In the same way as `.get` method, it is advisable not to change element that is returned by `.next` method because might occur unexpected behaviours.

#### .maxLength
Type: Integer | +Infinity

gets max length of lazy array.

### Development

Want to contribute? Great!

https://github.com/xgbuils/lazyarray-lite

### Todo's

...

### License
----

MIT
