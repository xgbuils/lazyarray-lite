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
        beforeEach(function () {
            this.la = new LazyArray({
                init: function () {
                    this.value = 0
                },
                next: function () {
                    return this.value++
                }
            })
        })

        test_natural_list()
    })

    describe('Quadratic list', function () {
        beforeEach(function () {
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

        test_quadratic_list()
    })

    describe('Primes list', function () {
        beforeEach(function () {
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

        test_primes_list()
    })
})

describe('using `next` width predecessor parameter', function () {
    describe('Natural list', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                0: 0,
                next: function (n) {
                    return n + 1
                }
            })
        })

        test_natural_list()
    })

    describe('Fibonacci list', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                0: 0,
                1: 1,
                next: function (a, b) {
                    return a + b
                }
            })
        })

        test_fibonacci_list()
    })
})

describe('using `get`', function () {
    describe('Natural list', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                get: function (i) {
                    return i
                }
            })
        })

        test_natural_list()
    })

    describe('Quadratic list', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                get: function (i) {
                	return i * i
                }
            })
        })

        test_quadratic_list()
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