var https = require("https");

// In this js file, it defines "printName()"" function.

module.exports = {

    // var results = tools.printName({ first: 'Alex', last: 'Bank'});
    // "person" object represents "{ first: 'Alex', last: 'Bank' }".
    // 
    printName(person) {

        return `${person.last}, ${person.first}`;
    },

    // "callback" is a variable of callback function defined in "tools.spec.js"
    // Likewise, var callback = () => {};
    // [FYI] "person" is still an object.
    
    
    loadWiki (person, callback) {
        // Even without the action of "loadWiki()", moch will will pass this function.
        
        var url = `https://en.wikipedia.org/wiki/${person.first}_${person.last}`;

        https.get(url, (res) => {

            var body = '';

            res.setEncoding("UTF-8");


            //It is a way to express your intent if there is something happening (data sent or error in your case),
            // then execute the function added as a parameter. This style of programming is called Event-driven programming. 
            //
            /** 
             * **** eventEmitter.on
             * Adds the listener function to the end of the listeners array for the event named eventName.
             * No checks are made to see if the listener has already been added. 
             * Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
             * 
             * const myEE = new EventEmitter();
                myEE.on('foo', () => console.log('a'));
                myEE.prependListener('foo', () => console.log('b')); // add to the first listening
                myEE.emit('foo');

                // result
                b
                a
             * 
             * */ 

             // When https is connected and the app listen to any data, it executes (chunk function)
             // When it listen to the end event, it executes thd callback function.
            res.on("data", (chunk) => {

                //Whenever it listen to the data, it addes that data in body variable.
                body += chunk;

            });

            res.on("end", () => {

                callback(body);                

            });

        });
      
    }


};