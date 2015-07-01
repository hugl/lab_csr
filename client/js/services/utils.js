/**
 * Created by qiucheng on 15/5/14.
 */
var Csr = require("../models/Csr");
var util = require("util");

module.exports = ["resources", "$rootScope", function (resources, $rootScope) {
    return {
        displayMessage: function (message, time) {
            $("#message-box").text(message).show();
            if (time == null)
                time = 1500;
            setTimeout(function () {
                $("#message-box").hide();
            }, time);
        },

        encodeHtml: function (str) {
            var s = "";
            if (str.length == 0) {
                return "";
            }
            s = str.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            return s;
        },

        formatDigitToDateStr: function (digit) {
            var now = new Date(digit * 1000 + 8 * 3600 * 1000);
            var year = 1900 + now.getYear();
            var month = this.addZero(now.getMonth() + 1);
            var day = this.addZero(now.getDate());

            var hour = this.addZero(now.getHours());
            var minute = this.addZero(now.getMinutes());
            var second = this.addZero(now.getSeconds());
            return util.format("%s-%s-%s  %s:%s:%s", year, month, day, hour, minute, second);
        },

        getLongMilliSeconds: function (greenwhichTime) {
            if (greenwhichTime == null || greenwhichTime.trim().length == 0)
                return;

            //2015-05-25 15:20:15
            var dayAndTime = greenwhichTime.split(" ");
            var dayPart = dayAndTime[0];
            var timePart = dayAndTime[1];

            var yearMonthDay = dayPart.split("-");
            var hourMinuteSecond = timePart.split(":");

            var year = yearMonthDay[0];
            var month = Number(yearMonthDay[1]) - 1;
            var day = yearMonthDay[2];

            var hour = hourMinuteSecond[0];
            var minute = hourMinuteSecond[1];
            var second = hourMinuteSecond[2];

            return new Date(new Date(year, month, day, hour, minute, second).getTime() + 8 * 3600 * 1000).getTime();
        },

        ripTimezoneInfoOff: function (timeStr) {
            var index = timeStr.indexOf("T");
            timeStr = timeStr.substring(0, index) + " " + timeStr.substring(index + 1);
            return timeStr.substring(0, timeStr.length - 1);
        },

        findCsrById: function (csrId) {
            for (var i in $rootScope.csrs) {
                if ($rootScope.csrs[i].csrId == csrId)
                    return $rootScope.csrs[i];
            }
            return null;
        },

        /**
         * try to init the csr if it does not exist
         * @param csrId
         * @returns {*}
         */
        tryInittingCsr: function (csrId) {
            var csr = this.findCsrById(csrId);
            if (csr == null) {
                csr = new Csr(csrId);
                $rootScope.csrs.push(csr);
                var csrJson = resources.getCsrById(csrId);
                if (csrJson.name.fullName)
                    csr.setCsrName(csrJson.name.fullName);
                else
                    csr.setCsrName(csrJson.username);
                csr.setAvatar(csrJson.extendedProperties.avatarUrl);
            }
            return csr;
        },

        addZero: function (number) {
            if (number < 10)
                return "0" + number;
            else
                return "" + number;
        },

        parseExternalExpressions: function (input) {
            var map = require("./expression-map");

            for (var i in map) {
                var key = i;
                var value = map[i];
                value = "[" + value + "]";
                input = input.replace(new RegExp(key, "g"), value);
            }

            return input;
        }

    }
}];
