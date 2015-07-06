/**
 * Created by qiucheng on 15/5/24.
 */
var util = require("util");

module.exports = ["utils", function (utils) {
    return function (input) {
        if (input == null || input.trim().length == 0)
            return;
        var greenwhichTime = utils.ripTimezoneInfoOff(input);
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

        var now = new Date(new Date(year, month, day, hour, minute, second).getTime() + 8 * 3600 * 1000);
        year = 1900 + now.getYear();
        month = utils.addZero(now.getMonth() + 1);
        day = utils.addZero(now.getDate());

        hour = utils.addZero(now.getHours());
        minute = utils.addZero(now.getMinutes());
        second = utils.addZero(now.getSeconds());
        return util.format("%s-%s-%s  %s:%s:%s", year, month, day, hour, minute, second);
    }
}];