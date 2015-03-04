var Component = require('../core/Component');

Component.extend(TextField);

function TextField(parent, element) {
    Component.call(this, parent, element);
}

TextField.prototype.enterText = function (text) {
    var input = this.root.getWebElement();
    input.clear();
    input.sendKeys(text);
    return this.parent;
};

TextField.prototype.appendText = function (text) {
    this.root.getWebElement().sendKeys(text);
    return this.parent;
}

TextField.prototype.clear = function () {
    this.root.getWebElement().clear();
    return this.parent;
};

TextField.prototype.pressEnter = function () {
    this.appendText(protractor.Key.ENTER);
    return this.parent;
};

TextField.prototype.pressEscape = function () {
    this.appendText(protractor.Key.ESCAPE);
    return this.parent;
};

TextField.prototype.pressBackSpace = function () {
    this.appendText(protractor.Key.BACK_SPACE);
    return this.parent;
};

TextField.prototype.pressDelete = function () {
    this.appendText(protractor.Key.DELETE);
    return this.parent;
};

TextField.prototype.getText = function () {
    return this.root.getWebElement().getAttribute('value');
};

module.exports = TextField;
