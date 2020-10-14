const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

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


// MAIN LOOP
// ================================================================
connection.connect((err)=>{
    if(err) throw err;

    console.log("MySQL Connected with id: "+connection.threadId);
    queryInput();
});

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
            choices: ["Departments", "Roles", "Employees...", "Nevermind..."],
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
            case "Add...": commandAdd(answers.add); break;
            case "View...": commandView(answers.view); break;
            case "Edit...": commandEdit(answers.edit); break;
            default:
                console.error("Something weird happened!");
                exitProgram(ERR_INVALID_ANSWER);
        }
    })
}

// FUNCTIONS
// ================================================================
function exitProgram(exitCode) {
    connection.end();
    console.log("Goodbye!\n");
    process.exit(exitCode);
}

// ADD FUNCTIONS

function commandAdd(typeToAdd){
    switch(typeToAdd){
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

function addEmployee(){
    console.log();
    console.log("Adding Employee!");

    // TODO: query for departments list
    const roles = [{value: 1, name: "Test Role 1"}, {value: 2, name: "Test Role 2"}]
    const managers = [{value: 1, name: "John Doe"}, {value: 2, name: "Jane Deere"}, "none"];

    inquirer.prompt([
        {
            name: "firstName",
            message: "What is the first name of this Employee?",
            type: "input",
            validate: answer => {
                // Make sure the user passes a word
                return /\w+/.test(answer)? true: "Please input a name";
            } 
        },
        {
            name: "lastName",
            message: "What is the last name of this Employee?",
            type: "input",
            validate: answer => {
                // Make sure the user passes a word
                return /\w+/.test(answer)? true: "Please input a name";
            } 
        },
        {
            name: "roleID",
            message: "What is the Role of this Employee?",
            type: "list",
            choices: roles
        },
        {
            name: "managerID",
            message: "Who is the Manager of this Employee?",
            type: "list",
            choices: managers
        }
    ]).then(answers=>{
        const {firstName, lastName, roleID, managerID} = answers;
        if(managerID=="none"){
            console.log(`Adding an employee named ${firstName} ${lastName} with a role of ${roleID}`);
        }else{
            console.log(`Adding an employee named ${firstName} ${lastName} with a role of ${roleID} managed by ${managerID}`);
        }
        
        // TODO: implement employee addition queries

        queryInput();
    });
}

// VIEW FUNCTIONS

function commandView(typeToView){
    switch(typeToView){
        case "Departments":
            viewDepartments();
            break;

        case "Roles":
            viewRoles();
            break;

        case "Employees...":
            viewEmployees();
            break;

        default: 
            console.error("Something weird happened!");
            exitProgram(ERR_INVALID_ANSWER);
    }
}

// TODO: implement view functions
function viewDepartments(){
    connection.query("SELECT * FROM department", (err, data)=>{
        if(err) throw err;

        console.table(data);
        queryInput();
    });
}

function viewRoles(){
    connection.query("SELECT role.id, title, salary, name AS department FROM role JOIN department WHERE department_id=department.id", (err, data)=>{
        if(err) throw err;

        console.table(data);
        queryInput();
    });
}

function viewEmployees(){
    console.log("I viewed some Employees!");
    queryInput();
}


// EDIT FUNCTIONS

function commandEdit(typeToEdit){
    switch(typeToEdit){
        case "Employee Role":
            editEmployeeRole();
            break;

        case "Employee Manager":
            editEmployeeManager();
            break;

        default: 
            console.error("Something weird happened!");
            exitProgram(ERR_INVALID_ANSWER);
    }
}

// TODO: implement edit functions

function editEmployeeRole(){
    console.log("I edited an employee's role!");
    queryInput();
}

function editEmployeeManager(){
    console.log("I edited an employee's manager!");
    queryInput();
}
