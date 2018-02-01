/*
Test driven development
 : write code first to pass
   then, run the test to find an error
   finally, correct the code to pass
*/

/*

1. Mocha install

npm install -g mocha

2. "test" file must be created.

mkdir test
 

3. Example

	describe ("printName()", () => {

    it("should print the last name first")

});

4. To do test driven development Mocha must be with "chai"
   => "chai" give us to check the value.

   npm install chai --save-dev

   // The reason we install chai in local is because
   // chai has dependancy on "dev" where it runs and tests specific application packages
   // we are running and working on. 

   (sorry for Korean)
5. Assert: 치명적인 오류를 발생 시키고 해당 Test함수를 종료 시킨다.
            그러나 다른 테스트 함수는 실행 시킨다.
            "English : She continued to assert that she was innocent"
   Expect: 오류를 발생 시키고 이어서 Test함수를 실행 시킨다.


6. nock module: it is simply a way to fast test when we have to get the large app.
   For instance, we are required to access the Wikipedia web and it takes long time to load access the Wikipedia server
   and load the data from it.

   "nock" which is npm module provides the alternative solution.
   It creates a mock Wikipedia by usint local web server and test the module we creates based on the mock Wikipedia.

    npm install nock --save-dev

7. mocha hook 

    before and after


*/

// We are going to use expect function for the chai search engine.
// Please find the explanation above.
var expect = require("chai").expect;

// It assigns the directory where "printName()" module is stored.
// The directory must be out of the test folder in the "lib/tools"
// So we need to create a "lib" folder and store a "tools.js" file in it 
// where printName() is running.

var tools = require("../lib/tools");

var nock = require("nock");

/*
// The first code
describe ("printName()", () => {

    it("should print the last name first", () => {

        // Here, the testing code about "printName()" must be created.
        // So we can invoke the item we are testing.

        // "tools.printName" : it indicates direcory under "tools" defined above.
        // It is an input
        var results = tools.printName({ first: 'Alex', last: 'Bank'});
        
        // The result is expected like this.
        expect(results).to.equal('Bank, Alex');


    });

});
*/

describe ("Tools", () => {


    
    describe ("printName()", () => {

        it("It should print the last name first.", () => {

            var results = tools.printName({ first: 'Alex', last: 'Bank'});
            expect(results).to.equal("Bank, Alex");
        });

    });
    

    describe ("loadWiki()", () => {

        // Just make sure again that the interval for the waiting on the result is 2000
        // If the interval is more than 2000 seconds, it generates an error.
        // Therefore, timeout function is required for the heavy app or result.
        // "this": mocha object. "this" represents the top level of the hiararchy.
        
        //this.timeout(5000);
        
        // It is before the "it" statement is executed. 
        before (() => {

            // It accesses Wikipedia website
            nock("https://en.wikipedia.org").
            
            // making the route as we did in express
            get("/wiki/Abraham_Lincoln").

            // and defining 200 sucessful requests and having the entire webpage and its name 
            reply(200, "Abraham Lincoln page");


        });

        it("It should have Abraham Lincoln's Wikipedia page", () => {

           tools.loadWiki({ first: 'Abraham', last: 'Lincoln'}, (done) => {

          // tools.loadWiki({ first: 'Abraham', last: 'Lincoln'}, () => {


                // callback function here: it is an asynchronous function.
                // Error finding executed asynchronously.
                
                // "html" makes it sure that the "html" variable exists.
                // So this code has the "expect(html)" function invoked, then the html variable is returned
                // and then we have the html variable.
                
                /*
                //(1)
                expect(html).to.be.ok;
                */

                // When we have the mock local server
                expect(html).to.equal("Mock Abraham Lincoln Page");
                
                // It is associated with the argument of callback function above.
                /* ****** It is because of "asynchronous" callback function.
                    - tools.loadWiki() - a single function
                    - In the "tools.loadWiki()", the second argument is a function wthich is callback.
                    - The script here does not wait for the result of the first arguemtn ({first: Abraham, last: Lincoln})
                    - It goes straight to the second argument, the callback function.
                    - In result, we can not see the pending issue in Mocha because it just pass through the first argument.
                    - In order to avoid the asynchronous issue, we need to use "done()" method and argument.
                    [FYI] The waiting time is 2 seconds in default.
                */    
                done();
                

            });
        });            
    });
});