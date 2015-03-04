var Component = require('../core/Component');

Component.extend(Option);

function Option(parent, element) {
    Component.call(this, parent, element);
}

Option.prototype.click = function () {
    this.parent.click();
    this.root.getWebElement().click();
    return this.parent;
};

Option.prototype.getValue = function () {
    return this.root.getWebElement().getAttribute('value');
};

Option.prototype.getText = function () {
    return this.root.getWebElement().getText();
};

module.exports = Option;
