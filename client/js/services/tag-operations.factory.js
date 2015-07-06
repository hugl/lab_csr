/**
 * Created by qiucheng on 15/4/10.
 */

var util = require("util");
module.exports = [
    "$log",
    "TagModel",
    "i18nFactory",
    "TagResource",
    "$q",
    function ($log, TagModel, i18nFactory, TagResource, $q) {


        return {
            /**
             * @param type User Or Product
             * @param start
             * @param count
             * @param isLoadUserCount loads the user information associated with this tag or not
             * @returns {$promise|*}
             */
            getTags: function (type, start, count, loadRelatedUser, tagName) {
                if (start == null && count == null) {
                    return TagResource.Tag.query({type: type, loadRelatedUser: loadRelatedUser}).$promise;
                }
                var start = start * count;
                var promise = TagResource.Tag.query({
                    start: start,
                    count: count,
                    type: type,
                    loadRelatedUser: loadRelatedUser,
                    tagName: tagName
                }).$promise;
                return promise;
            },

            createTag: function (tag) {
                var promise = TagResource.Tag.save(tag).$promise;
                return promise;
            },
            total: function (params) {
                var promise = TagResource.Total.get(params).$promise;
                return promise;
            },
            updateTag: function (tag) {
                var promise = TagResource.Tag.update(tag).$promise;
                return promise;
            },
            deleteTags: function (deleteStr) {
                var promise = TagResource.BatchOperation.remove({ids: deleteStr}).$promise;
                return promise;
            }

        }
    }
]