/// <reference path="../../typings/index.d.ts" />

const app: any = angular.module('myapp', ['ngSanitize', 'ngResource']);

// Get Device Infomations
app.service('info', function() {
  this._ua = ((u) => {
    return {
      Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
        || u.indexOf("ipad") != -1
        || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
        || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
        || u.indexOf("kindle") != -1
        || u.indexOf("silk") != -1
        || u.indexOf("playbook") != -1,
      Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
        || u.indexOf("iphone") != -1
        || u.indexOf("ipod") != -1
        || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
        || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
        || u.indexOf("blackberry") != -1
    }
  })(window.navigator.userAgent.toLowerCase());
  this.ua = function() {
    if(this._ua.Tablet || this._ua.Mobile) {
      return 'sp';
    } else {
      return 'pc';
    }
  };
});

// Get Menu List json file
app.factory('getJSON', ['$resource', ($resource) => {
  return {
    get: (file) => {
      const res: any = $resource(file);
      return res.query();
    }
  }
}]);

app.constant('utils', function() {
  this.now = (() => {
    const d = new Date;
    return {
      n: d,
      y: d.getFullYear(),
      m: d.getMonth() + 1,
      d: d.getDate(),
      w: d.getDay(),
      h: d.getHours(),
      i: d.getMinutes(),
      s: d.getSeconds(),
      u: Math.floor(d.getTime() / 1000)
    }
  })()
});
