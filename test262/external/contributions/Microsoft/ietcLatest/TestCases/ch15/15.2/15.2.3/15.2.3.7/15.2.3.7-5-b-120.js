/// Copyright (c) 2012 Ecma International.  All rights reserved. 
/// Ecma International makes this code available under the terms and conditions set
/// forth on http://hg.ecmascript.org/tests/test262/raw-file/tip/LICENSE (the 
/// "Use Terms").   Any redistribution of this code must retain the above 
/// copyright and this notice and otherwise comply with the Use Terms.
/**
 * @path ch15/15.2/15.2.3/15.2.3.7/15.2.3.7-5-b-120.js
 * @description Object.defineProperties - 'value' property of 'descObj' is own accessor property that overrides an inherited data property (8.10.5 step 5.a)
 */


function testcase() {
        var obj = {}; 

        var proto = {
            value: "inheritedDataProperty"
        };

        var Con = function () { };
        Con.prototype = proto;

        var descObj = new Con();

        Object.defineProperty(descObj, "value", {
            get: function () {
                return "ownAccessorProperty";
            }
        });


        Object.defineProperties(obj, {
            property: descObj
        });

        return obj.property === "ownAccessorProperty";

    }
runTestCase(testcase);
