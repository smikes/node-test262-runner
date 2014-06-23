/// Copyright (c) 2012 Ecma International.  All rights reserved. 
/// Ecma International makes this code available under the terms and conditions set
/// forth on http://hg.ecmascript.org/tests/test262/raw-file/tip/LICENSE (the 
/// "Use Terms").   Any redistribution of this code must retain the above 
/// copyright and this notice and otherwise comply with the Use Terms.
/**
 * @path ch15/15.4/15.4.4/15.4.4.21/15.4.4.21-8-b-iii-1-27.js
 * @description Array.prototype.reduce - This object is the Arguments object which implements its own property get method (number of arguments is greater than number of parameters)
 */


function testcase() {

        var testResult = false;
        function callbackfn(prevVal, curVal, idx, obj) {
            if (idx === 3) {
                testResult = (prevVal === 2);
            }
        }

        var func = function (a, b, c) {
            delete arguments[0];
            delete arguments[1];
            Array.prototype.reduce.call(arguments, callbackfn);
        };

        func(0, 1, 2, 3);
        return testResult;
    }
runTestCase(testcase);
