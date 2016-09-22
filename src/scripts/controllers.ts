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