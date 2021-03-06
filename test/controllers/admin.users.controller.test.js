describe('adminUsersCtrl', function() {
    beforeEach(module('meanApp'));

    var createController, scope, userRequestHandler, $httpBackend, profileRequestHandler, toastRequestHandler;

    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond();
        userRequestHandler = $httpBackend.when('GET', '/api/user').respond();
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        createController = function() {
            return $controller('adminUsersCtrl', {
                '$scope': scope
            });
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('get data', function () {
        var controller = createController();

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/user');

        $httpBackend.flush();
    });

    it('get data failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        userRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/user');
        $httpBackend.expectGET('/common/templates/toast-template.html');

        $httpBackend.flush();
    });
});