var expect = require("chai").expect;

var rewire = require("rewire");

var order = rewire("../lib/order");

var sinon = require("sinon");


describe("Ordering Items", () => {

    // using callback function, the objects and array are instance data.
    beforeEach(() => {

        // It is a rewire. testData is named to create an object which is a window object with "this"
        this.testData = [

            
            {sku: "AAA", qty: 10},
            {sku: "BBB", qty: 0},
            {sku: "CCC", qty: 3}


        ];

        // spy () : It is to verify that "consoloe.log" is called and functioned.
        // order.js has two console.log functions. So "calledCount" must be 2.
        this.console = {
            log: sinon.spy()
        };


        /**
         * Stubs are the go-to test-double because of their flexibility and convenience. They have all the functionality of spies,
         * but instead of just spying on what a function does, a stub completely replaces it. 
         * In other words, when using a spy, the original function still runs,
         *  but when using a stub, it doesn’t.
         * 
         *  the request is never sent, and we don’t need a server or anything —
         *  we have full control over what happens in our test code!
         * 
         *  [Stub setup]
         * 1. Find the problematic function, such as $.post
           2. Look at how it works so you can mimic it in the test
           3. Create a stub
           4. Set the stub to have the behavior you want in your test
         * 
         * It is really important site to understand spy and stub!!!!!!
         * https://www.sitepoint.com/sinon-tutorial-javascript-testing-mocks-spies-stubs/
         */
        this.warehouse = {

            // the stub to yield. 
            //This means the stub automatically calls the first function passed as a parameter to it. 
            packageAndShip: sinon.stub().yields(10987654321)


        };


        // order from "rewire" double under bar ("__") is required.
        order.__set__("inventoryData", this.testData);

        // setup of the fake console from sinon.spy();
        order.__set__("console", this.console);
    
        // it is sinon.stub(). Therefore warehouse is is a real object of warehouse.js.
        order.__set__("warehouse", this.warehouse);

    });

    //it is an additional test that "istanbul" found I have not tested.
    
    it("Logs 'item not found'", () => {
		order.orderItem("ZZZ", 10);
		expect(this.console.log.calledWith("Item - ZZZ not found")).to.equal(true);
	});

    it("order an tiem when there are enough in stock", (done) => {
        
        // creating mocha object
        // Then, we can use it as defined in "beforeEach" above.
        var _this = this;
        
        // call a function of order.js. The number of arguments must be identified with a function of order.js 
        order.orderItem("CCC", 3, ()=> {    
        
            // receives the object of "console" by using "_this"
            // It calls the console.log twice at this time.
            // It is affected when the failure occurs.
            // For instance, console should be invoked twice; console from mocha and spy()
            // More specifically, console log from mocha is as the following. 
            /**
             * 
             * if (isInStock(sku, quantity)) {
                console.log(`ordering ${quantity} of item # ${sku}`);
                warehouse.packageAndShip(sku, quantity, function (tracking) {
                console.log(`order shipped, tracking - ${tracking}`);
                complete(tracking);
                });
            */
            //
            expect(_this.console.log.callCount).to.equal(2); //==> ok. pass!!!
            
           // expect(_this.console.log.callCount).to.equal(1); // error. fail.
            done();
        
        });

    });

    describe("Warehouse interaction", () => {


        beforeEach( () => {

            this.callback = sinon.spy();

            order.orderItem("CCC", 2, this.callback);

        });

        

        it("receives a tracking number", () => {

            expect(this.callback.calledWith(10987654321)).to.equal(true);

        });

        it("calls packageAndShip with the correct sku and quantity", () => {
            
            expect(this.warehouse.packageAndShip.calledWith("CCC", 2)).to.equal(true);


        });


        

    });

});