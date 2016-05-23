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
  };

  beforeEach(module('app'));
  beforeEach(inject(($controller, _$rootScope_, _$q_, _todoFactory_) => {
    todoFactory = _todoFactory_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    ctrl = $controller('todoCtrl', { todoFactory: mockFactory });

    $rootScope.$digest();
  }));

  it('should have a populated list of todos', () => {
    expect(ctrl.list.length).toBeGreaterThan(0);
  });

  it('todo should have title property', () => {
    expect(ctrl.list[0].title).toBeDefined();
  });

  it('todo should have id property', () => {
    expect(ctrl.list[0].id).toBeDefined();
  });

  it('should display remaining todos that are uncompleted', () => {
    expect(ctrl.getRemaining().length).toBe(10);
  });

  it('should add new todo to list', () => {
    expect(ctrl.getRemaining().length).toBe(10);
    ctrl.newTodo = 'todo test title';
    ctrl.addTodo();
    $rootScope.$digest();
    expect(ctrl.getRemaining().length).toBe(11);
  });

  it('should remove todo from list', () => {
    expect(ctrl.getRemaining().length).toBe(11);
    ctrl.removeTodo();
    $rootScope.$digest();
    expect(ctrl.getRemaining().length).toBe(10);
  });
});
