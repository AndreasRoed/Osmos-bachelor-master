describe('errorCtrl', function() {
    var location, createController;


    // Set up the module
    beforeEach(module('meanApp'));
    beforeEach(inject(function ($injector) {
        mockLocation();
        var $controller = $injector.get('$controller');

        createController = function () {
            return $controller('errorCtrl', {
                '$location': location
            });
        };
        function mockLocation() {
            location = jasmine.createSpyObj('location', ['path']);
        }
    }));

    it('check if location.path is "help"', function () {
        var controller = createController();
        controller.showHelp();
        expect(location.path).toHaveBeenCalledWith('help');
    });
});