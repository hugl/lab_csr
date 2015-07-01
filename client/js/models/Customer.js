/**
 * Created by qiucheng on 15/5/14.
 */
var util = require("util");

function Customer(userId, name, avatar) {
    this.userId = userId;
    this.name = name;
    this.avatar = avatar;

    //init
    this.ordersLoaded = false;

    this.orders = [];

    this.country = "";
    this.province = "";
    this.city = "";
    this.subscriptionTime = "";
    this.level = "";
    this.points = "";
    this.userTags = "";
    this.lastPurchaseTime = "";
    this.purchaseTimes = "";
    this.totalAmount = "";
    this.avg = "";
    this.basicInfoLoaded = false;
    this.hasGone = false;
    this.userTags = [];
}

Customer.wrapCustomer = function (apiCustomer) {
    var name = (apiCustomer.name && apiCustomer.name.fullName) || "未知姓名";
    var avatar = (apiCustomer.extendedProperties && apiCustomer.extendedProperties.avatarUrl) || "images/unknown_user.jpg";
    var customer = new Customer(apiCustomer.id.id, name, avatar);
    if (apiCustomer.extendedProperties && apiCustomer.extendedProperties.wxUserInfo) {
        customer.setHasGone(apiCustomer.extendedProperties.wxUserInfo.subscribe);
    }
    customer.setGender(apiCustomer.gender);
    return customer;
};

Customer.prototype.setCountry = function (country) {
    this.country = country;
};

Customer.prototype.setProvince = function (province) {
    this.province = province;
};

Customer.prototype.setCity = function (city) {
    this.city = city;
};

Customer.prototype.setHasGone = function (subscribe) {
    if (subscribe == 1) {
        this.hasGone = false;
    }
    else {
        this.hasGone = true;
    }
};

Customer.prototype.setGender = function (gender) {
    this.gender = gender;
};

Customer.prototype.setAge = function (age) {
    this.age = age;
};

Customer.prototype.setSubscriptionTime = function (longNumber) {
    if (longNumber != null) {
        var date = new Date(longNumber * 1000 + 8 * 3600 * 1000);
        var year = 1900 + date.getYear();
        var month = date.getMonth() + 1;
        var day = date.getDay();

        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        this.subscriptionTime = util.format("%s-%s-%s %s:%s:%s", year, addZero(month), addZero(day), addZero(hour), addZero(minute), addZero(second));
    }
};

function addZero(number) {
    if (number < 10)
        return "0" + number;
    else
        return "" + number;
}

module.exports = Customer;