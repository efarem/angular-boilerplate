function todoFactory($http) {
  const API = '//jsonplaceholder.typicode.com/todos/';

  const create = (todo) => $http.post(API, todo).then((response) => response.data);
  const retrieve = () => $http.get(API).then((response) => response.data.slice(0, 10));
  const update = (todo) => $http.put(API + todo.id).then((response) => response.data);
  const remove = (todo) => $http.delete(API + todo.id).then((response) => response.data);

  return {
    create,
    retrieve,
    update,
    remove,
  };
}

angular
  .module('app')
  .factory('todoFactory', todoFactory);
