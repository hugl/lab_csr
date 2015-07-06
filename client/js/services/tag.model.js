"use strict";

var Model = (function () {
    function Model(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;

        //the quantity of the  users or product that are tagged with the tag.
        Object.defineProperty(this, "userCount", {
            value: 0,
            writable: true,
            configurable: true,
            //do not send this value to JAVA API
            enumerable: false
        });
    }

    Model.prototype.toString = function () {
        return "Label:" + this.name + " " + this.userCount + "people";
    }

    return Model;
}());

module.exports = function () {
    return Model;
};