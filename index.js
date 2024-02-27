const readline = require('readline');

class Phone {
  constructor() {
    this.phoneNumbers = new Set();
    this.viewers = [];
    this.callHistory = [];
    this.regexPattern = /^(0[0-9]{9}|\+[0-9]{3}[0-9]{10})$/;
  }

  // Method to add a new phone number
  addPhoneNumber(phoneNumber) {
    if (this.regexPattern.test(phoneNumber)) {
      this.phoneNumbers.add(phoneNumber);
    } else {
      console.log(`Invalid phone number format: ${phoneNumber}`);
    }
  }

  // Method to remove a phone number
  removePhoneNumber(phoneNumber) {
    this.phoneNumbers.delete(phoneNumber);
  }

  // Method to dial a phone number
  call(phoneNumber) {
    if (this.phoneNumbers.has(phoneNumber)) {
      console.log(`Dialing ${phoneNumber}`);
      // Add call to call history
      this.callHistory.push(phoneNumber);
    } else {
      console.log(`Phone number ${phoneNumber} not found`);
    }
  }

  // Method to add a viewer
  addViewer(viewer) {
    this.viewers.push(viewer);
  }

  // Method to remove a viewer
  removeViewer(viewer) {
    const index = this.viewers.indexOf(viewer);
    if (index !== -1) {
      this.viewers.splice(index, 1);
    }
  }

  // Method to display call history
  displayCallHistory() {
    console.log("Call History:");
    for (const phoneNumber of this.callHistory) {
      console.log(`${phoneNumber}`);
    }
  }
}

class Contacts extends Phone {
  constructor() {
    super();
    this.contacts = new Map();
  }
  addContact(name, phoneNumber) {
    this.contacts.set(name, phoneNumber);
  }
  editContact(name, newPhoneNumber) {
    if (this.contacts.has(name)) {
      this.contacts.set(name, newPhoneNumber);
    } else {
      console.log(`Contact ${name} not found`);
    }
  }
  removeContact(name) {
    if (this.contacts.has(name)) {
      this.contacts.delete(name);
    } else {
      console.log(`Contact ${name} not found`);
    }
  }

  // Thought I could use a method to display all contacts
  displayContacts() {
    console.log("Contacts:");
    for (const [name, phoneNumber] of this.contacts.entries()) {
      console.log(`${name}: ${phoneNumber}`);
    }
  }
}

// Phone instance
const phone = new Phone();

// Contacts instance
const contacts = new Contacts();

phone.addViewer(contacts);

function addContact() {
  rl.question("Enter contact name: ", (name) => {
    rl.question("Enter contact phone number: ", (phoneNumber) => {
      contacts.addContact(name, phoneNumber);
      console.log(`Contact ${name} added successfully.`);
      rl.close();
    });
  });
}

// Prompt for adding a new contact
rl.question("Do you want to add a new contact? (yes/no): ", (answer) => {
  if (answer.toLowerCase() === 'yes') {
    addContact();
  } else {
    rl.close();
  }
});
