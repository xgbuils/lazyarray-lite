var should    = require('should')
var LazyArray = require('../../lazyarray-lite')

describe('test Natural lazy list', function () {
    describe('using `get` property in constructor', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                get: function (index) {
                    return index
                }
            })
        })
        it('.get(4) returns 5th element of lazy array', function () {
            this.la.get(4).should.be.eql(4)
        })
        it('.slice(0,0) returns empty array', function() {
            this.la.slice(0, 0).should.be.eql([])
        })
        it('.slice(0,10) returns first ten numbers', function() {
            this.la.slice(0, 10).should.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        })

        describe('and using `maxLength` top 5 to lazy array', function () {
            beforeEach(function () {
                this.la = new LazyArray({
                    get: function (index) {
                        return index
                    },
                    maxLength: 5
                })
            })
            it('.get(7) returns undefined', function () {
                should(this.la.get(7)).be.eql(undefined)
            })
            it('.slice(0,2) returns 1st and 2nd elements of lazy array', function() {
                this.la.slice(0, 2).should.be.eql([0, 1])
            })
            it('.slice(3,8) returns 1st and 2nd elements of lazy array', function() {
                this.la.slice(3, 8).should.be.eql([3, 4])
            })
        })
    })
    describe('using `next` property in constructor', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                0: 0,
                next: function (n) {
                    return n + 1
                }
            })
        })
        it('.get(-3) returns undefined', function () {
            should(this.la.get(-3)).be.eql(undefined)
        })
        it('.slice(3,6) returns from 4th to 6th elements of lazy array', function() {
            this.la.slice(3, 6).should.be.eql([3, 4, 5])
        })
        it('.slice(1,5) returns first ten numbers', function() {
            this.la.slice(1, 5).should.be.eql([1, 2, 3, 4])
        })
    })
    describe('using `next` and `init` properties in constructor', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                init: function () {
                    this.value = 0
                },
                next: function (index) {
                    return this.value++
                }
            })
        })
        it('.slice(2,3) returns array with 3rd element of lazy array', function() {
            this.la.slice(2, 3).should.be.eql([2])
        })
        it('.slice(1,5) returns from 2nd to 9th element of lazy array', function() {
            this.la.slice(1, 9).should.be.eql([1, 2, 3, 4, 5, 6, 7, 8])
        })
        it('.get(2) returns 3rd element', function () {
            should(this.la.get(2)).be.eql(2)
        })
    })
})

describe('test Quadratic lazy list', function () {
    describe('using `get` property in constructor', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                get: function (index) {
                    return index * index
                }
            })
        })
        it('.get(1000) returns 5th element of lazy array', function () {
            this.la.get(1000).should.be.eql(1000000)
        })
        it('.slice(20,21) returns empty array', function() {
            this.la.slice(20, 22).should.be.eql([400, 441])
        })
        it('.slice(22,21) returns first ten numbers', function() {
            this.la.slice(22, 21).should.be.eql([])
        })
    })

    describe('using `next` and `init` properties in constructor', function () {
        beforeEach(function () {
            this.la = new LazyArray({
                init: function () {
                    this.value = 0
                },
                next: function (index) {
                    var n = this.value++
                    return n * n
                }
            })
        })
        it('.slice(4,7) returns array with from 5th to 7th element of lazy array', function() {
            this.la.slice(4, 7).should.be.eql([16, 25, 36])
        })
        it('.slice(0,4) returns from 1st to 4th element of lazy array', function() {
            this.la.slice(0, 4).should.be.eql([0, 1, 4, 9])
        })
        it('.get(2) returns 3rd element', function () {
            this.la.get(2).should.be.eql(4)
        })

        describe('and using `maxLength` top 8 to lazy array', function () {
            beforeEach(function () {
                this.la = new LazyArray({
                    get: function (index) {
                        return index * index
                    },
                    maxLength: 8
                })
            })
            it('.get(7) returns 49', function () {
                should(this.la.get(7)).be.eql(49)
            })
            it('.get(8) returns undefined', function() {
                should(this.la.get(8)).be.eql(undefined)
            })
            it('.get(9) returns undefined', function() {
                should(this.la.get(9)).be.eql(undefined)
            })
        })
    })
})


describe('Primes list using `init` and `next`', function () {
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
    it('returns 5th element of array', function () {
        this.la.get(10).should.be.eql(31)
    })

    it('returns empty list', function() {
        this.la.slice(5, 12).should.be.eql([13,17,19,23,29,31,37])
    })

    it('returns first ten numbers', function() {
        this.la.slice(0, 10).should.be.eql([2,3,5,7,11,13,17,19,23,29])
    })

    describe('and using `maxLength` top 12 to lazy array', function () {
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
                },
                maxLength: 12
            })
        })
        it('.get(1000) returns undefined', function () {
            should(this.la.get(1000)).be.eql(undefined)
        })
        it('.slice(5, 10000) returns undefined', function() {
            this.la.slice(5, 10000).should.be.eql([13,17,19,23,29,31,37])
        })
        it('.get(9) returns undefined', function() {
            this.la.get(9).should.be.eql(29)
        })
    })
})


describe('test Fibonacci list using `next` width predecessor parameters', function () {
    beforeEach(function () {
        this.la = new LazyArray({
            0: 0,
            1: 1,
            next: function (a, b) {
                return a + b
            }
        })
    })
    
    it('.get(8) returns 9th element of array', function () {
        this.la.get(8).should.be.eql(21)
    })

    it('.slice(0, 2) returns first and 2nd elements of lazy array', function() {
        this.la.slice(0, 2).should.be.eql([0,1])
    })

    it('.slice(0, 10) returns from 1st to 10th elements of lazy array', function() {
        this.la.slice(0, 10).should.be.eql([0,1,1,2,3,5,8,13,21,34])
    })
})

describe('test finite list without explicit `maxLength` property', function () {
    beforeEach(function () {
        this.la = new LazyArray(function (i) {
            return i < 5 ? i : undefined
        })
    })

    it('.get(8) returns 9th element of array', function () {
        should(this.la.get(8)).be.eql(undefined)
    })

    it('.get(8) does .maxLength equal to 8', function() {
        this.la.get(8)
        this.la.maxLength.should.be.eql(8)
    })

    it('.slice(0, 2) returns first and 2nd elements of lazy array', function() {
        this.la.slice(0, 100).should.be.eql([0,1,2,3,4])
        this.la.maxLength.should.be.eql(5)
    })

    it('.slice(0, 2) does .maxLength equal to 5', function() {
        this.la.slice(0, 100)
        this.la.maxLength.should.be.eql(5)
    })

    it('.slice(0, 10) returns from 1st to 10th elements of lazy array', function() {
        this.la.slice(7, 100).should.be.eql([])
    })

    it('.slice(0, 10) does .maxLength equal to 7', function() {
        this.la.slice(7, 100)
        this.la.maxLength.should.be.eql(7)
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