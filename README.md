# lazyarray-lite

A small lazy array implementation.

Instead of generating a potentially huge array of objects (permutations, subsets, or whatever) only the required items are generated. Items that are not used by the program will never be generated and do not waste time and space in them

### Version
0.1.1

### Installation
```sh
$ npm install lazyarray-lite
```
and use:
``` javascript
var LazyArray = require('lazyarray-lite')
// ...
```

### API

#### #constructor (options)
Create a new lazy array data type.

If `options` parameter has `get` property function, this define the formula to get the `index-th` element of lazy array:
``` javascript
var la = new LazyArray({
    get: function (index) {
        return index * index
    }
}) // 0, 1, 4, 9, 16, 25...
```
Also is possible to define the same quadratic lazy list passing `options` as a function:
``` javascript
var la = new LazyArray(function (index) {
    return index * index
}) // 0, 1, 4, 9, 16, 25...
```
If `options` parameter has `next` property function and some integer properties, this function define the formula to get the successor value based on predecessors:
``` javascript
// odd list
la = new LazyArray({
    1: 1,
    next: function (n) {
        return n + 2
    }
}) // 1, 3, 5, 7, 9, 11...
```
Or Fibonacci list:
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
There are sequences that can not be expressed with a formula or based on the previous values (`next(predecessors...)`). Then it possible defining extra values on `init` property function and use and combine them with `next` function parameters:
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
Or primes list:
``` javascript
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

###### Advice:
It is advisable to use `get` property on constructor whenever possible because it has a higher performance. Using `next` property function, to get an array element before is necessary to calculate all their predecessors.

#### #get (index)
returns the specified element from a lazy array. 
###### Parameters
`index` is zero-based index to get extraction. 

** Caution: **
This method uses memoization. Modify the elements of the returned array can produce unexpected behaviours.

#### #slice(min, max)
returns a portion of a lazy array into a new array object.

###### Parameters
- `min` is zero-based index at which to begin extraction
- `max` is zero-based index at which to end extraction. `slice` extracts up to but not including end.

** Caution: **
This method uses memoization. Modify the elements of the returned array can produce unexpected behaviours.

### Development

Want to contribute? Great!

https://github.com/xgbuils/lazyarray-lite

### Todo's

...

### License
----

MIT
