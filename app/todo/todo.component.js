const todoList = {
  controller: 'todoCtrl as todo',
  templateUrl: 'app/todo/todo.html',
};

angular.module('app')
  .component('todoList', todoList);
