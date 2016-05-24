describe('todoCtrl', () => {
  const mockFactory = {
    retrieve() {
      return $q.when(mockTodos);
    },
    create(todo) {
      return $q.when(todo);
    },
    remove() {
      return $q.when(0);
    },
    update(todo) {
      return $q.when(todo);
    },
  };

  beforeEach(module('app'));
  beforeEach(inject(($controller, _$rootScope_, _$q_, _todoFactory_) => {
    todoFactory = _todoFactory_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    ctrl = $controller('todoCtrl', { todoFactory: mockFactory });

    $rootScope.$apply();
  }));

  it('should have a populated list of todos', () => {
    expect(ctrl.list.length).toBeGreaterThan(0);
  });

  it('todos should have title property', () => {
    for (let i = 0; i < ctrl.list.length; i++) {
      expect(ctrl.list[0].title).toBeDefined();
    }
  });

  it('should display remaining todos that are uncompleted', () => {
    expect(ctrl.getRemaining().length).toBe(10);
  });

  it('should add new todo to list', () => {
    expect(ctrl.getRemaining().length).toBe(10);
    ctrl.newTodo = 'todo test title';
    ctrl.addTodo();
    $rootScope.$apply();
    expect(ctrl.getRemaining().length).toBe(11);
  });

  it('should remove todo from list', () => {
    expect(ctrl.getRemaining().length).toBe(11);
    ctrl.removeTodo();
    $rootScope.$apply();
    expect(ctrl.getRemaining().length).toBe(10);
  });

  it('should toggle the completed state of a todo', () => {
    expect(ctrl.list[0].completed).toBe(false);
    ctrl.list[0].completed = true;
    ctrl.toggleState(ctrl.list[0]);
    $rootScope.$apply();
    expect(ctrl.list[0].completed).toBe(true);
  });
});
