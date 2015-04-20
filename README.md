# lazyarray-lite

A small lazy array class implementation.

Instead of generating a potentially huge array of objects (permutations, subsets, or whatever) only the required items are generated. Items that are not used by the program will never be generated and do not waste time and space in them

### Version
0.2.0

### Installation
```sh
$ npm install lazyarray-lite
```

### Example
``` javascript
var LazyArray = require('lazyarray-lite')

var la = new LazyArray(function (i) {
    return 2 * i
}) // 0, 2, 4, 6, 8...

la.slice(2, 5) // [2, 6, 8]
la.get(5) // 10
```

### API

- [constructor(options)](#constructor-options)
  - [options](#options)
  - [options.get(index)](#optionsgetposition)
  - [options.next(predecessors...)](#optionsnextpredecessors)
  - [options.{index integer}](#optionsinteger-index)
  - [options.init()](#optionsinit)
  - [options.length](#optionslength)
- [.get(index)](#get-index)
- [.slice(begin, end)](#slicebegin-end)
- [.maxLength](#maxlength)


#### constructor (options)
Create a new lazy array data type.
##### options
- Type: Object

  Options to pass to lazy array constructor


- Type: Function

  Syntactic sugar for `options.get`.

  Example:
  ``` javascript
  var la = new LazyArray(function (index) {
      return index * index
  }) // 0, 1, 4, 9, 16, 25...

  ```
  For more information see `option.get`.

##### options.get(position)
Type: Function 


Callback that define the formula to get element of lazy array based on its position.

Example:
``` javascript
var la = new LazyArray({
    get: function (index) {
        return index * index
    }
}) // 0, 1, 4, 9, 16, 25...
```

Returns element lazy array type or undefined. If `options.get(index)` returns undefined it is assumed that there are not more elements and lazy array is a finite array and max length is `index`.

##### options.next(predecessors...)
Type: Function

When is not possible to define element of lazy array based on its position, `options.next` define the formula to get the value based on its predecessors.

`options.next` must be used with some integer index option that defines the first values of the lazy array.

Example:
``` javascript
// odd list
la = new LazyArray({
    0: 1,
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

Returns element lazy array type or undefined. If `options.next` returns undefined it is assumed that there are not more elements and lazy array is a finite array.

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
// Fibonacci list
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
Type: Integer?

It defines the maximum length of lazy array. If `options.maxLength` is `undefined` or not defined, the lazy array created is infinity in potencial.

Example:


###### Advice:
It is advisable to use `options.get` on constructor whenever possible because it has a higher performance. Using `options.next` property function, to get an array element before is necessary to compute all its predecessors.

#### .get (index)
returns the specified element from a lazy array.
##### index
Type: Integer

zero-based index to get element of lazy array. 

**Caution:**
This method uses memoization. Modify returned element of lazy array can produce unexpected behaviours.

#### .slice(begin, end)
returns a portion of a lazy array into a new array object.

##### begin 
Type: Integer

zero-based index at which to begin extraction
##### max
Type: Integer

zero-based index at which to end extraction.

**Caution:**
This method uses memoization. Modify returned elements of lazy array can produce unexpected behaviours.

#### .maxLength
Type: Integer | +infinity

gets max length of lazy array.

### Development

Want to contribute? Great!

https://github.com/xgbuils/lazyarray-lite

### Todo's

...

### License
----

MIT
