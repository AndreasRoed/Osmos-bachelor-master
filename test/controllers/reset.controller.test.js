describe('resetCtrl', function() {
    var $rootScope, createController;


    // Set up the module
    beforeEach(module('meanApp'));
    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');

        createController = function () {
            return $controller('resetCtrl', {
                '$scope' : $rootScope
            });
        };
    }));

    it('check password', function() {
        var controller = createController();

        controller.credentials.password = "avd";
        controller.credentials.repeatPassword = "avd";
        expect(controller.checkPw()).toEqual(true);

        controller.credentials.password = "avd";
        controller.credentials.repeatPassword = "avad";
        expect(controller.checkPw()).toEqual(false);

        controller.credentials.password = "";
        controller.credentials.repeatPassword = "";
        expect(controller.checkPw()).toEqual(false);
    });
});