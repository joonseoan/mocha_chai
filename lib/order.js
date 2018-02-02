// "inventoryData": a json file in a data foler
var inventoryData = require('../data/inventory');

var warehouse = require('./warehouse');

//var console = require

function findItem(sku) {

    // map function : "item" here is an array composed of object data
    //                The objects are like this {sku : E501}.
    //                Therefore, "sku" is a subset of item. 
    var i = inventoryData.map(item => item.sku).indexOf(sku);
    
    // In the array, if there is no element inclduing "sku" subject element,
    // it returns "-1"
    if (i === -1) {
        console.log(`Item - ${sku} not found`);
        return null;
    } else {
        return inventoryData[i];
    }
}

function isInStock(sku, qty) {
    var item = findItem(sku);
    return item && item.qty >= qty;
}

function order(sku, quantity, complete) {
    complete = complete || function () {};
    if (isInStock(sku, quantity)) {
        console.log(`ordering ${quantity} of item # ${sku}`);
        warehouse.packageAndShip(sku, quantity, function (tracking) {
            console.log(`order shipped, tracking - ${tracking}`);
            complete(tracking);
        });
        return true;
    } else {
        console.log(`there are not ${quantity} of item '${sku}' in stock`);
        return false;
    }
}

module.exports.orderItem = order;