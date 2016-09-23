/// <reference path="../../typings/index.d.ts" />
var app = angular.module('myapp', ['ngSanitize', 'ngResource']);
// Get Device Infomations
app.service('info', function () {
    this._ua = (function (u) {
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
    })(window.navigator.userAgent.toLowerCase());
    this.ua = function () {
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
            },
            info: function () {
                var res = $resource('./public/info.json');
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
                // href: 'info.html', ja: '店舗情報', en: 'Information'
                href: '#', ja: '店舗情報', en: 'Information'
            },
            {
                href: 'reserve.html', ja: 'ご予約', en: 'Reservation'
            }
        ];
        // クリックしたらスムーススクロール
        $scope.scrollTo = function (id) {
            var $elem = document.getElementById(id);
            var target = $elem.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo(window.pageXOffset, target);
            return;
        };
    }]);
app.controller('navbarCtrl', ['$scope', function ($scope) {
        $scope.isOpen = false;
        $scope.toggleNav = function () {
            $scope.isOpen = ~$scope.isOpen;
            return;
        };
    }]);
app.controller('footerCtrl', ['$scope', function ($scope) {
    }]);
app.controller('indexCtrl', ['$scope', '$timeout', 'info', 'getJSON', function ($scope, $timeout, info, getJSON) {
        $scope.viewsIndexHeader = './common/index-header.html';
        $scope.recommendList = getJSON.get('./public/recommend.json');
        $timeout(function () {
            for (var i = 0, len = $scope.recommendList.length; i < len; i++) {
                var elem = $scope.recommendList[i];
                if (new Date(elem.start) <= new Date) {
                    $scope.recItem = elem;
                    break;
                }
            }
        });
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
app.controller('sidebarOpenCtrl', ['$scope', '$timeout', '$resource', function ($scope, $timeout, $resource) {
        var res = $resource('./public/open.json');
        var open = res.query(function () {
            var info = null;
            var today = moment().format("YYYY-MM-DD");
            for (var i = 1, len = open.length; i < len; i++) {
                var item = open[i];
                if (item.date === today) {
                    $scope.info = item;
                    return;
                }
            }
            if (info === null) {
                $scope.info = open[0];
            }
            var close = $scope.info.close.split(':');
            var closeMoment = moment($scope.info.close, 'HH:mm');
            $scope.lo = closeMoment.subtract($scope.info.lo, 'minutes').format('HH:mm');
        });
    }]);
app.controller('menuCtrl', ['$scope', 'getJSON', function ($scope, getJSON) {
        $scope.headerBg = './assets/img/header/menu.jpg';
        $scope.pageName = { ja: 'お品書き', en: 'Menu' };
        $scope.menuList = getJSON.get('./public/menu-list.json');
        // トラッキング
        (function () {
            var $elem = document.getElementById('sidebar');
            window.addEventListener('scroll', function (e) {
                var position = window.pageYOffset;
                var elemH = $elem.scrollHeight;
                var contentH = document.body.scrollHeight - document.querySelector('.global-footer').clientHeight - 20;
                var offset = 65;
                if (position + offset > contentH - elemH) {
                    $elem.style.position = 'absolute';
                    $elem.style.top = (contentH - elemH) + "px";
                }
                else if (position > 210 + offset) {
                    $elem.style.position = 'fixed';
                    $elem.style.top = offset + "px";
                }
                else {
                    $elem.style.position = 'static';
                }
            });
        })();
    }]);
app.controller('newsCtrl', ['$scope', 'getJSON', function ($scope, getJSON) {
        $scope.headerBg = './assets/img/header/news.jpg';
        $scope.pageName = { ja: 'おしらせ', en: 'News' };
        $scope.articles = getJSON.get('./public/articles.json');
        $scope.markdown = function (md) {
            return marked(md);
        };
        $scope.dateFormat = function (date) {
            var m = moment(date);
            return m.format('YYYY/MM/DD');
        };
        $scope.timeFormat = function (time) {
            var m = moment(time, 'hh:mm:ss');
            return m.format('hh:mm A');
        };
    }]);
app.controller('reserveCtrl', ['$scope', function ($scope) {
        $scope.headerBg = './assets/img/header/reserve.jpg';
        $scope.pageName = { ja: 'ご予約', en: 'Reservation' };
    }]);
