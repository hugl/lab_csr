/**
 * Created by qiucheng on 15/5/25.
 */
module.exports = [
    function () {
        return {
            restrict: "E",
            scope: {},
            templateUrl: "@@PATH:/plugin/chat/slide-bar.html",
            link: function ($scope, element, attr) {
                function defineScopes() {
                    $scope.constants = {};
                    $scope.constants.ON = "on";
                    $scope.constants.OFF = "off";
                    $scope.status = "on";
                }

                function registerEvents() {
                    $scope.Events = {};
                    $scope.Events.toggleStatus = function ($event) {
                        var ele = $(event.target);

                        if ($scope.status == $scope.constants.ON) {
                            $scope.status = $scope.constants.OFF;
                            ele.css("animation", "move-to-right-circle 0.5s ease 0.05s").css("animation-fill-mode", "forwards");
                            ele.parent().css("animation", "move-to-right 0.5s ease 0s").css("animation-fill-mode", "forwards");
                            $scope.$emit("SETTING_OFF", attr.bindOn);
                        }
                        else if ($scope.status == $scope.constants.OFF) {
                            $scope.status = $scope.constants.ON;
                            ele.css("animation", "move-to-left-circle 0.5s ease 0s").css("animation-fill-mode", "forwards");
                            ele.parent().css("animation", "move-to-left 0.5s ease 0s").css("animation-fill-mode", "forwards");
                            $scope.$emit("SETTING_ON", attr.bindOn);
                        }
                    }
                }

                defineScopes();
                registerEvents();
            }
        };
    }
];