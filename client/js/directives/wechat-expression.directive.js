/**
 * Created by qiucheng on 15/4/20.
 */

/**
 * shows wechat expression for user to select from
 * Usage:
 * 1.<wechat-expression position="absolute" top="12px" left="17px"></wechat-expression>
 * 2.The parent $scope should define
 * closeExpression() and selectExpression() callbacks
 * @type {*[]}
 */

module.exports = [
    function () {
        return {
            restrict: "E",
            scope: {},
            templateUrl: "@@PATH:/plugin/chat/wechat-expression.html",
            link: function ($scope, ele, attrs) {

                var left = attrs.left;
                if (left == null)
                    left = "0px";

                var top = attrs.top;
                if (top == null)
                    top = "0px";


                ele.children(":first-child").css("top", top);
                ele.children(":first-child").css("left", left);

                function defineScope() {
                    $scope.expressionArray = [
                        "微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒",
                        "调皮", "呲牙", "惊讶", "难过", "酷", "冷汗", "抓狂", "吐", "偷笑", "愉快", "白眼", "傲慢",
                        "饥饿", "困", "惊恐", "流汗", "憨笑", "悠闲", "奋斗", "咒骂", "疑问", "嘘", "晕", "疯了", "衰",
                        "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "糗大了", "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了",
                        "阴险", "亲亲", "吓", "可怜", "菜刀", "西瓜", "啤酒", "篮球", "乒乓", "咖啡", "饭", "猪头", "玫瑰", "凋谢", "嘴唇",
                        "爱心", "心碎", "蛋糕", "闪电", "炸弹", "刀", "足球", "瓢虫", "便便", "月亮", "太阳", "礼物", "拥抱", "强", "弱", "握手",
                        "胜利", "抱拳", "勾引", "拳头", "差劲", "爱你", "NO", "OK", "爱情", "飞吻", "跳跳", "发抖", "怄火", "转圈", "磕头",
                        "回头", "跳绳", "投降", "激动", "乱舞", "献吻", "左太极", "右太极"
                    ];
                    $scope.position = attrs.position;
                    $scope.left = attrs.left;
                    $scope.top = attrs.top;
                    $scope.id = attrs.id;
                }

                function registerEvent() {
                    $scope.Events = {};

                    /**
                     * close the expression dialog
                     */
                    $scope.Events.closeExpression = function () {
                        $scope.$emit("EXPRESSION_CLOSE")
                    }

                    /**
                     * when selecting a wechat expression, insert it into the content area
                     */
                    $scope.Events.selectExpression = function (exp) {
                        $scope.$emit("EXPRESSION_SELECTED", exp);
                    }
                }

                defineScope();
                registerEvent();
            }
        }
    }
];