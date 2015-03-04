var Component = require('../core/Component');

Component.extend(TableRow);

function TableRow(parent, element) {
    Component.call(this, parent, element);
}

TableRow.prototype.getHeaderColumns = function () {
    return this.all(by.css('th'));
};

TableRow.prototype.getColumns = function () {
    return this.all(by.css('td'));
};

module.exports = TableRow;
