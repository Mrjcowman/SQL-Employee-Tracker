const inquirer = require("inquirer");
const mysql = require("mysql");

// INITIALIZE
// ================================================================

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_db"
});

connection.connect((err)=>{
    if(err) throw err;

    console.log("MySQL Connected with id: "+connection.threadId);
});

// MAIN LOOP
// ================================================================

function queryInput(){
    console.log();
    inquirer.prompt([
        {
            name: "command",
            message: "What would you like to do?",
            type: "list",
            choices: ["Add...", "View...", "Edit...", "Quit"]
        },
        // Type selection
        {
            name: "add",
            message: "What would you like to add?",
            type: "list",
            choices: ["Department", "Role", "Employee", "Nevermind..."],
            when: answers => answers.command=="Add..."
        },
        {
            name: "view",
            message: "What would you like to view?",
            type: "list",
            choices: ["Departments", "Roles", "Employees", "Nevermind..."],
            when: answers => answers.command=="View..."
        },
        {
            name: "edit",
            message: "What would you like to edit?",
            type: "list",
            choices: ["Employee Role", "Employee Manager", "Nevermind..."],
            when: answers => answers.command=="Edit..."
        }
    ]).then(answers=>{
        if(answers.command=="Quit") exitProgram();

        // Don't do anything if they didn't wanna do anything
        if(Object.values(answers).includes("Nevermind...")){
            queryInput();
            return;
        }

        console.log("I did something here!");
        queryInput();
    })
}

// Start the queries
queryInput();

// FUNCTIONS
// ================================================================
function exitProgram(exitCode) {
    connection.end();
    console.log("Goodbye!\n");
    process.exit(exitCode);
}