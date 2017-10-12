describe('searchCtrl', function() {
    var $httpBackend, $rootScope, authentication, createController, searchRequestHandler, toastRequestHandler, profileRequestHandler;


    // Set up the module
    beforeEach(module('meanApp'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond({firstname: 'test'});
        searchRequestHandler = $httpBackend.when('GET', '/api/user/search').respond();
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        $rootScope = $injector.get('$rootScope');
        authentication = $injector.get('authentication');
        var $controller = $injector.get('$controller');

        createController = function () {
            return $controller('searchCtrl', {
                '$scope' : $rootScope
            });
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('get profile', function () {
        var controller = createController();

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/user/search');

        $httpBackend.flush();
    });

    it('get profile failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        searchRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/user/search');
        $httpBackend.expectGET('/common/templates/toast-template.html');

        $httpBackend.flush();
    });
});