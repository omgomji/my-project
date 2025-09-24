# CLI Employee Management System - Experiment 10

A beginner-friendly Node.js command-line application that manages employees using an in‑memory array of objects. This experiment introduces interactive terminal input with the built‑in `readline` module while practicing array operations (add, list, remove) and simple control flow.

## Components Used

### Node.js Core Module
- `readline` – For interactive user input/output in the terminal

### Data Structure
- Array of objects: each employee has `name` and `id` properties

```js
var employees = [
  { name: 'Alice', id: 'E101' },
  { name: 'Bob', id: 'E102' },
  { name: 'Charlie', id: 'E103' }
];
```

## Features
1. Add Employee (prompts for name and ID)
2. List Employees (shows all with numbering)
3. Remove Employee (by ID)
4. Exit program

All changes exist only during the session (nothing saved to files or a database).

## Interactive Flow
```
Menu displayed -> User chooses option -> Program runs action -> Menu re-displays
```

### Sample Output (Flow Snippets)
```
Employee Management System
1. Add Employee
2. List Employees
3. Remove Employee
4. Exit

Enter your choice: 2

Employee List:
1. Name: Alice, ID: E101
2. Name: Bob, ID: E102
3. Name: Charlie, ID: E103
```

Add example:
```
Enter your choice: 1
Enter employee name: Daniel
Enter employee ID: E104
Employee Daniel (ID: E104) added successfully.
```

Remove example:
```
Enter your choice: 3
Enter employee ID to remove: E102
Employee Bob (ID: E102) removed successfully.
```

## Core JavaScript (Simplified)
```js
function showMenu() {
  console.log('\nEmployee Management System');
  console.log('1. Add Employee');
  console.log('2. List Employees');
  console.log('3. Remove Employee');
  console.log('4. Exit');
  rl.question('\nEnter your choice: ', handleMenuChoice);
}
```
The menu loops by calling `showMenu()` again after each action.

### Adding an Employee
```js
function addEmployeeFlow() {
  rl.question('Enter employee name: ', function(name) {
    rl.question('Enter employee ID: ', function(id) {
      employees.push({ name: name.trim(), id: id.trim() });
      console.log('Employee ' + name + ' (ID: ' + id + ') added successfully.');
      showMenu();
    });
  });
}
```

### Removing an Employee
```js
function removeEmployeeFlow() {
  rl.question('Enter employee ID to remove: ', function(id) {
    var index = employees.findIndex(e => e.id === id.trim());
    if (index === -1) {
      console.log('Employee with ID ' + id + ' not found.');
    } else {
      var removed = employees.splice(index, 1)[0];
      console.log('Employee ' + removed.name + ' (ID: ' + removed.id + ') removed successfully.');
    }
    showMenu();
  });
}
```

## File Structure
```
Experiment-10/
├── package.json   # Metadata + start script
├── server.js      # CLI application logic
└── README.md      # Documentation
```
---
