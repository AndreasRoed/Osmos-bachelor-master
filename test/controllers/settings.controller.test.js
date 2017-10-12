describe('settingsCtrl', function() {
    var $httpBackend, $rootScope, authentication, createController, toastRequestHandler, profileRequestHandler;


    // Set up the module
    beforeEach(module('meanApp'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond({firstname: 'test'});
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        $rootScope = $injector.get('$rootScope');
        authentication = $injector.get('authentication');
        var $controller = $injector.get('$controller');

        spyOn(authentication, 'isLoggedIn').and.returnValue(true);
        expect(authentication.isLoggedIn()).toBe(true);

        createController = function () {
            return $controller('settingsCtrl', {
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

        $httpBackend.flush();
    });

    it('get profile failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/common/templates/toast-template.html');

        $httpBackend.flush();
    });
});