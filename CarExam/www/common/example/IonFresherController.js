(function () {
    'use strict';
    angular.module('CarExam').controller('IonFresherController',
        function ($rootScope, $scope, $state, $ionicPopup, $log, $q, APPConfig, $timeout) {

            $scope.items = ['Item 1', 'Item 2', 'Item 3'];
            //@emacs: ion-refresh and controller
            $scope.doRefresh = function () {

                console.log('Refreshing!');
                $timeout(function () {
                    //simulate async response
                    $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);

                    //Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');

                }, 1000);

            };


        });
})();