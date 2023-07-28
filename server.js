const mysql = require('mysql2')
const inquirer = require('inquirer')
require('dotenv').config()

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'employee_db'
})

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err)
    return
  }
  console.log('Connected to MySQL database!')
  main()
})

async function main() {
  const action = await promptAction();

  switch (action) {
    case 'add employee':
      const newEmployee = await promptNewEmployee();
      addEmployee(newEmployee);
      break;
    case 'list employees':
      listEmployees();
      break;
    case 'add department':
      const newDepartment = await promptNewDepartment();
      addDepartment(newDepartment);
      break;
    case 'list departments':
      listDepartments();
      break;
    case 'add roles':
      const newRoles = await promptNewRoles();
      addRoles(newRoles);
      break;
    case 'list roles':
      listRoles();
      break;
    case 'quit':
      quit();
      break;

    default:
      console.log('Invalid action');
      connection.end();
  }
}

async function promptAction() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: ['add employee', 'list employees', 'add department', 'list departments', 'add roles', 'list roles', 'quit'],
    },
  ]);
  return action;
}

async function promptNewEmployee() {
  const { first_name, last_name, manager_id, role_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter employee first name:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter employee last name:',
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'Enter employee role id:',
    },
    {
      type: 'input',
      name: 'manager_id',
      message: 'Enter employee manager id:',
    },
  ]);
  return { first_name, last_name, manager_id, role_id };
}

function addEmployee(employee) {
  connection.query('INSERT INTO employees SET ?', employee, (err, result) => {
    if (err) {
      console.error('Error adding employee: ', err);
    } else {
      console.log('Employee added successfully!');
    }
    connection.end();
  });
}

function listEmployees() {
  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error('Error retrieving employees: ', err);
    } else {
      console.table(results);
    }
    connection.end();
  });
}

async function promptNewDepartment() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter department name:',
    },
  ]);
  return { name };
}

function addDepartment(department) {
  connection.query('INSERT INTO department SET ?', department, (err, result) => {
    if (err) {
      console.error('Error adding department: ', err);
    } else {
      console.log('Department added successfully!');
    }
    connection.end();
  });
}

function listDepartments() {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) {
      console.error('Error retrieving department: ', err);
    } else {
      console.table(results);
    }
    connection.end();
  });
}

async function promptNewRoles() {
  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter role name:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter role salary:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter role department:',
    },
  ]);
  return { title, salary, department_id };
}

function addRoles(role) {
  connection.query('INSERT INTO role SET ?', role, (err, result) => {
    if (err) {
      console.error('Error adding role: ', err);
    } else {
      console.log('Role added successfully!');
    }
    connection.end();
  });
}

function listRoles() {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) {
      console.error('Error retrieving role: ', err);
    } else {
      console.table(results);
    }
    connection.end();
  });
}

function quit() {
  connection.end()
}