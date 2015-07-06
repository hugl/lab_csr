/**
 * Created by qiucheng on 15/3/26.
 */
'use strict';
var util = require("util");
module.exports = ['$log', function ($log) {
    var chinese = require('../../bundles/zh_CN/key');
    var english = require('../../bundles/en_US/key');

    var map = {"zh_CN": chinese, "en_US": english};

    //locale=zh_CN or locale=en_US
    var localeReg = /locale=([a-zA-Z_]+)/;
    return {
        "get": function (key) {
            var cookie = document.cookie;
            var locale = 'zh_CN';
            if (cookie != null) {
                var matchArr = localeReg.exec(cookie);
                if (matchArr != null && matchArr.length > 0)
                    locale = matchArr[1];
            }
            return map[locale][key];
        },
        /**
         * format("Hello %s %d","world",2015) => Hello world 2015
         * @param key
         * @returns {*}
         */
        format:function(key){
            var crudeText = this.get(key);
            var func = util.format;
            var newArgument = new Array();

            //remove the first argument and set the rest as the strings or numbers used by the format string
            for(var i in arguments){
                if(i != 0)
                    newArgument.push(arguments[i]);
            }
            newArgument.unshift(crudeText);
            return func.apply(null,newArgument);
        }
    }
}];