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

}]);

app.controller('navbarCtrl', ['$scope', ($scope) => {

}]);

app.controller('footerCtrl', ['$scope', ($scope) => {

}]);

app.controller('indexCtrl', ['$scope', 'info', 'menuList', ($scope, info, menuList) => {
  $scope.viewsIndexHeader = '/common/index-header.html';
  $scope.menuList = menuList.get();
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


app.controller('menuCtrl', ['$scope', 'menuList', function($scope, menuList) {
  $scope.headerBg = '../assets/img/header/menu.jpg';
  $scope.pageName = { ja: 'お品書き', en: 'Menu' };
  $scope.menuList = menuList.get();
  console.log($scope.menuList);
}]);