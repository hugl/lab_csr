/**
 * Created by qiucheng on 15/4/19.
 */
/**
 * usage
 * [[someText | lengthLimit:30]]
 * @type {*[]}
 */
module.exports = [
    function () {
        return function (input, length) {
            if (input == null)
                return "";
            if (input.length < length)
                return input;
            else
                return input.substring(0, length - 2) + "..";
        }
    }
];