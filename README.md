# lazyarray-lite

Implementation a lazy array data type.

more description ...

### Version
0.1.0

### Installation

You need Gulp installed globally:

```sh
$ npm install lazyarray-lite
```

### API

##### #constructor (options)
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
If `options` parameter has `next` property function and some integer properties, this function define the formula to get the successor value in function of  predecessors:
``` javascript
la = new LazyArray({
    1: 1,
    next: function (n) {
        return n + 2
    }
}) // 1, 3, 5, 7, 9, 11...
```
Or fibonacci list:
``` javascript
la = new LazyArray({
    0: 0,
    1: 1,
    next: function (a, b) {
        return a + b
    }
}) // 0, 1, 1, 2, 3, 5, 8, 13...
```
There are sequences that can not be expressed with a formula or based on the previous values (`next(predecessors...)`). Then it possible defining extra values on `init` function and use and combine with parameters of `next` function:
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
        while (true) {
            var top = Math.floor(Math.sqrt(toCheck))
            for (i = 2; i <= top; ++i) {
                if (toCheck % i === 0) {
                    break
                }
            }
            if (i > top) {
                break
            }
            toCheck++
        }
        this.nextToCheck = toCheck + 1
        return toCheck
    }
}) // 2, 3, 5, 7, 11, 13, 17, 19...
```

##### #get (index: integer)
returns `(index+1)`-th element of list

** Caution: **
This method uses memoization. Modify the elements of the returned array can produce unexpected behaviours.

##### #slice(min, max)
returns a portion of a lazy array into a new array object.

** Caution: **
This method uses memoization. Modify the elements of the returned array can produce unexpected behaviours.

### Development

Want to contribute? Great!

...

### Todo's

...

### License
----

MIT

