/**
 * Created by qiucheng on 15/5/14.
 */
module.exports = [function () {
    return function (input) {
        //non greedy pattern
        var reg = /\[(.+?)\]/g;
        var matches = reg.test(input);
        if (matches) {
            return input.replace(reg, "<img class='img-icon' src='images/wechat/$1.gif'/>");
        } else {
            return input;
        }
    }
}];