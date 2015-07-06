/**
 * tag-selector
 * Usage
 * 1.cache results
 * <tag-select></tag-select>
 * or
 * 2.radically fetch results every time the input box is "focused"
 * <tag-select radical="true"></tag-select>
 *
 * 3.if the parent scope wants to access the userTags that has been selected,
 * it should define $scope.data = {} in its own scope
 *
 * @type {*[]}
 */

module.exports = [
    "TagOperations",
    "i18nFactory",
    "$q",
    function (TagOperations, i18nFactory, $q) {
        return {
            scope: true,
            restrict: "E",
            scope: {
                data: "=",
                filter: "="
            },
            replace: true,
            templateUrl: "@@PATH:/plugin/chat/tag-select.html",
            compile: function (tElement, attr) {
                //input attribute means tag selector from the query area
                if (attr.input) {
                    tElement.prepend('<input type="hidden" id="userTags" value="[[data.userTags]]" name="userTags">');
                    tElement.append('<span class="btn btn-primary addTagBtn" ng-click="Event.forceAddTagToTempArea()" ng-mouseenter="Event.disableBlur()" ng-mouseleave="Event.enableBlur()">' + i18nFactory.get('addTag') + '</span>');
                }
                tElement.append('<div style="clear:both"></div>');
                return function ($scope, ele, attrs) {
                    var cache = null;

                    $scope.showSuggestion = false;
                    $scope.isBlurEnabled = true;

                    if ($scope.data == null)
                        $scope.data = {};
                    if ($scope.data.userTags == null)
                        $scope.data.userTags = [];

                    $scope.userInput = "";
                    var currentAllTags = [];
                    $scope.Event = {};

                    //input attribute means update the $scope.filter.userTags as well
                    //the filter is used by query area
                    if (attr.input) {
                        $scope.$watch("data.userTags", function () {
                            $scope.filter.userTags = [];
                            if ($scope.data.userTags == null)
                                return;
                            $scope.data.userTags.forEach(function (tag) {
                                $scope.filter.userTags.push(tag);
                            });
                        }, true);
                    }

                    $scope.Event.getSuggestions = function () {
                        //don't show these tags
                        if ($scope.data.userTags == null) {
                            $scope.data.userTags = [];
                        }
                        var excludeList = $scope.data.userTags;
                        //load all member tags and not load the information related to the member
                        var tagsPromise = null;

                        if (attrs.radical == "true" || cache == null)
                            tagsPromise = TagOperations.getTags(attr.type, null, null, false);
                        else
                            tagsPromise = $q.when(cache);
                        $scope.suggestions = [];
                        tagsPromise
                            .then(function (tags) {
                                cache = tags;
                                currentAllTags = tags.filter(function (tag) {
                                    return excludeList.indexOf(tag.name) == -1;
                                });
                                $scope.showSuggestion = true;
                                $scope.suggestions = currentAllTags;
                            })
                            //for debug use
                            .catch(function (resp) {
                                $log.info(resp);
                            });

                    };

                    $scope.Event.forceAddTagToTempArea = function () {
                        var userInput = $scope.userInput;
                        if (userInput != null && userInput.trim().length != 0) {
                            //send a message along with the old userTags value to parent
                            $scope.$emit("TAGS_CHANGED", angular.copy($scope.data.userTags));
                            $scope.Event.addTagToTempArea(userInput);
                        }
                    };
                    $scope.Event.addTagToTempArea = function (tagName) {
                        //send a message along with the old userTags value to parent
                        var copy = angular.copy($scope.data.userTags);
                        copy.push(tagName);
                        $scope.$emit("TAGS_CHANGED", copy);

                        $scope.showSuggestion = false;
                        $scope.userInput = "";
                    };
                    $scope.Event.removeFromTempArea = function (tagName) {
                        var index = $scope.data.userTags.indexOf(tagName);
                        var copy = angular.copy($scope.data.userTags);
                        copy.splice(index, 1);
                        //send a message along with the old userTags value to parent
                        $scope.$emit("TAGS_CHANGED", copy);
                    };
                    $scope.Event.closeSuggestion = function ($event) {
                        if (!$scope.isBlurEnabled)
                            return;
                        $scope.showSuggestion = false;
                        $scope.userInput = "";
                    };
                    $scope.Event.filterSuggestions = function () {
                        if ($scope.userInput.trim() == "") {
                            $scope.suggestions = currentAllTags;
                            return;
                        }
                        $scope.showSuggestion = true;
                        $scope.suggestions = currentAllTags.filter(function (tag) {
                            if (tag.name.indexOf($scope.userInput) != -1) {
                                return true;
                            }
                        });
                        if ($scope.suggestions.length == 0) {
                            $scope.Event.enableBlur();
                        }

                    };

                    $scope.Event.disableBlur = function () {
                        $scope.isBlurEnabled = false;
                    };

                    $scope.Event.enableBlur = function () {
                        $scope.isBlurEnabled = true;
                    };

                    $scope.$on("NEW_TAG_CREATED_OUTSIDE", function (event, newTag) {
                        if (cache != null)
                            cache.unshift(newTag);
                    });

                }
            }

        }
    }
];