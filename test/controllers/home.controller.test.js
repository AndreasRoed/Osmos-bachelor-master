describe('homeCtrl', function() {
    var $httpBackend, $rootScope, location, authentication, createController, toastRequestHandler, profileRequestHandler;


    // Set up the module
    beforeEach(module('meanApp'));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        mockLocation();
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond({firstname: 'test'});
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        $rootScope = $injector.get('$rootScope');
        authentication = $injector.get('authentication');
        var $controller = $injector.get('$controller');

        spyOn(authentication, 'isLoggedIn').and.returnValue(true);
        expect(authentication.isLoggedIn()).toBe(true);

        createController = function () {
            return $controller('homeCtrl', {
                '$scope' : $rootScope,
                '$location': location
            });
        };
        function mockLocation() {
            location = jasmine.createSpyObj('location', ['path']);
        }
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

    it('check location', function () {
        var controller = createController();

        controller.showAcademic();
        expect(location.path).toHaveBeenCalledWith('register/academic');
        controller.showIndustrial();
        expect(location.path).toHaveBeenCalledWith('register/industrial');

        $httpBackend.flush();
    });
});