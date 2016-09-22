/// <reference path="../../typings/index.d.ts" />
var app = angular.module('myapp', ['ngSanitize', 'ngResource']);
// Get Device Infomations
app.service('info', function () {
    this._ua = function (u) {
        return {
            Tablet: (u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
                || u.indexOf("ipad") != -1
                || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
                || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
                || u.indexOf("kindle") != -1
                || u.indexOf("silk") != -1
                || u.indexOf("playbook") != -1,
            Mobile: (u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
                || u.indexOf("iphone") != -1
                || u.indexOf("ipod") != -1
                || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
                || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
                || u.indexOf("blackberry") != -1
        };
    };
    this.ua = function () {
        return 'sp';
        if (this._ua.Tablet || this._ua.Mobile) {
            return 'sp';
        }
        else {
            return 'pc';
        }
    };
});
// Get Menu List json file
app.factory('getJSON', ['$resource', function ($resource) {
        return {
            get: function (file) {
                var res = $resource(file);
                return res.query();
            }
        };
    }]);
app.constant('utils', function () {
    this.now = (function () {
        var d = new Date;
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
        };
    })();
});
/// <reference path="./app.ts" />
app.controller('appCtrl', ['$scope', 'info', function ($scope, info) {
        $scope.ua = info.ua();
        // Include Templates
        $scope.viewsNavbar = $scope.ua + "/navbar.html";
        $scope.viewsFooter = "common/footer.html";
        // Site menu
        $scope.siteMenu = [
            {
                href: '#', ja: 'こだわり', en: 'Persistence'
            },
            {
                href: 'news.html', ja: 'おしらせ', en: 'News'
            },
            {
                href: 'menu.html', ja: 'お品書き', en: 'Menu'
            },
            {
                // href: 'discount.html', ja: 'お得な情報', en: 'Discount'
                href: '#', ja: 'お得な情報', en: 'Discount'
            },
            {
                href: 'info.html', ja: '店舗情報', en: 'Information'
            },
            {
                href: 'reserve.html', ja: 'ご予約', en: 'Reservation'
            }
        ];
    }]);
app.controller('navbarCtrl', ['$scope', function ($scope) {
    }]);
app.controller('footerCtrl', ['$scope', function ($scope) {
    }]);
app.controller('indexCtrl', ['$scope', 'info', 'getJSON', function ($scope, info, getJSON) {
        $scope.viewsIndexHeader = '/common/index-header.html';
        $scope.menuList = getJSON.get('/public/menu-list.json');
    }]);
app.controller('indexHeaderCtrl', ['$scope', '$interval', function ($scope, $interval) {
        var imgPath = './assets/img/index-pic';
        $scope.slides = [
            { img: imgPath + "/idx-pic1.jpg", active: true },
            { img: imgPath + "/idx-pic2.jpg", active: false },
            { img: imgPath + "/idx-pic3.jpg", active: false }
        ];
        var activeIdx = 0;
        $interval(function () {
            $scope.slides[activeIdx].active = false;
            activeIdx++;
            if ($scope.slides[activeIdx] !== undefined) {
                $scope.slides[activeIdx].active = true;
            }
            else {
                $scope.slides[0].active = true;
                activeIdx = 0;
            }
        }, 5000);
    }]);
app.controller('openCalCtrl', ['$scope', '$timeout', 'utils', function ($scope, $timeout, utils) {
    }]);
app.controller('menuCtrl', ['$scope', 'getJSON', function ($scope, getJSON) {
        $scope.headerBg = '../assets/img/header/menu.jpg';
        $scope.pageName = { ja: 'お品書き', en: 'Menu' };
        $scope.menuList = getJSON.get('/public/menu-list.json');
        console.log($scope.menuList);
    }]);
app.controller('newsCtrl', ['$scope', 'getJSON', function ($scope, getJSON) {
        $scope.headerBg = '../assets/img/header/news.jpg';
        $scope.pageName = { ja: 'おしらせ', en: 'News' };
        // $scope.articles = getJSON.get();
        // $scope.categories = getJSON.get();
        $scope.dateFormat = function (date) {
            var m = moment(date);
            return m.format('YYYY/MM/DD');
        };
        $scope.timeFormat = function (time) {
            var m = moment(time, 'hh:mm:ss');
            return m.format('hh:mm A');
        };
    }]);
