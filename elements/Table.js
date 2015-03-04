var Component = require('../core/Component');
var TableRow = require('./TableRow');

Component.extend(Table);

function Table(parent, element) {
    Component.call(this, parent, element);
}

Table.prototype.getRows = function () {
    var self = this;
    return this.all(by.css('tbody > tr')).map(function (row) {
        return new TableRow(self, row);
    });
};

module.exports = Table;
