({
    doInit : function(component, event, helper) {
        
        var action 	= 	component.get("c.getApp");
        action.setParams({
            "mtdName"	: 	component.get("v.SObjectList")
        });
        
        action.setCallback(this, function(response){
            
            var state = response.getState();
            
            if (state === "SUCCESS")  { 
                var result=response.getReturnValue();
                console.log('SID result : '+result);
                component.set('v.AppName',result);
                var a 	= 	component.get("c.getParam");
                a.setParams({
                    "mtdName"	: 	component.get("v.SObjectList"),
                    "ObjId"		: 	component.get("v.recordId")
                });
                a.setCallback(this, function(response){
                    var state = response.getState();
                    
                    if (state === "SUCCESS")  { 
                        var result2=response.getReturnValue();
                        var jsConfigS = helper.getJsonConfig(component, result2);
                        component.set("v.parameters",jsConfigS);
                        console.log('SID PARAM: '+component.get("v.parameters"));
                    }
                    else console.log('ERROR');
                });
                $A.enqueueAction(a);
            }
        });
        $A.enqueueAction(action);
    },
    getJsonConfig : function(component, queryString) {
        var jsonConfig = "{";
        
        if (queryString.split("&") == -1) {
            // We are receiving only one parameter
            jsonConfig += "\"" + queryString.split("=")[0].replace("%20"," ") + "\":\"" + queryString.split("=")[1].replace("%20"," ") + "\",";
        }
        else
        {
            // We are receiving multiple parameters
            var receivedParams = queryString.split("&");
            for (var pp in receivedParams) {
                if (receivedParams[pp].split("=")[0].replace("%20"," ") == "dynamic") {
                    component.set("v.dynamic",receivedParams[pp].split("=")[1].replace("%20"," "));
                }
                jsonConfig += "\"" + receivedParams[pp].split("=")[0].replace("%20"," ") + "\":\"" + receivedParams[pp].split("=")[1].replace("%20"," ") + "\",";
            }
        }
        
        jsonConfig = jsonConfig.substring(0, jsonConfig.length - 1);
        jsonConfig += "}";
        return jsonConfig;
    }
})
