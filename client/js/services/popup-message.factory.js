/**
 * Created by qiucheng on 15/5/29.
 */
module.exports = [
    function () {
        return {

            getScope: function () {
                return angular.element(document.getElementById("popup-background-div")).scope();
            },

            deactivate: function () {
                var $scope = this.getScope();
                $scope.status.visible = false;
            },

            popup: function (title, message, onConfirm, onCancel) {
                var $scope = this.getScope();
                $scope.Events = {};
                $scope.Events.onConfirm = onConfirm;
                $scope.status.showCancel = false;
                if (onCancel) {
                    $scope.status.showCancel = true;
                }

                var popup = this;

                $scope.Events.onCancel = function () {
                    if (onCancel) {
                        onCancel();
                    }
                    popup.deactivate();
                };

                $scope.Events.onConfirm = function () {
                    if (onConfirm) {
                        onConfirm();
                    }
                    popup.deactivate();
                };


                $scope.word.title = title;
                $scope.word.message = message;
                $scope.status.visible = true;
            }
        }
    }
];