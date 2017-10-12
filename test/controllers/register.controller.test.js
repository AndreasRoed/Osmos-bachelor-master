describe('industrialRegCtrl', function() {

    beforeEach(module('meanApp'));

    var createController, scope, authentication, $httpBackend;

    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        authentication = _authentication_;
        $httpBackend = _$httpBackend_;
        createController = function() {
            return $controller('industrialRegCtrl', {
                '$scope': scope
            });
        };
    }));
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('expects tab1 to be true, rest false', function() {
        var controller = createController();

        controller.regStart();

        expect(controller.tab1).toEqual(true);
        expect(controller.tab2).toEqual(false);
        expect(controller.tab3).toEqual(false);
    });

    it('expects tab2 to be true, rest false', function() {
        var controller = createController();

        controller.tab1click();

        expect(controller.tab1).toEqual(false);
        expect(controller.tab2).toEqual(true);
        expect(controller.tab3).toEqual(false);
    });

    it('passwords must match and not empty', function() {
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

    it('submit no error', function() {
        var controller = createController();

        var expectedRequest = {
            firstname : "",
            lastname : "",
            companyname : "test",
            email : "test@test.test",
            country : "",
            city : "",
            about : "",
            born : "",
            subscription : "false",
            gender : "",
            zipcode : "",
            phone : "",
            address : "",
            password : "",
            repeatPassword : "",
            industrial : "true",
            academic : "false",
            job_place : "",
            job_title : ""
        };

        $httpBackend.expectPOST('/api/register', expectedRequest).respond(200, '');

        controller.credentials.companyname = 'test';
        controller.credentials.email = 'test@test.test';

        controller.onSubmit();

        $httpBackend.flush();

    });

});

describe('academicRegCtrl', function() {

    beforeEach(module('meanApp'));

    var createController, scope, authentication, $httpBackend;

    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        authentication = _authentication_;
        $httpBackend = _$httpBackend_;
        createController = function() {
            return $controller('academicRegCtrl', {
                '$scope': scope
            });
        };
    }));
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('expects tab1 to be true, rest false', function() {
        var controller = createController();

        controller.regStart();

        expect(controller.tab1).toEqual(true);
        expect(controller.tab2).toEqual(false);
        expect(controller.tab3).toEqual(false);
    });

    it('expects tab2 to be true, rest false', function() {
        var controller = createController();

        controller.tab1click();

        expect(controller.tab1).toEqual(false);
        expect(controller.tab2).toEqual(true);
        expect(controller.tab3).toEqual(false);
    });

    it('expects tab3 to be true, rest false', function() {
        var controller = createController();

        controller.tab2click();

        expect(controller.tab1).toEqual(false);
        expect(controller.tab2).toEqual(false);
        expect(controller.tab3).toEqual(true);
    });

    it('passwords must match and not empty', function() {
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

    it('submit no error', function() {
        var controller = createController();

        var expectedRequest = {
            firstname : "test",
            lastname : "testing",
            companyname : "",
            email : "test@test.test",
            country : "",
            city : "",
            about : "",
            born : "",
            subscription : "false",
            gender : "",
            zipcode : "",
            phone : "",
            address : "",
            password : "",
            repeatPassword : "",
            industrial : "false",
            academic : "true",
            job_place : "",
            job_title : ""
        };

        $httpBackend.expectPOST('/api/register', expectedRequest).respond(200, '');

        controller.credentials.firstname = 'test';
        controller.credentials.lastname = 'testing';
        controller.credentials.email = 'test@test.test';

        controller.onSubmit();

        $httpBackend.flush();

    });
});