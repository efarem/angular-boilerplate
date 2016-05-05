function todoFactory($http) {
	var API = '//jsonplaceholder.typicode.com/todos/';

	const create = (todo) => {
		return $http.post(API, todo).then((response) => {
			console.log(response);
			return response.data;
		});
	};

	const retrieve = () => {
		return $http.get(API).then((response) => {
			console.log(response);
			return response.data.slice(0, 10);
		});
	};

	const update = (todo) => {
		return $http.put(API + todo.id).then((response) => {
			console.log(response);
			return response.data;
		});
	};

	const remove = (todo) => {
		return $http.delete(API + todo.id).then((response) => {
			console.log(response);
			return response.data;
		});
	};

	return {
		create: create,
		retrieve: retrieve,
		update: update,
		remove: remove
	};
}
angular
	.module('todo-app')
	.factory('todoFactory', todoFactory);
