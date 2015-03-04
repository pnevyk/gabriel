var inherit = require('../util/inherit');

function View(session) {
    this.root = this.element(by.tagName('body'));
    this.session = session;
}

View.prototype.element = function (locator) {
    return element(locator);
};

View.prototype.all = function (locator) {
    return element.all(locator);
};

View.prototype.scopeTo = function (view) {
    return this.session.scopeTo(view);
};

View.prototype.extend = function (subclass) {
    inherit(subclass, this);
};

View.extend = function (subclass) {
    inherit(subclass, View);

    subclass.extend = function (grandSubclass) {
        inherit(grandSubclass, subclass);
    };
};

module.exports = View;
