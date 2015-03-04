function Session(injector) {
    this._injector = injector;
}

Session.prototype.scopeTo = function (view) {
    return this._injector(view);
};

module.exports = Session;
