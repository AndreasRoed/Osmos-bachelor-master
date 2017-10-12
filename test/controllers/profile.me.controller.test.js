describe('profileMeCtrl', function() {
    beforeEach(module('meanApp'));

    var createController, scope, $httpBackend, profileRequestHandler, toastRequestHandler;

    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond({firstname: 'test'});
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        createController = function() {
            return $controller('profileMeCtrl', {
                '$scope': scope
            });
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('check password', function() {
        var controller = createController();

        controller.password.newPassword = "avd";
        controller.password.repeatNewPassword = "avd";
        expect(controller.checkPw()).toEqual(true);

        controller.password.newPassword = "avd";
        controller.password.repeatNewPassword = "avad";
        expect(controller.checkPw()).toEqual(false);

        controller.password.newPassword = "";
        controller.password.repeatNewPassword = "";
        expect(controller.checkPw()).toEqual(false);

        $httpBackend.flush();
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