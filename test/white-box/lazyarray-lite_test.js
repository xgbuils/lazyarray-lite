var should    = require('should')
var LazyArray = require('../../lazyarray-lite')

function test_natural_list () {
    it('returns 5th element of array', function () {
        this.la.get(4).should.be.eql(4)
    })

    it('returns empty list', function() {
        this.la.slice(0, 0).should.be.eql([])
    })

    it('returns first ten numbers', function() {
        this.la.slice(0, 10).should.be.eql([0,1,2,3,4,5,6,7,8,9])
    })
}

function test_fibonacci_list () {
    it('returns 5th element of array', function () {
        this.la.get(4).should.be.eql(3)
    })

    it('returns empty list', function() {
        this.la.slice(0, 0).should.be.eql([])
    })

    it('returns first ten numbers', function() {
        this.la.slice(0, 10).should.be.eql([0,1,1,2,3,5,8,13,21,34])
    })
}

function test_quadratic_list () {
    it('returns 5th element of array', function () {
        this.la.get(4).should.be.eql(16)
    })

    it('returns empty list', function() {
        this.la.slice(0, 0).should.be.eql([])
    })

    it('returns first ten numbers', function() {
        this.la.slice(0, 10).should.be.eql([0,1,4,9,16,25,36,49,64,81])
    })
}

function test_primes_list () {
    it('returns 5th element of array', function () {
        this.la.get(4).should.be.eql(11)
    })

    it('returns empty list', function() {
        this.la.slice(0, 0).should.be.eql([])
    })

    it('returns first ten numbers', function() {
        this.la.slice(0, 10).should.be.eql([2,3,5,7,11,13,17,19,23,29])
    })
}

describe('using `init` and `next`', function () {
    describe('Natural list', function () {
        before(function () {
            this.la = new LazyArray({
                init: function () {
                    this.value = 0
                },
                next: function () {
                    return this.value++
                }
            })
        })

        it('should calculate and memoize the first five elements when 5-th element is required', function () {
            this.la.get(4)
            this.la._elems.should.be.eql([0, 1, 2, 3, 4])
        })
    
        it('should not calcute anything new element but the previous calculated elements are still memoized', function() {
            this.la.slice(0, 0)
            this.la._elems.should.be.eql([0, 1, 2, 3, 4])
        })
    
        it('should calculate and memoize the rest of elements that was not memoized', function() {
            this.la.slice(0, 10)
            this.la._elems.should.be.eql([0,1,2,3,4,5,6,7,8,9])
        })
    })

    describe('Quadratic list', function () {
        before(function () {
            this.la = new LazyArray({
                init: function () {
                    this.value = 0
                },
                next: function () {
                    var value = this.value * this.value
                    this.value++
                    return value
                }
            })
        })

        it('should calculate and memoize the first two elements when 2-th element is required', function () {
            this.la.get(1)
            this.la._elems.should.be.eql([0, 1])
        })
    
        it('should not calcute anything new element but the previous calculated elements are still memoized', function() {
            this.la.slice(4, 2)
            this.la._elems.should.be.eql([0, 1])
        })
    
        it('should calculate and memoize the rest of elements (2-9) that was not memoized', function() {
            this.la.slice(5, 10)
            this.la._elems.should.be.eql([0, 1, 4, 9, 16, 25, 36, 49, 64, 81])
        })
    })

    describe('Primes list', function () {
        before(function () {
            this.la = new LazyArray({
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
            })
        })

        it('should calculate and memoize from 1st to 8th element despite to get slice from 7th to 8th elements', function () {
            this.la.slice(6,8)
            this.la._elems.should.be.eql([2, 3, 5, 7, 11, 13, 17, 19])
        })
    
        it('should not calcute anything new element but the previous calculated elements are still memoized', function() {
            this.la.slice(1, 4)
            this.la._elems.should.be.eql([2, 3, 5, 7, 11, 13, 17, 19])
        })
    
        it('should calculate and memoize the rest of elements (from 9th to 10th) that was not memoized', function() {
            this.la.slice(5, 10)
            this.la._elems.should.be.eql([2, 3, 5, 7, 11, 13, 17, 19, 23, 29])
        })
    })
})

describe('using `next` width predecessor parameter', function () {
    describe('Natural list', function () {
        before(function () {
            this.la = new LazyArray({
                0: 0,
                next: function (n) {
                    return n + 1
                }
            })
        })

        it('should calculate and memoize the first four elements when 4th element is required', function () {
            this.la.get(3)
            this.la._elems.should.be.eql([0, 1, 2, 3])
        })
    
        it('should calcute and memoize the rest of elements (from 5th to 9th) that was not memoized', function() {
            this.la.slice(7, 9)
            this.la._elems.should.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8])
        })
    
        it('should not calcute a new element but 7th element is memoized', function() {
            this.la.get(6)
            this.la._elems.should.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8])
        })
    })

    describe('Fibonacci list', function () {
        before(function () {
            this.la = new LazyArray({
                0: 0,
                1: 1,
                next: function (a, b) {
                    return a + b
                }
            })
        })

        it('should not calculate a new element because 1st and 2nd element are memoized', function () {
            this.la.get(0)
            this.la._elems.should.be.eql([0, 1])
        })
    
        it('should calcute and memoize the rest of elements (from 3th to 4th) that was not memoized', function() {
            this.la.slice(0, 4)
            this.la._elems.should.be.eql([0, 1, 1, 2])
        })
    
        it('should calcute and memoize the rest of elements (from 5th to 7th) to get 7th element', function() {
            this.la.get(6)
            this.la._elems.should.be.eql([0, 1, 1, 2, 3, 5, 8])
        })
    })
})

describe('using `get`', function () {
    describe('Natural list', function () {
        before(function () {
            this.la = new LazyArray({
                get: function (i) {
                    return i
                }
            })
        })

        it('should calculate and memoize 6th element', function () {
            this.la.get(5)
            this.la._elems.should.be.eql({5: 5})
        })
    
        it('should calcute and memoize elements from 1st to 4th', function() {
            this.la.slice(0, 4)
            this.la._elems.should.be.eql({0: 0, 1: 1, 2: 2, 3: 3, 5: 5})
        })
    
        it('should calcute and memoize elements from 6th to 7th if are not memoized', function() {
            this.la.slice(5, 7)
            this.la._elems.should.be.eql({0: 0, 1: 1, 2: 2, 3: 3, 5: 5, 6: 6})
        })
    })

    describe('Quadratic list', function () {
        before(function () {
            this.la = new LazyArray({
                get: function (i) {
                	return i * i
                }
            })
        })

        it('should calculate and memoize 4th and 5th element', function () {
            this.la.slice(3, 5)
            this.la._elems.should.be.eql({3: 9, 4: 16})
        })
    
        it('should not calcute anything new element but the previous calculated elements are still memoized', function() {
            this.la.slice(4, 0)
            this.la._elems.should.be.eql({3: 9, 4: 16})
        })
    
        it('should calcute and memoize elements from 6th to 7th if are not memoized', function() {
            this.la.get(0)
            this.la._elems.should.be.eql({0: 0, 3: 9, 4: 16})
        })
    })
})


// extra functions
function isPrime (num) {
    var top = Math.floor(Math.sqrt(num))
    for (i = 2; i <= top; ++i) {
        if (num % i === 0) {
            break
        }
    }
    return i > top
}