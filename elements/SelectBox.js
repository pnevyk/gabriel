var Component = require('../core/Component');
var Option = require('./Option');

Component.extend(SelectBox);

function SelectBox(parent, element) {
    Component.call(this, parent, element);
}

SelectBox.prototype.getOptions = function () {
    var self = this;
    return this.all(by.tagName('option')).map(function (option) {
        return new Option(self, option);
    });
};

SelectBox.prototype.getOptionByText = function (text) {
    var deferred = protractor.promise.defer();

    this.getOptions().then(function (options) {
        protractor.promise.filter(options, function (option) {
            return option.getText().then(function (optionText) {
                return optionText === text;
            });
        }).then(function (options) {
            deferred.fulfill(options[0]);
        });
    });

    return deferred;
};

SelectBox.prototype.getValue = function () {
    return this.root.getWebElement().getAttribute('value');
};

SelectBox.prototype.getText = function () {
    var self = this;
    var deferred = protractor.promise.defer();

    this.getValue().then(function (value) {
        self.all(by.tagName('option')).filter(function (option) {
            return option.getAttribute('value').then(function (optionValue) {
                return optionValue === value;
            });
        }).first().getText().then(function (text) {
            deferred.fulfill(text);
        });
    });

    return deferred.promise;
};

SelectBox.prototype.click = function () {
    this.root.getWebElement().click();
    return this.parent;
};

module.exports = SelectBox;
