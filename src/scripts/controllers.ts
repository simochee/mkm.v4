/// <reference path="./app.ts" />

app.controller('appCtrl', ['$scope', 'info', ($scope, info) => {
  $scope.ua = info.ua();

  // Include Templates
  $scope.viewsNavbar = `${$scope.ua}/navbar.html`;
  $scope.viewsFooter = `common/footer.html`;

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

  // クリックしたらスムーススクロール
  $scope.scrollTo = (id) => {
    const $elem = document.getElementById(id);
    const target = $elem.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo(window.pageXOffset, target);
    return;
  }

}]);

app.controller('navbarCtrl', ['$scope', ($scope) => {

}]);

app.controller('footerCtrl', ['$scope', ($scope) => {

}]);

app.controller('indexCtrl', ['$scope', 'info', 'getJSON', ($scope, info, getJSON) => {
  $scope.viewsIndexHeader = './common/index-header.html';
  $scope.menuList = getJSON.get('./public/menu-list.json');
}]);

app.controller('indexHeaderCtrl', ['$scope', '$interval', ($scope, $interval) => {
  const imgPath: String = './assets/img/index-pic';
  $scope.slides = [
    { img: `${imgPath}/idx-pic1.jpg`, active: true },
    { img: `${imgPath}/idx-pic2.jpg`, active: false },
    { img: `${imgPath}/idx-pic3.jpg`, active: false }
  ];

  let activeIdx = 0;
  $interval(() => {
    $scope.slides[activeIdx].active = false;
    activeIdx ++;
    if($scope.slides[activeIdx] !== undefined) {
      $scope.slides[activeIdx].active = true;
    } else {
      $scope.slides[0].active = true;
      activeIdx = 0;
    }
  }, 5000);
}]);

app.controller('openCalCtrl', ['$scope', '$timeout', 'utils', ($scope, $timeout, utils) => {

}]);


app.controller('menuCtrl', ['$scope', 'getJSON', function($scope, getJSON) {
  $scope.headerBg = './assets/img/header/menu.jpg';
  $scope.pageName = { ja: 'お品書き', en: 'Menu' };
  $scope.menuList = getJSON.get('./public/menu-list.json');
  console.log($scope.menuList);

  // トラッキング
  (() => {
    const $elem = document.getElementById('sidebar');
    window.addEventListener('scroll', (e) => {
      const position = e.target.scrollingElement.scrollTop;
      const elemH = $elem.scrollHeight;
      const contentH = document.body.scrollHeight - document.querySelector('.global-footer').clientHeight - 20;
      console.log(position + elemH, contentH)
      if(position + 80 > contentH - elemH) {
        $elem.style.position = 'absolute';
        $elem.style.top = `${contentH - elemH}px`;
      } else if(position > 270) {
        $elem.style.position = 'fixed';
        $elem.style.top = '80px';
      } else {
        $elem.style.position = 'static';
      }
    })
  })();
}]);

app.controller('newsCtrl', ['$scope', 'getJSON', ($scope, getJSON) => {
  $scope.headerBg = './assets/img/header/news.jpg';
  $scope.pageName = { ja: 'おしらせ', en: 'News' };

  // $scope.articles = getJSON.get();
  // $scope.categories = getJSON.get();

  $scope.dateFormat = function(date) {
    var m = moment(date);
    return m.format('YYYY/MM/DD');
  }
  $scope.timeFormat = function(time) {
    var m = moment(time, 'hh:mm:ss');
    return m.format('hh:mm A');
  }
}]);