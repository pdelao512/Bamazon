//node module
var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');
// var colors = require('colors/safe');
var Table = require('cli-table');
var chalk = require('chalk');
// var firstRun = require('first-run');
var figlet = require('figlet');

//sql connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'Bamazon',
});

//global variables
var shoppingCart = [];
var totalCost = 0;

// Use figlet to create Bamazon logo
figlet.text(' Bamazon', {
    font: 'doh',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(chalk.rgb(66,212,244)(data));
});

//connect to mysql and then run the main function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    printItems(function() {
        userSelectsItem();
    });
});

//function to print all items to the console, uses npm module cli-table
function printItems(cb) {
    //new cli-table
    var table = new Table({
        head: ['ID Number', 'Product', 'Department', 'Price', 'Quantity Available'],
        style: {
        	head: ["magenta"],
        	compact: false,
        	colAligns: ["center"],
        }
    });
    //get all rows from the Products table
    connection.query('SELECT * FROM Products', function(err, res) {
        if (err) throw err;
        //add all of the rows to the cli-table
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].ItemID, res[i].ProductName, res[i].DepartmentName, '$' + res[i].Price.toFixed(2), res[i].StockQuantity]);
        }
        //log the table to the console
        console.log(table.toString());
        //callback the userSelectsItems function to prompt the user to add items to cart
        cb();
    });
}

//function to prompt users to add items to their cart
function userSelectsItem() {
    var items = [];
    //get all product names from the Products table
    connection.query('SELECT ProductName FROM Products', function(err, res) {
        if (err) throw err;
        //push all product names into the item array
        for (var i = 0; i < res.length; i++) {
            items.push(res[i].ProductName)
        }
        //prompt the user to select items from the items array
        inquirer.prompt([{
            name: 'choices',
            type: 'checkbox',
            message: 'Which products would you like to add to your cart? Press the space key to choose each Product and press enter when you are finished.',
            choices: items
        }]).then(function(user) {
            //alert the user if they did not select anything and run function again
            if (user.choices.length === 0) {
                console.log(chalk.red('Oops you didn\'t select anything!'));
                //if the user doesn't select anything ask if they want to keep shopping or leave
                inquirer.prompt([{
                    name: 'choice',
                    type: 'list',
                    message: 'Your cart is empty. Would you like to continue shopping or exit?',
                    choices: ['Continue Shopping', 'Exit']
                }]).then(function(user) {
                    //if keep shopping is selected print the items and prompt the user to select items again
                    if (user.choice === 'Continue Shopping') {
                        printItems(function() {
                            userSelectsItem();
                        });
                    } else {
                        //if leave is selected exit the program
                        console.log(chalk.cyan('Thank You! Come Again!'));
                        connection.end();
                    }
                });
            } else {
                //run the howManyItems function with all of the items the user selected as an argument
                howManyItems(user.choices)
            }
        });
    });
}

//function to prompt the user as to how many of each item they want
function howManyItems(itemNames) {
    //set item equal to the first element of the array and remove that element from the array
    var item = itemNames.shift();
    var itemStock;
    var department;
    //query mysql to get the current stock, price, and department of the item
    connection.query('SELECT StockQuantity, Price, DepartmentName FROM Products WHERE ?', {
        ProductName: item
    }, function(err, res) {
        if (err) throw err;
        //set stock, price, and department in a variable
        itemStock = res[0].StockQuantity;
        itemCost = res[0].Price;
        department = res[0].DepartmentName;
    });
    //prompt the user to ask how many of the item they would like
    inquirer.prompt([{
        name: 'amount',
        type: 'text',
        message: 'How many ' + item + ' would you like to purchase?',
        //validate that the user input is a number and we have that much of the item in stock
        validate: function(str) {
            if (parseInt(str) <= itemStock) {
                return true
            } else {
                //if we don't have that much in stock alert the user and ask for input again
                console.log(chalk.magenta('\nOops! We only have ' + itemStock + ' of those in stock.'));
                return false;
            }
        }
    }]).then(function(user) {
        var amount = user.amount;
        //create an object for the item and push it to the shoppingCart
        shoppingCart.push({
            item: item,
            amount: amount,
            itemCost: itemCost,
            itemStock: itemStock,
            department: department,
            total: itemCost * amount
        });
        //if there are still items in the itemNames array run the function again
        if (itemNames.length != 0) {
            howManyItems(itemNames);
        } else {
            //if no items remain in the itemNames array run the checkout function
            checkout();
        }
    });
}

