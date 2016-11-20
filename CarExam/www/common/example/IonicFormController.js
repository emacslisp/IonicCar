(function () {
    'use strict';
    angular.module('CarExam').controller('IonicFormController',
        function ($rootScope, $scope, $state, $ionicPopup, $log, $q) {

            $scope.redirectTo = function () {
                alert('test');
            }
        });
})();