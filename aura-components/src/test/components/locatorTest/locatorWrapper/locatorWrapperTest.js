/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
({
    browsers: ['DESKTOP'],
    setUp: function (component) {
        // hookUp to the metrics service to capture transactions
        var thisTest = this;
        thisTest.lastTransaction = undefined;
        $A.metricsService.onTransactionEnd(function (t) {
            if (t.id === 'aura:interaction') {
                thisTest.lastTransaction = t;
            }
        });
    },
    clickDivAndGetTransaction: function (classSelector) {
        var elem = $A.test.select(classSelector)[0];
        $A.test.clickOrTouch(elem);
        return this.lastTransaction;
    },
    validateLocatorResult: function (actualLocator, expectedTarget, expectedScope, expectedContext) {
        var actualTarget = actualLocator.target;
        var actualScope = actualLocator.scope;
        var actualContext = actualLocator.context;
        
        $A.test.assertEquals(expectedTarget, actualTarget, "Target Mismatch");
        $A.test.assertEquals(expectedScope, actualScope, "Scope Mismatch");
        
        if (!expectedContext) {
            $A.test.assertUndefined(actualContext);
        } else {
            $A.test.assertEquals(Object.keys(expectedContext).length, Object.keys(actualContext).length, "Actual locator context didn't have the same number of keys")
            for (var prop in expectedContext) {
                $A.test.assertEquals(expectedContext[prop], actualContext[prop], "Found mismatch for locator context property: " + prop);
            }
        }
    },
    doClickAndValidateTransaction: function (innerDivClass, outerDivClass, expectedContext) {
        var trx = this.clickDivAndGetTransaction($A.util.format(".{0} .{1}", outerDivClass, innerDivClass));
        this.validateLocatorResult(trx.context.locator, innerDivClass /*target aura id*/, outerDivClass /*scope aura id*/, expectedContext);
    },
    lastTransaction: {},
    testParentChildWithAuraIdOnly: {
        test: function () {
           var trx = this.clickDivAndGetTransaction(".locatorWrapperIdNoDef .innerWithAuraIdNoLocator");
           // no transactions are logged when the parent and child components don't have locator defs, but aura ids
           $A.test.assertUndefined(trx);
        }
    },
    testParentChildWithLocatorDefs: {
        test: function (cmp) {
            var innerCmp = cmp.find("locatorWrapperIdWithDef");
            this.doClickAndValidateTransaction("innerWithAuraIdLocator", "locatorWrapperIdWithDef", 
                {
                    "innerTextValue": innerCmp.get("v.innerTextValue") + innerCmp.get("v.addText"),
                    "parentKey": cmp.get("v.wrapperText")
                });
        }
    },
    testParentWithAuraIdOnlyChildWithLocatorDef: {
        test: function (cmp) {
            var innerCmp = cmp.find("locatorWrapperIdNoDef");
            var trx = this.clickDivAndGetTransaction(".locatorWrapperIdNoDef .innerWithAuraIdLocator");
            $A.test.assertUndefined(trx);
        }
    },
    testParentWithAuraIdLocatorChildWithAuraIdDataRefId: {
        test: function (cmp) {
            this.doClickAndValidateTransaction("innerWithAuraIdDataRef", "locatorWrapperIdWithDef", 
                    {
                        // keyRef is set from a data-keyRef attribute on the inner div
                        "keyRef": cmp.find("locatorWrapperIdWithDef").get("v.innerTextValue"),
                        "parentKey": cmp.get("v.wrapperText")
                    });
        }
    },
    testParentWithAuraIdLocatorAliasChildWithLocatorDefNoAlias: {
        test: function (cmp) {
            this.doClickAndValidateTransaction("innerWithAuraIdDataRef", "locatorWrapperIdWithDefAlias", 
                    {
                        // keyRef is set from a data-keyRef attribute on the inner div
                        "keyRef": cmp.find("locatorWrapperIdWithDefActual").get("v.innerTextValue")
                        // there is no parent key for this locator
                    });
        }
    },
    testParentWithAuraIdLocatorChildAnchorWithLocatorPrimitive: {
        test: function (cmp) {
            var trx = this.clickDivAndGetTransaction($A.util.format(".{0} .{1}", "locatorWrapperIdWithDef", "primitiveAnchor"));
            this.validateLocatorResult(trx.context.locator, "innerAnchorWrapper__primitiveAnchor" /*target*/, "locatorWrapperIdWithDef" /*scope*/, 
                    {
                        "parentKey": cmp.get("v.wrapperText"),
                        "primitiveKey": "primitiveValue"
                    });
        }
    },
    testParentWithAuraIdLocatorChildExtended: {
        test: function (cmp) {
            var innerCmp = cmp.find('locatorWrapperExtended');
            this.doClickAndValidateTransaction("innerWithAuraIdLocator", "locatorWrapperExtended", {
                    "innerTextValue": innerCmp.get("v.innerTextValue") + innerCmp.get("v.addText")
                });
        }
    },
    testParentWithAuraIdLocatorChildRadio: {
        test: function (cmp) {
            var trx = this.clickDivAndGetTransaction($A.util.format(".{0} .{1}", "locatorWrapperIdWithDef", "innerRadio"));
            this.validateLocatorResult(trx.context.locator, "innerRadio__radio" /*target*/, "locatorWrapperIdWithDef" /*scope*/, 
                    {
                        "parentKey": cmp.get("v.wrapperText")
                    });
        }
    }
    
})

