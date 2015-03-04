var Component = require('../core/Component');

Component.extend(Clickable);

function Clickable(parent, element) {
    Component.call(this, parent, element);
}

Clickable.prototype.click = function () {
    this.root.getWebElement().click();
    return this.parent;
};

module.exports = Clickable;
