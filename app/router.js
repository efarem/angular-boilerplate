function config($httpProvider, $compileProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('index', {
      url: '/',
      template: '<todo-list></todo-list>',
    });

  $urlRouterProvider.otherwise('/');
  $httpProvider.useApplyAsync(true);
  $compileProvider.debugInfoEnabled(false);
}

angular
  .module('app')
  .config(config);
