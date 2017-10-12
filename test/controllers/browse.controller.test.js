describe('browseCtrl', function() {
    var $httpBackend, $rootScope, createController, toastRequestHandler, profileRequestHandler, researchRequestHandler, projectRequestHandler, userRequestHandler, industryRequestHandler, functionRequestHandler, regionRequestHandler, typesRequestHandler, tagRequestHandler;
    
    // Set up the module
    beforeEach(module('meanApp'));
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond({firstname: 'test'});
        researchRequestHandler = $httpBackend.when('GET', '/api/research/browse').respond({firstname: 'test'});
        projectRequestHandler = $httpBackend.when('GET', '/api/project/browse').respond({firstname: 'test'});
        userRequestHandler = $httpBackend.when('GET', '/api/user/search').respond({firstname: 'test'});
        industryRequestHandler = $httpBackend.when('GET', '/api/tag').respond({firstname: 'test'});
        functionRequestHandler = $httpBackend.when('GET', '/api/criteria/industry').respond({firstname: 'test'});
        regionRequestHandler = $httpBackend.when('GET', '/api/criteria/function').respond({firstname: 'test'});
        typesRequestHandler = $httpBackend.when('GET', '/api/criteria/region').respond({firstname: 'test'});
        tagRequestHandler = $httpBackend.when('GET', '/api/criteria/types').respond({firstname: 'test'});
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');

        createController = function() {
            return $controller('browseCtrl', {'$scope' : $rootScope });
        };
    }));
    
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch data', function() {
        var controller = createController();

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/research/browse');
        $httpBackend.expectGET('/api/project/browse');
        $httpBackend.expectGET('/api/user/search');
        $httpBackend.expectGET('/api/tag');
        $httpBackend.expectGET('/api/criteria/industry');
        $httpBackend.expectGET('/api/criteria/function');
        $httpBackend.expectGET('/api/criteria/region');
        $httpBackend.expectGET('/api/criteria/types');

        $httpBackend.flush();

    });

    it('should fail to fetch data', function() {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        researchRequestHandler.respond(401, {message: 'error'});
        projectRequestHandler.respond(401, {message: 'error'});
        userRequestHandler.respond(401, {message: 'error'});
        industryRequestHandler.respond(401, {message: 'error'});
        functionRequestHandler.respond(401, {message: 'error'});
        regionRequestHandler.respond(401, {message: 'error'});
        typesRequestHandler.respond(401, {message: 'error'});
        tagRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/research/browse');
        $httpBackend.expectGET('/api/project/browse');
        $httpBackend.expectGET('/api/user/search');
        $httpBackend.expectGET('/api/tag');
        $httpBackend.expectGET('/api/criteria/industry');
        $httpBackend.expectGET('/api/criteria/function');
        $httpBackend.expectGET('/api/criteria/region');
        $httpBackend.expectGET('/api/criteria/types');

        $httpBackend.flush();
    });
    
    it('checking functions', function() {

        var controller = createController();

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/research/browse');
        $httpBackend.expectGET('/api/project/browse');
        $httpBackend.expectGET('/api/user/search');
        $httpBackend.expectGET('/api/tag');
        $httpBackend.expectGET('/api/criteria/industry');
        $httpBackend.expectGET('/api/criteria/function');
        $httpBackend.expectGET('/api/criteria/region');
        $httpBackend.expectGET('/api/criteria/types');

        $httpBackend.flush();

        controller.industriesSelected = true;
        controller.functionsSelected = true;
        controller.regionsSelected = true;
        controller.typesSelected = true;

        controller.industries = [{_id:'1'},{_id:'2'},{_id:'3'}];
        controller.functions = [{_id:'1'},{_id:'2'},{_id:'3'}];
        controller.regions = [{_id:'1'},{_id:'2'},{_id:'3'}];
        controller.types = [{_id:'1'},{_id:'2'},{_id:'3'}];

        controller.selectAllFunctions();
        controller.selectAllIndustries();
        controller.selectAllRegions();
        controller.selectAllTypes();

        expect(controller.checkIndustry).toEqual(['1','2','3']);
        expect(controller.checkFunction).toEqual(['1','2','3']);
        expect(controller.checkRegion).toEqual(['1','2','3']);
        expect(controller.checkTypes).toEqual(['1','2','3']);

        controller.tags = [{name:"test"}, {name:"other"}];

        controller.filteredTagsAutoComplete("te");

        expect(controller.getCountry("NO")).toEqual("Norway");
    });
});