/**
 * Created by qiucheng on 15/5/26.
 */
module.exports = [
    function () {
        return {
            restrict: "AE",
            replace: true,
            link: function ($scope, ele, attrs) {
                if (attrs.type == 'video') {
                    var newEle = $("<video controls class='video'>");
                    newEle.attr("src", attrs.src);
                    ele.parent().append(newEle);
                } else if (attrs.type == 'audio') {
                    setTimeout(function () {
                        var newEle = $("<audio preload class='audio'>");
                        newEle.attr("src", attrs.src);
                        newEle.attr("id", "audio" + attrs.id);

                        var audioElement = newEle.get(0);

                        audioElement.load();
                        audioElement.oncanplay = function () {
                            $scope.$apply(function () {
                                var span = $('<span class="voice-message-info"></span>');
                                span.text(Math.round(audioElement.duration) + "''");
                                ele.parent().append(span);
                            });
                        };

                        ele.parent().append(newEle);
                    }, 1500);
                }
            }
        }
    }
];