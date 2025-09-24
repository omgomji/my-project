const readline = require('readline');

var employees = [
  { name: 'Alice', id: 'E101' },
  { name: 'Bob', id: 'E102' },
  { name: 'Charlie', id: 'E103' },
  { name: 'OM JI', id: 'BAD10012' }
];

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log('\nEmployee Management System');
  console.log('1. Add Employee');
  console.log('2. List Employees');
  console.log('3. Remove Employee');
  console.log('4. Exit');
  rl.question('\nEnter your choice: ', handleMenuChoice);
}

function handleMenuChoice(choice) {
  switch (choice.trim()) {
    case '1':
      addEmployeeFlow();
      break;
    case '2':
      listEmployees();
      showMenu();
      break;
    case '3':
      removeEmployeeFlow();
      break;
    case '4':
      rl.close();
      break;
    default:
      console.log('Invalid choice. Please enter 1, 2, 3 or 4.');
      showMenu();
  }
}

function addEmployeeFlow() {
  rl.question('Enter employee name: ', function(name) {
    if (!name.trim()) {
      console.log('Name cannot be empty.');
      return showMenu();
    }
    rl.question('Enter employee ID: ', function(id) {
      id = id.trim();
      if (!id) {
        console.log('ID cannot be empty.');
        return showMenu();
      }
      for (var i = 0; i < employees.length; i++) {
        if (employees[i].id === id) {
          console.log('Employee ID already exists.');
          return showMenu();
        }
      }
      employees.push({ name: name.trim(), id: id });
      console.log('Employee ' + name.trim() + ' (ID: ' + id + ') added successfully.');
      showMenu();
    });
  });
}

function listEmployees() {
  if (employees.length === 0) {
    console.log('\nNo employees to show.');
    return;
  }
  console.log('\nEmployee List:');
  for (var i = 0; i < employees.length; i++) {
    var emp = employees[i];
    console.log((i + 1) + '. Name: ' + emp.name + ', ID: ' + emp.id);
  }
}

function removeEmployeeFlow() {
  if (employees.length === 0) {
    console.log('No employees to remove.');
    return showMenu();
  }
  rl.question('Enter employee ID to remove: ', function(id) {
    id = id.trim();
    var index = -1;
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].id === id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      console.log('Employee with ID ' + id + ' not found.');
    } else {
      var removed = employees.splice(index, 1)[0];
      console.log('Employee ' + removed.name + ' (ID: ' + removed.id + ') removed successfully.');
    }
    showMenu();
  });
}

rl.on('close', function() {
  console.log('\nExiting Employee Management System. Goodbye!');
  process.exit(0);
});

showMenu();