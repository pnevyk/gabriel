var inherit = require('../util/inherit');

function Action() {
    this._injector = Function();
}

Action.prototype.setInjector = function (injector) {
    this._injector = injector;
};

Action.prototype.execute = function () {
    throw new Error('Implement the "execute" function to perform this action.');
};

Action.prototype.get = function (name) {
    return this._injector(name);
};

Action.prototype.extend = function (subclass) {
    inherit(subclass, this);
};

Action.extend = function (subclass) {
    inherit(subclass, Action);

    subclass.extend = function (grandSubclass) {
        inherit(grandSubclass, subclass);
    };
};

module.exports = Action;
