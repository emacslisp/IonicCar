// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// @emacs: new angular module
var app = angular.module('CarExam', ['ionic']);

//@emacs: state with templateUrl and controller
app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
   
    $stateProvider.state('Question', {
        url: "/Question",
        templateUrl: "common/component/Question.html",
        controller: 'QuestionController'
    })
    .state('Init', {
        url: "/init",
        templateUrl: "common/component/InitController/Init.html",
        controller: 'InitController'
    })
    .state('IonicForm', {
        url: "/IonicForm",
        templateUrl: "common/example/IonicForm.html",
        controller: 'IonicFormController'
    })
    .state('IonFresher', {
        url: "/IonFresher",
        templateUrl: "common/example/IonRefresher.html",
        controller: 'IonFresherController'
    })
    //.state('step3', {
    //    url: "/step3",
    //    data: {
    //        step: 3
    //    },
    //    templateUrl: "templates/step3.html",
    //    controller: 'Step3Ctrl'
    //})
    //.state('done', {
    //    url: "/done",
    //    data: {
    //        step: 4
    //    },
    //    templateUrl: "templates/done.html",
    //    controller: 'DoneCtrl'
    //});
    $urlRouterProvider.otherwise("/IonFresher");
});

// @emacs - APPConfig: angular module's constant
app.constant('APPConfig', {
    ClientApplicationVersion: '1.1',
    LOCALE: 'en_AU',
    AppState: {
        INITIALISED: 'INITIALISED',
        PENDING_ENROLMENT: 'PENDING_ENROLMENT',
        ENROLLED: 'ENROLLED'
    },
});


/*
@todo: sqlite insert and update date.
http://ngcordova.com/docs/plugins/sqlite/
*/

/*
database design for question and picture and so on

user table:

session table:
user and session id

*/


