var inherit = require('../util/inherit');

/**
 * @param parent {View|Component}
 * @param element {Protractor.Element|Protractor.By}
 */
function Component(parent, element) {
    // is Protractor By
    if (/^(?:b|B)y\./.test(element.toString())) {
        element = parent.element(element);
    }

    this.parent = parent;
    this.session = parent.session;
    this.root = element;
}

Component.prototype.scopeTo = function (view) {
    return this.session.scopeTo(view);
};

Component.prototype.getText = function () {
    return this.root.getText();
};

Component.prototype.element = function (locator) {
    return this.root.element(locator);
};

Component.prototype.all = function (locator) {
    return this.root.all(locator);
};

Component.prototype.isPresent = function () {
  return this.root.isPresent();
};

Component.prototype.isVisible = function () {
  return this.root.getWebElement().isDisplayed();
};

Component.prototype.cache = function () {
    var deferred = protractor.promise.defer();
    var self = this;

    var marker = ((function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    })(10000, 100000).toString(16) + Date.now().toString(16));

    browser.executeScript(
        'arguments[0].setAttribute("data-pagon-marker", arguments[1]);',
        this.root.getWebElement(),
        marker
    ).then(function () {
        deferred.fulfill({
            constructor: self.constructor.name,
            parent: self.parent,
            marker: marker
        });
    });

    return deferred;
};

Component.prototype.extend = function (subclass) {
    inherit(subclass, this);
};

Component.makeFromCache = function (cache) {
    return new cache.constructor(cache.parent, by.css('[data-pagon-marker="' + cache.marker + '"]'));
};

Component.extend = function (subclass) {
    inherit(subclass, Component);

    subclass.extend = function (grandSubclass) {
        inherit(grandSubclass, subclass);
    };
};

module.exports = Component;
