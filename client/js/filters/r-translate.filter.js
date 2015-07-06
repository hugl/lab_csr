/**
 * Created by qiucheng on 15/4/18.
 */
module.exports = [
    "i18nFactory",
    function (i18nFactory) {
        return function (input) {
            return i18nFactory.get(input);
        }
    }
];