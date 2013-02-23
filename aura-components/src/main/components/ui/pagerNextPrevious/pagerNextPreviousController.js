/*
 * Copyright (C) 2012 salesforce.com, inc.
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
    firstPage:function (component, domEvent, helper) {
        if(domEvent.currentTarget.disabled)return;
        var targetPage=1;
        helper.changePage(component,targetPage,domEvent);
    },
    lastPage:function (component, domEvent, helper) {
        if(domEvent.currentTarget.disabled)return;
        var targetPage = component.get("v.pageCount");
        helper.changePage(component, targetPage, domEvent);
    },
    nextPage:function (component, domEvent, helper) {
        if(domEvent.currentTarget.disabled)return;
        var targetPage = Math.min(parseInt(component.get("v.currentPage"),10)+1, component.get("v.pageCount"));
        helper.changePage(component, targetPage, domEvent);
    },
    previousPage:function (component, domEvent, helper) {
        if(domEvent.currentTarget.disabled)return;
        var targetPage = Math.max(parseInt(component.get("v.currentPage"),10)-1, 1);
        helper.changePage(component, targetPage, domEvent);
    }
})
