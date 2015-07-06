/**
 * Created by qiucheng on 15/5/25.
 */
module.exports = function ($scope, resources, utils, i18nFactory) {


    $scope.$on("SETTING_OFF", function (event, type) {
        if (type == $scope.constants.AUTOSCROLLBAR) {
            $scope.settings.autoScrollBarPosition = false;
        } else if (type == $scope.constants.NOTIFICATION) {
            $scope.settings.notification = false;
        }
    });

    $scope.$on("SETTING_ON", function (event, type) {
        if (type == $scope.constants.AUTOSCROLLBAR) {
            $scope.settings.autoScrollBarPosition = true;
        } else if (type == $scope.constants.NOTIFICATION) {
            $scope.settings.notification = true;
        }
    });

    $scope.$on("TAGS_CHANGED", function (event, userTags) {
        var tagNamesToBeUpdated = userTags;
        var userId = $scope.currentConversation.customer.userId;
        resources.getUserByIdSimple(userId)
            .then(function (resp) {
                var memberFromDB = resp.data;
                memberFromDB.tags = tagNamesToBeUpdated;
                resources.updateUser(userId, memberFromDB);
            }).then(function () {
                $scope.currentConversation.customer.userTags = tagNamesToBeUpdated;
            }).catch(function (resp) {
                utils.displayMessage(i18nFactory.get("updateTagFailed"));
                console.log(resp);
            }).finally(function () {

            });
    });
};