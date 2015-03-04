var fs = require('fs');
var path = require('path');

module.exports.expose = function (name, subject) {
    return function () {
        global[name] = subject;
    };
};

module.exports.screenshotTaker = function (directoryGenerator, options) {
    options = options || {};
    options.errorMsg = options.errorMsg = 'Screenshot was not saved due to this error:';

    var screenshots = directoryGenerator();

    try {
        fs.mkdirSync(screenshots);
    } catch (e) {
        console.warn('Directory specified for screenshots already exists.');
    }

    return function (name) {
        browser.takeScreenshot().then(function (png) {
            png = new Buffer(png, 'base64');
            fs.writeFile(path.join(screenshots, name + '.png'), png, 'binary', function (err) {
                if (err) {
                    console.error(options.errorMsg, err);
                }
            });
        });
    };
};

module.exports.maximize = function () {
    return function () {
        browser.manage().window().maximize();
    };
};

module.exports.goTo = function (url) {
    return function () {
        browser.get(url);
    };
};
