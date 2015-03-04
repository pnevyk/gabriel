module.exports = function (sub, base) {
    for (var i = 0, keys = Object.keys(base.prototype) ; i < keys.length; i++) {
        sub.prototype[keys[i]] = base.prototype[keys[i]];
    }
};
