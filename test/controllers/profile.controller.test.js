describe('profileCtrl', function() {
    beforeEach(module('meanApp'));

    var createController, scope, $httpBackend, routeParams, profileRequestHandler, showProfileRequestHandler, toastRequestHandler;

    beforeEach(inject(function($controller, $rootScope, _$httpBackend_){
        scope = $rootScope.$new();
        mockRouteParams();
        $httpBackend = _$httpBackend_;
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond();
        showProfileRequestHandler = $httpBackend.when('GET', '/api/profile/test').respond();
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        function mockRouteParams() {
            routeParams = jasmine.createSpy('$routeParams');
        }

        routeParams.id = 'test';
        expect(routeParams.id).toBe('test');

        createController = function() {
            return $controller('profileCtrl', {
                '$scope': scope,
                '$routeParams': routeParams
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
        $httpBackend.expectGET('/api/profile/test');

        $httpBackend.flush();
    });

    it('get data failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        showProfileRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/profile/test');
        $httpBackend.expectGET('/common/templates/toast-template.html');

        $httpBackend.flush();
    });

    it('get country', function () {
        var controller = createController();

        expect(controller.getCountry("NO")).toEqual("Norway");

        $httpBackend.flush();
    });
});