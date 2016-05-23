describe('todoFactory', () => {
  const API = '//jsonplaceholder.typicode.com/todos/';

  beforeEach(module('app'));
  beforeEach(inject((_$httpBackend_, _todoFactory_) => {
    $httpBackend = _$httpBackend_;
    todoFactory = _todoFactory_;
  }));

  it('retrieve returns array of todos', () => {
    $httpBackend.when('GET', API).respond(200, mockTodos);
    todoFactory
      .retrieve()
      .then((response) => {
        for (let i = 0; i < response.length; i++) {
          expect(response[i].title).toBeDefined();
        }
      });
    $httpBackend.flush();
  });
});
