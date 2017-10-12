describe('projectNewCtrl', function() {
    beforeEach(module('meanApp'));

    var createController, scope, $httpBackend, industryRequestHandler, tagRequestHandler, functionRequestHandler, profileRequestHandler, regionRequestHandler, toastRequestHandler;

    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond();
        tagRequestHandler = $httpBackend.when('GET', '/api/tag').respond();
        regionRequestHandler = $httpBackend.when('GET', '/api/criteria/region').respond();
        industryRequestHandler = $httpBackend.when('GET', '/api/criteria/industry').respond();
        functionRequestHandler = $httpBackend.when('GET', '/api/criteria/function').respond();
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        createController = function() {
            return $controller('projectNewCtrl', {
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
        $httpBackend.expectGET('/api/criteria/region');
        $httpBackend.expectGET('/api/criteria/industry');
        $httpBackend.expectGET('/api/criteria/function');

        $httpBackend.flush();
    });

    it('get data failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        tagRequestHandler.respond(401, {message: 'error'});
        regionRequestHandler.respond(401, {message: 'error'});
        industryRequestHandler.respond(401, {message: 'error'});
        functionRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/tag');
        $httpBackend.expectGET('/api/criteria/region');
        $httpBackend.expectGET('/api/criteria/industry');
        $httpBackend.expectGET('/api/criteria/function');
        $httpBackend.expectGET('/common/templates/toast-template.html');

        $httpBackend.flush();
    });
});