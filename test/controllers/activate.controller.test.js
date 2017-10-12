describe('activateCtrl', function() {
    var createController, scope, authentication, activateAccount;

    beforeEach(module('meanApp'));
    beforeEach(inject(function($controller, $rootScope){
        scope = $rootScope.$new();
        mockAuth();
        createController = function() {
            return $controller('activateCtrl', {
                '$scope': scope
            });
        };
        function mockAuth() {
            authentication = jasmine.createSpyObj('authentication', ['activateAccount']);
        }
    }));

    it('activate account', function () {
        var controller = createController();
        //authentication.activateAccount('test');
    });
});

describe('confirmationCtrl', function() {

    beforeEach(module('meanApp'));

    var createController, location;

    beforeEach(inject(function($controller){
        mockLocation();
        createController = function() {
            return $controller('confirmationCtrl', {
                '$location': location
            });
        };
        function mockLocation() {
            location = jasmine.createSpyObj('location', ['path']);
        }
    }));

    it('check if location.path is "/"', function () {
        var controller = createController();
        controller.backToOsmos();
        expect(location.path).toHaveBeenCalledWith('/');
    });
});