//function that allows user to edit shoppingCart before checkout and updating database
function checkout() {
    //ensure there are items in the shoppingCart
    if (shoppingCart.length != 0) {
        var grandTotal = 0;
        //show the user all of the items in their shoppingCart
        console.log('---------------------------------------------');
        console.log(chalk.blueBright('Here is your cart. Are you ready to checkout?'));
        for (var i = 0; i < shoppingCart.length; i++) {
            var item = shoppingCart[i].item;
            var amount = shoppingCart[i].amount;
            var cost = shoppingCart[i].itemCost.toFixed(2);
            var total = shoppingCart[i].total.toFixed(2);
            var itemCost = cost * amount;
            grandTotal += itemCost;
            console.log(amount + ' ' + item + ' ' + '$' + total);
        }
        //show the total for the entire cart
        console.log('Total: $' + grandTotal.toFixed(2));
        //prompt the user if they are ready to checkout or need to edit the cart
        inquirer.prompt([{
            name: 'checkout',
            type: 'list',
            message: 'Ready to checkout?',
            choices: ['Checkout', 'Edit Cart']
        }]).then(function(res) {
            //if the user is ready to checkout run the updateDB function to update database
            if (res.checkout === 'Checkout') {
                updateDB(grandTotal);
            } else {
                //if the user wants to edit the cart run the edit cart function
                editCart();
            }
        });
    } else {
        //if the shoppingCart is empty alert the user and ask if they want to keep shopping or leave
        inquirer.prompt([{
            name: 'choice',
            type: 'list',
            message: 'Your cart is empty. Would you like to continue shopping or exit?',
            choices: ['Continue Shopping', 'Leave']
        }]).then(function(user) {
            //if keep shopping is selected print the items and prompt the user to select items again
            if (user.choice === 'Continue Shopping') {
                printItems(function() {
                    userSelectsItem();
                });
            } else {
                //if leave is selected exit the program
                console.log(chalk.cyan('Thank You! Come again!'));
                connection.end();
            }
        });

    }
}

//function to update the mysql database, takes grandTotal as an argument since it has already been totalled in checkout function
function updateDB(grandTotal) {
    //set the item to the first object in the shoppingCart array and remove that object from the array
    var item = shoppingCart.shift();
    var itemName = item.item;
    var itemCost = item.itemCost
    var userPurchase = item.amount;
    var department = item.department;
    var departmentTransactionSale = itemCost * userPurchase;
    //query mysql to get the current total sales for the applicable department
    connection.query('SELECT TotalSales from Departments WHERE ?', {
        DepartmentName: department
    }, function(err, res) {
        var departmentTotalSales = res[0].TotalSales;
        //update the department's TotalSales in the database
        connection.query('UPDATE Departments SET ? WHERE ?', [{
            TotalSales: departmentTotalSales += departmentTransactionSale
        }, {
            DepartmentName: department
        }], function(err) {
            if (err) throw err;
        });
    });
    //query mysql to get the current StockQuantity of the item in case it has changed since the user has added the item to shoppingCart
    connection.query('SELECT StockQuantity from Products WHERE ?', {
        ProductName: itemName
    }, function(err, res) {
        var currentStock = res[0].StockQuantity;
        //update the StockQuantity in the database
        connection.query('UPDATE Products SET ? WHERE ?', [{
            StockQuantity: currentStock -= userPurchase
        }, {
            ProductName: itemName
        }], function(err) {
            if (err) throw err;
            //if there are still items in the shoppingCart run the function again
            if (shoppingCart.length != 0) {
                updateDB(grandTotal);
            } else {
                //if no items remain in the shoppingCart alert the user of the total and exit
                grandTotal = grandTotal.toFixed(2);
                console.log(chalk.blueBright('Thank You! Come Again!'));
                console.log(chalk.greenBright('Your total today was $' + grandTotal));
                connection.end();
            }
        });
    });
}

//function to edit the shoppingCart
function editCart() {
    //push all product names of the items in the shoppingCart to an array
    var items = [];
    for (var i = 0; i < shoppingCart.length; i++) {
        var item = shoppingCart[i].item;
        items.push(item);
    }
    //prompt the user to select which items from the array they would like to edit
    inquirer.prompt([{
        name: 'choices',
        type: 'checkbox',
        message: 'Select the items you would like to edit.',
        choices: items
    }]).then(function(user) {
        if (user.choices.length === 0) {
            console.log(chalk.magenta('Oops! You didn\'t select anything to edit!'));
            checkout();
        } else {
            //run the editItem function and pass in the users selections as an argument
            var itemsToEdit = user.choices;
            editItem(itemsToEdit);
        }
    });
}

//function to edit individual items that the user selects to edit
function editItem(itemsToEdit) {
    //ensure that there are items to edit
    if (itemsToEdit.length != 0) {
        //set item to the first element in the array and remove that element from the array
        var item = itemsToEdit.shift();
        //ask the user if they would like to remove the item from the cart or edit the quantity
        inquirer.prompt([{
            name: 'choice',
            type: 'list',
            message: 'Would you like to remove ' + item + ' from your cart entirely or change the quantity?',
            choices: ['Remove From Cart', 'Change Quanity']
        }]).then(function(user) {
            //if remove from cart is selected remove the item from the shoppingCart array
            if (user.choice === 'Remove From My Cart') {
                for (var i = 0; i < shoppingCart.length; i++) {
                    if (shoppingCart[i].item === item) {
                        shoppingCart.splice(i, 1);
                        console.log(chalk.yellow('Updated!'));
                    }
                }
                //run the editItem function to check if there are more items to edit
                editItem(itemsToEdit);
            } else {
                //if change quantity is selected ask the user what they would like to change the quantity to
                inquirer.prompt([{
                    name: 'amount',
                    type: 'text',
                    message: 'How many ' + item + ' would you like to purchase?',
                }]).then(function(user) {
                    //update the shoppingCart with the new quantity
                    for (var i = 0; i < shoppingCart.length; i++) {
                        if (shoppingCart[i].item === item) {
                            shoppingCart[i].amount = user.amount;
                            shoppingCart[i].total = shoppingCart[i].itemCost * user.amount;
                            console.log(chalk.yellow('Updated!'));
                        }
                    }
                    //run the editItem function to check if there are more items to edit
                    editItem(itemsToEdit);
                });
            }
        });
    } else {
        //if no items remain to be edited run the checkout function
        checkout();
    }
}
