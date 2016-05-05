function config($httpProvider, $compileProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'app/views/index.html',
			controller: todoCtrl,
			controllerAs: 'todo'
		});

	$urlRouterProvider.otherwise('/');

	$httpProvider.useApplyAsync(true);
	$compileProvider.debugInfoEnabled(false);

}

angular
	.module('todo-app')
	.config(config);
