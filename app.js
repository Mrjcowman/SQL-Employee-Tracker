const inquirer = require("inquirer");
const mysql = require("mysql");

const ERR_INVALID_ANSWER = 0xf0;

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

        switch(answers.command){
            case "Add...": commandAdd(answers); break;
            case "View...": commandView(answers); break;
            case "Edit...": commandEdit(answers); break;
            default:
                console.error("Something weird happened!");
                exitProgram(ERR_INVALID_ANSWER);
        }
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

// ADD FUNCTIONS

function commandAdd(answers){
    switch(answers.add){
        case "Department":
            addDepartment();
            break;

        case "Role":
            addRole();
            break;

        case "Employee":
            addEmployee();
            break;

        default: 
            console.error("Something weird happened!");
            exitProgram(ERR_INVALID_ANSWER);
    }
}

function addDepartment(){
    console.log();
    console.log("Adding Department!");
    inquirer.prompt([
        {
            name: "deptName",
            message: "What is the name of this Department?",
            type: "input",
            validate: answer => {
                // Make sure the user passes a word
                return /\w+/.test(answer)? true: "Please input a word";
            } 
        }
    ]).then(answers=>{
        console.log("Adding a department named "+answers.deptName);
        
        // TODO: implement department addition query

        queryInput();
    });
}

function addRole(){
    console.log();
    console.log("Adding Role!");

    // TODO: query for departments list
    const departments = [{value: 1, name:"Test Department 1"}, {value: 2, name:"Test Department 2"}]

    inquirer.prompt([
        {
            name: "roleName",
            message: "What is the name of this Role?",
            type: "input",
            validate: answer => {
                // Make sure the user passes a word
                return /\w+/.test(answer)? true: "Please input a word";
            } 
        },
        {
            name: "deptID",
            message: "Which Department does this role fall under?",
            type: "list",
            choices: departments
        }
    ]).then(answers=>{
        console.log("Adding a role named "+answers.roleName+" in the department "+answers.deptID);
        
        // TODO: implement role addition query

        queryInput();
    });
}

// TODO: implement employee addition
function addEmployee(){
    
    queryInput();
}

// VIEW FUNCTIONS

function commandView(answers){
    console.log("I viewed something here!");
    queryInput();
}


// EDIT FUNCTIONS

function commandEdit(answers){
    console.log("I edited something here!");
    queryInput();
}
