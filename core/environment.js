var runningServerPattern = /^http.+$/; // <url:port>
var sauceLabsPattern = /^([^\:]+)\:([^@]+)@(.+)$/; // <username>:<key>@<sauce-url>

var isArray = Array.isArray;

var parseConnectionArgument = function (config, connection) {
    if (!connection) {
        config.directConnect = true;
    } else if (typeof connection == 'string') {
        if (runningServerPattern.test(connection)) {
            config.seleniumAddress = connection;
        } else {
            var result = sauceLabsPattern.exec(connection);

            if (result != null) {
                config.sauceUser = result[1];
                config.sauceKey = result[2];
                config.sauceSeleniumAddress = result[3];
            }
        }
    } else if (isArray(connection)) {
        config.seleniumServerJar = connection[0];
        config.seleniumPort = connection[1];

        if (isArray(connection[2])) {
            config.seleniumArgs = connection[2];
        }
    } else if (typeof connection == 'object') {
        config.directConnect = true;

        if (typeof connection.chrome == 'string') {
            config.chromeDriver = connection.chrome;
        }

        if (typeof connection.firefox == 'string') {
            config.firefoxPath = connection.firefox;
        }
    }
};

var parseBrowsersArgument = function (config, browsers) {
    if (typeof browsers == 'string') {
        config.capabilities = {
            browserName: browsers
        };
    } else if (isArray(browsers)) {
        config.multiCapabilities = [];

        for (var i = 0; i < browsers.length; i++) {
            if (typeof browsers[i] == 'string') {
                config.multiCapabilities.push({
                    browserName: browsers[i]
                });
            } else if (typeof browsers[i] == 'object') {
                config.push(browsers[i]);
            }
        }
    } else if (typeof browsers == 'object') {
        config.capabilities = browsers;
    }
}

var extendWithOptionsArgument = function (config, options) {
    if (typeof options == 'object') {
        for (var i = 0, keys = Object.keys(options); i < keys.length; i++) {
            config[keys[i]] = options[keys[i]];
        }
    }
}

function Environment() {
    this.config = {};
}

/**
 * connection:
 *   To start standalone Selenium server locally
 *   pass array in format [ server jar file, port, args? ]
 *
 *   To connect to already running Selenium server
 *   pass the full url (e.g. 'http://localhost:4444/wd/hub')
 *
 *   To use remote browsers via Sauce Labs
 *   pass connection string in format <user>:<key>@<sauce-url>
 *
 *   To use browser drivers directly
 *   pass any falsy value or object with path(s) to binaries/executables
 *   (e.g. { 'chrome' : 'drivers/chromedriver' })
 *
 *
 * browsers:
 *   To use just one browser pass either name as string or capabilities object
 *
 *   To use more than one browser pass array with names or capabilities objects
 *
 *
 * options:
 *   To set arbitrary property of Protractor configuration
 *   pass an object with their values (see Protractor docs for full list)
 *
 */
Environment.prototype.define = function (connection, browsers, options) {
    parseConnectionArgument(this.config, connection);
    parseBrowsersArgument(this.config, browsers);
    extendWithOptionsArgument(this.config, options);

    return new EnvironmentDetails(this.config);
};

function EnvironmentDetails(config) {
    this.config = config;
    this._suiteActions = {};
    this._extensions = [];
    this._prepare = Function();
    this.config.onPrepare = this._onPrepare.bind(this);
}

EnvironmentDetails.prototype._onPrepare = function () {
    var suite = (function getSuite() {
        var flag = false;
        var suite;

        process.argv.forEach(function (arg) {
            if (flag) {
                suite = arg;
                flag = false;
            }

            if (arg == '--suite') {
                flag = true;
            }
        });

        return suite;
    })();

    this._extensions.forEach(function (extension) {
        extension(protractor);
    });

    this._prepare();

    if (typeof this._suiteActions[suite] === 'function') {
        this._suiteActions[suite]();
    }
};

EnvironmentDetails.prototype.use = function (extension) {
    this._extensions.push(extension);
    return this;
};

EnvironmentDetails.prototype.suite = function (name, files, action) {
    action = action || Function();

    if (!this.config.suites) {
        this.config.suites = {};
    }

    this.config.suites[name] = files;
    this._suiteActions[name] = action;
    return this;
};

EnvironmentDetails.prototype.prepare = function (action) {
    this._prepare = action;
    return this;
};

EnvironmentDetails.prototype.jasmine = function (configuration) {
    this.config.jasmineNodeOpts = configuration;
    return this;
};

EnvironmentDetails.prototype.getConfigFile = function () {
    return this.config;
};

(function () {
    module.exports = new Environment();
})();
