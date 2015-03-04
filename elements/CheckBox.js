var Component = require('../core/Component');

Component.extend(CheckBox);

function CheckBox(parent, element) {
    Component.call(this, parent, element);
}

CheckBox.prototype.click = function () {
    this.root.getWebElement().click();
};

CheckBox.prototype.toggle = function () {
    this.root.getWebElement().click();
    return this.parent;
};

CheckBox.prototype.check = function () {
    var self = this;

    this.isChecked().then(function (checked) {
        if (!checked) {
            self.toggle();
        }
    });

    return this.parent;
};

CheckBox.prototype.uncheck = function () {
    var self = this;

    this.isChecked().then(function (checked) {
        if (checked) {
            self.toggle();
        }
    });

    return this.parent;
};

CheckBox.prototype.isChecked = function () {
    return this.root.getWebElement().getAttribute('checked');
};

module.exports = CheckBox;
