//@emacs: ionic - Create controller for Angular module
(function () {
    'use strict';
    angular.module('CarExam').controller('QuestionController',
        function ($rootScope, $scope, $state, $ionicPopup, $log, $q, APPConfig) {

            $scope.redirectTo = function () {
                //@emacs: ionic - state name - $state.current.name
                console.log($state.current.name);

                alert(APPConfig.ClientApplicationVersion);
            }
        });
    })();