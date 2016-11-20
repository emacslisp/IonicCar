//@emacs: ionic - Create controller for Angular module
(function () {
    'use strict';
    angular.module('CarExam').controller('InitController',
        function ($rootScope, $scope, $state, $ionicPopup, $log, $q,$ionicLoading,DBService,
            $timeout) {

            $scope.redirectTo = function () {
                alert('test');
            }

            var initialise = function () {
                showInitialisation();

                if (window.cordova) {
                    document.addEventListener("deviceready",

                                          function initdeviceready() {
                                              init();
                                              $log.debug('Init called');
                                          },

                                          false);

                } else {
                   var initTimeout = $timeout(function () {
                        init();

                        $timeout.cancel(initTimeout);
                        initTimeout = null;
                    }, 2500);
                }
            };

            var init = function () {
                

                DBService.initDatabase('2.0').then(function (result) {
                    alert('hello world');
                });
            }

            var showInitialisation = function () {
                if (!window.cordova) {
                    $ionicLoading.show({
                        template: 'Initialising CarExam ...'
                    });
                }
                //To keep application running and keep device getting locked
                if (window.plugins != undefined) {
                    $log.log("insomnia.keepAwake");
                    window.plugins.insomnia.keepAwake();
                }
            };

            initialise();
        });
})();