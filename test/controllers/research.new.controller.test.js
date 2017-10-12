describe('researchNewCtrl', function() {
    beforeEach(module('meanApp'));

    var createController, scope, $httpBackend, tagRequestHandler, profileRequestHandler, typesRequestHandler, toastRequestHandler;

    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond();
        tagRequestHandler = $httpBackend.when('GET', '/api/tag').respond();
        typesRequestHandler = $httpBackend.when('GET', '/api/criteria/types').respond();
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        createController = function() {
            return $controller('researchNewCtrl', {
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
        $httpBackend.expectGET('/api/tag');
        $httpBackend.expectGET('/api/criteria/types');

        $httpBackend.flush();
    });

    it('get data failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        tagRequestHandler.respond(401, {message: 'error'});
        typesRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/tag');
        $httpBackend.expectGET('/api/criteria/types');
        $httpBackend.expectGET('/common/templates/toast-template.html');

        $httpBackend.flush();
    });
});