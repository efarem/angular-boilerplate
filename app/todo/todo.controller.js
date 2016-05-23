function todoCtrl(todoFactory) {
  this.newTodo = '';
  this.list = [];

  const getTodos = () => {
    todoFactory
      .retrieve()
      .then((response) => {
        this.list = response;
      });
  };
  this.getTodos = getTodos;

  const addTodo = () => {
    if (!this.newTodo) {
      return;
    }
    todoFactory
      .create({
        title: this.newTodo,
        completed: false,
      })
      .then((response) => {
        this.list.unshift(response);
        this.newTodo = '';
      });
  };
  this.addTodo = addTodo;

  const removeTodo = (item, index) => {
    todoFactory
      .remove(item)
      .then(() => {
        this.list.splice(index, 1);
      });
  };
  this.removeTodo = removeTodo;

  const getRemaining = () => this.list.filter((item) => !item.completed);
  this.getRemaining = getRemaining;

  const updateTodo = (item, index) => {
    if (!item.title) {
      this.removeTodo(item, index);
      return;
    }
    todoFactory
      .update(item);
  };
  this.updateTodo = updateTodo;

  const toggleState = (item) => {
    todoFactory
      .update(item)
      .then(() => {

      }, () => {
        item.completed = !item.completed;
      });
  };
  this.toggleState = toggleState;

  getTodos();
}

angular
    .module('app')
    .controller('todoCtrl', todoCtrl);
