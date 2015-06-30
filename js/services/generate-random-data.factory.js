/**
 * Created by qiucheng on 15/5/13.
 */
var Customer = require("../models/Customer");
var Conversation = require("../models/Conversation");
var Message = require("../models/Message");


module.exports = function () {
    var surnames = ["王", "张", "李", "童", "蒋", "范", "彭", "钱", "陈", "方", "田", "厉", "曾"];
    var givenNames = ["紫", "倩", "刚", "强", "磊", "萌", "志强", "丽", "壮", "美丽", "龙", "云", "浩"];

    return {
        generateRandomConversations: function (count) {
            var conversations = [];
            for (var i = 0; i < count; i++) {
                var customer = this.generateRandomUserInfo("user" + i);
                var conversation = new Conversation(customer);
                conversations.push(conversation);
            }
            conversation.messages = [];
            return conversations;
        },

        generateRandomUserInfo: function (userId) {
            var surNameIndex = Math.floor(Math.random() * surnames.length);
            var givenNameIndex = Math.floor(Math.random() * givenNames.length);
            var imageIndex = Math.floor(Math.random() * 5) + 1;

            var name = surnames[surNameIndex] + givenNames[givenNameIndex];
            var avatar = "images/test/avatar" + imageIndex + ".jpg";
            return new Customer(userId, name, avatar);
        },

        fetchMessages: function (start) {
            var messages = [];

            //message type
            var CUSTOMER_MESSAGE = "CUSTOMER_MESSAGE";
            var CSR_MESSAGE = "CSR_MESSAGE";
            var TEXT_MESSAGE = "TEXT";
            var PICTURE_MESSAGE = "PICTURE";


            messages.push(
                new Message(CUSTOMER_MESSAGE, TEXT_MESSAGE,
                    "之前[微笑]在懒懒分会上分享的一点关于border[调皮]画小图的内容, 完整的ppt在 这里 . css盒模型 " +
                    "一个盒子包括: margin+border+padding+content – 上下左右边框交界处出呈现平滑的斜线. 利用这个特点, 通过... ")
            );

            //
            //messages.push(
            //    new Message(CUSTOMER_MESSAGE, TEXT_MESSAGE,
            //        "查询用户的[乱舞]关注列表：\nselect touid from table where fromuid=？order by addTime desc")
            //);
            //
            //messages.push(
            //    new Message(CUSTOMER_MESSAGE, TEXT_MESSAGE,
            //        "在下一章中[发呆]，我们将会谈论那些没有确切关联到数据结构的命令，其中[勾引]的一些是管理或调试工具。然而有一个命令我想特别地在这里进行谈论：keys命令。这个命令需要一个模式，然后查找所有匹配的关键字。这个命令看起来很适合一些任务，但这不应该用在实际的产品代码里。为什么？因为这个命令通过线性扫描所有的关键字来进行匹配。或者，简单地说，这个命令太慢了。")
            //);

            messages.push(
                new Message(CSR_MESSAGE, TEXT_MESSAGE,
                    "hey no longer have elements inside. It is Redis' responsibility to delete keys when lists are left empty,\n or to create an empty list if the key does not exist and we are trying to add elements to it, for ex")
            );

            messages.push(
                new Message(CUSTOMER_MESSAGE, PICTURE_MESSAGE,
                    "./images/test/shanghai.jpg")
            );


            messages.push(
                new Message(CSR_MESSAGE, PICTURE_MESSAGE,
                    "./images/test/metro.jpg")
            );

            if (start < 18) {
                return messages;
            } else if (start == 18) {
                return messages.splice(0, 3);
            } else {
                return [];
            }

        }

    };
};