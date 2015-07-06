/**
 * Created by qiucheng on 15/5/15.
 */

/**
 * AngularJS ng-scroll directive
 *
 * Adds support for ng-scroll event attribute to bind on mouse wheel events. Use the `$event` local variable
 * to access the jQuery event object
 *
 * @example <ANY ng-scroll="onScroll($event)"></ANY>
 */
module.exports = ['$parse', function ($parse) {
    return {
        restrict: "A",
        link: function ($scope, element, attr) {
            var fn = $parse(attr.ngScroll);

            element.bind('mousewheel', function (event) {
                $scope.$apply(function () {
                    fn($scope, {
                        $event: event.originalEvent
                    });
                });
            });
        }
    }
}];

