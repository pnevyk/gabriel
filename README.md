# Gabriel

Abstraction layer on top of the [Protractor](http://angular.github.io/protractor/#/) that helps to create unified page objects, more comfortable test run configuration and making repetitive UI actions.

## Main goals

- Unified view and component definition
- Fluent-style testing
- Comfortable test run configuration
- To help compose all together easily

## Installation

```bash
$ npm install --save-dev gabriel
```

## Usage

### Component

Component class is here to define certain behavior of an specific element. Basic components can be e.g. TextField, SelectBox, etc. (these and a few others are included in Gabriel) but also complex ones such as multifunctional grid, svg diagram or wysiwyg editor.

```js
// Tab.js

var gabriel = require('gabriel');

gabriel.Clickable.extend(Tab); // extend clickable element (extend Component class if you want to create a general component)

function Tab(session) {
    gabriel.Clickable.call(this, session); // pass session to base contructor
}

Tab.prototype.isActive = function () {
    var deferred = protractor.promise.defer();
    
    // this.root is protractor element which this component abstracts
    this.root.getWebElement().getAttribute('class').then(function (cssClass) {
        deferred.fulfill(cssClass.indexOf('active') !== -1);
    });
    
    return deferred;
};

module.exports = Tab;
```

### View

View class can represent whole page but also a login form, for example. It defines standardized interface of concrete application view.

```js
// BasePage.js

var gabriel = require('gabriel');
var Tab = require('./Tab');

gabriel.View.extend(BasePage); // extend View class (you can extend this BasePage lately in the same way)

function BasePage(session) {
    gabriel.View.call(this, session); // pass session to base contructor
}

BasePage.prototype.getSearchTextField = function () {
    return new gabriel.TextField(this, by.model('search')); // create new text field element located by model
};

BasePage.prototype.getMenuTabs = function () {
    var self = this;
    return this.all(by.css('#menu .tab')).map(function (tab) { // get all elements with this css selector
        return new gabriel.Tab(self, tab);                     // and create Tab elements from them
    });
};

module.exports = BasePage;
```

### Provider

Gabriel is designed to be used with some kind of IoC container. There will be the specific implementation which fits the Gabriel's needs but you can use whatever you want (here is the example with [Inverse](https://github.com/mcordingley/Inverse.js)).

```js
// provider.js

var Inverse = require('Inverse');
var gabriel = require('gabriel');
var BasePage = require('./BasePage');
var container = new Inverse();

container.singleton('session', function () {
    return new gabriel.Session(function (name) {
        return container.make(name); // this function is for injecting objects from IoC container
    });
});

container.bind('BasePage', function () {
    return new BasePage(container.make('session'));
});

module.exports = function (name) {
    return container.make(name);
};
```

### Environment

Configuration of Protractor can be very uncomfortable and requires options reference opened. Gabriel's Environment class is here to change that. For details check the [source code](https://github.com/nevyk/gabriel/blob/master/core/environment.js#L76).

```js
// remote-environment.js

var gabriel = require('gabriel');

// this is like module.exports.config = { ... }
module.exports = gabriel.Environment.define('http://localhost:4444/wd/hub', ['chrome', 'firefox'])

// make global function called 'provide' which injects values from out IoC container
.use(gabriel.env.expose('provide', require('./provider')))
// maximize browser window
.use(gabriel.env.maximize())
// redirect to the url
.use(gabriel.env.goTo('http://angular.github.io/protractor/#/'))
// make a global function
.use(gabriel.env.expose('sayHello', function (name) {
    console.log('Hello, ' + name);
})
// configure Jasmine
.jasmine({
    isVerbose: true
});
```

### Tests

```js
// specs/gabriel_spec.js

// ...
var basePage = provide('BasePage');
basePage.getMenuTabs().then(function (tabs) {
    tabs[0].click();
    expect(tabs[0].isActive()).toBe(true);
});

basePage.getSearchTextField().enterText('search value');

```

### Chaining

Chaining possibility is very powerful feature of Gabriel. This is also why it's built with IoC container in mind.

```js
basePage.getSearchTextField().enterText('value') // methods of TextField component returns its parent (in this case BasePage)
        .getMenuTabs();                          // so we can call BasePage methods then
        
firstPage.goSomewhereButton().click().scopeTo('SecondPage') // this method which injects object from IoC container
    .getElementOfSecondPage();                              // so we can use different object and we don't need initialize it
```

## TODO

- Make better documentation
- Improve all core classes

## License

Gabriel is MIT licensed. Feel free to use it, contribute or spread the word. Created with love by Petr Nevyhoštěný ([Twitter](https://twitter.com/pnevyk)).
