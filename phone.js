const readline = require('readline');
const fs = require('fs');
const path = require('path');

const contactsPath = path.resolve(__dirname, 'contacts.json');
const callHistoryPath = path.resolve(__dirname, 'call_history.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Phone {
  constructor() {
    this.contacts = [];
    this.observers = [];
    this.loadContactsFromJSON();
    this.loadCallHistoryFromJSON();
    this.regexPattern = /^(0[0-9]{10}|\+[0-9]{3}[0-9]{10})$/;
  }

  addPhoneNumber(phoneNumber, name) {
    if (this.regexPattern.test(phoneNumber)) {
      this.contacts.push({ name, phoneNumber });
      this.saveContactsToJSON();
    } else {
      console.log(`Invalid phone number format: ${phoneNumber}`);
    }
  }

  removePhoneNumber(phoneNumber) {
    this.contacts = this.contacts.filter(contact => contact.phoneNumber !== phoneNumber);
    this.saveContactsToJSON();
  }

  dialPhoneNumber(input) {
    let phoneNumber = input;
    let contactName = input;

    const contact = this.contacts.find(c => c.phoneNumber === input);
    if (contact) {
      contactName = contact.name;
      phoneNumber = contact.phoneNumber;
    } else {
      console.log(`Phone number ${input} not found in contacts`);
      return;
    }

    console.log(`Dialing ${phoneNumber}`);
    this.addCallToHistory(phoneNumber);
    this.notifyObservers(phoneNumber, "Now Dialing");
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(phoneNumber, action) {
    for (const observer of this.observers) {
      observer.update(phoneNumber, action);
    }
  }

  displayCallHistory() {
    console.log("Call History:");
    for (const phoneNumber of this.callHistory) {
      console.log(`${phoneNumber}`);
    }
  }

  saveContactsToJSON() {
    fs.writeFileSync(contactsPath, JSON.stringify(this.contacts, null, 2));
  }

  loadContactsFromJSON() {
    if (fs.existsSync(contactsPath)) {
      this.contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
    } else {
      fs.writeFileSync(contactsPath, '[]');
    }
  }

  saveCallHistoryToJSON() {
    fs.writeFileSync(callHistoryPath, JSON.stringify(this.callHistory, null, 2));
  }

  loadCallHistoryFromJSON() {
    if (fs.existsSync(callHistoryPath)) {
      this.callHistory = JSON.parse(fs.readFileSync(callHistoryPath, 'utf8'));
    } else {
      fs.writeFileSync(callHistoryPath, '[]');
    }
  }

  addCallToHistory(phoneNumber) {
    this.callHistory.push({ phoneNumber, timestamp: new Date().toISOString() });
    this.saveCallHistoryToJSON();
  }

  // NEW EDIT CONTACT FUNCTION
  editContact(name, newPhoneNumber) {
    const contact = this.contacts.find(c => c.name === name);
    if (contact) {
      contact.phoneNumber = newPhoneNumber;
      this.saveContactsToJSON();
    } else {
      console.log(`Contact ${name} not found`);
    }
  }
}

class Observer {
  constructor(phone) {
    this.phone = phone;
    this.phone.addObserver(this);
  }

  update(phoneNumber, action) {
    console.log(`Now Dialing ${phoneNumber}`);
  }
}

class Observer2 {
  constructor(phone) {
    this.phone = phone;
    this.phone.addObserver(this);
  }

  update(phoneNumber, action) {
    const last10Digits = phoneNumber.slice(-10);
    console.log(`Observer2: Now Dialing ${last10Digits}`);
  }
}

function addContact(phone) {
  rl.question("Enter contact name: ", (name) => {
    rl.question("Enter contact phone number(080 or +234 format): ", (phoneNumber) => {
      phone.addPhoneNumber(phoneNumber, name);
      console.log(`New contact ${name} saved.`);
      mainMenu(phone);
    });
  });
}

function removePhoneNumber(phone) {
  rl.question("Enter phone number to remove: ", (input) => {
    phone.removePhoneNumber(input);
    mainMenu(phone);
  });
}

function dialPhoneNumber(phone) {
  rl.question("Enter phone number: ", (input) => {
    const contact = phone.contacts.find(c => c.phoneNumber === input);
    if (contact) {
      phone.dialPhoneNumber(input);
    } else {
      console.log(`Phone number ${input} not found in contacts`);
    }
    mainMenu(phone);
  });
}

function displayCallHistory(phone) {
  phone.displayCallHistory();
  mainMenu(phone);
}

// UPDATED VIEW CONTACTS FUNCTION
function viewContacts(phone) {
  phone.displayContacts();
  rl.question("Enter the index of the contact you want to interact with: ", (index) => {
    index = parseInt(index) - 1;
    if (index < 0 || index >= phone.contacts.length) {
      console.log("Invalid contact index");
      mainMenu(phone);
      return;
    }

    const contact = phone.contacts[index];
    rl.question(`Do you want to (1) dial ${contact.name}, (2) edit ${contact.name}, (3) remove ${contact.name}, or (4) view call history? `, (answer) => {
      switch (answer) {
        case '1':
          phone.dialPhoneNumber(contact.phoneNumber);
          mainMenu(phone);
          break;
        case '2':
          rl.question("Enter new phone number: ", (newPhoneNumber) => {
            phone.editContact(contact.name, newPhoneNumber); // CALL THE EDIT FUNCTION HERE
            console.log(`Contact ${contact.name} edited successfully.`);
            mainMenu(phone);
          });
          break;
        case '3':
          phone.removePhoneNumber(contact.phoneNumber);
          console.log(`Contact ${contact.name} erased successfully.`);
          mainMenu(phone);
          break;
        case '4':
          phone.displayCallHistory();
          mainMenu(phone);
          break;
        default:
          console.log("Invalid choice");
          mainMenu(phone);
          break;
      }
    });
  });
}


function mainMenu(phone) {
  rl.question("What do you want to do? \n(1) Add new contact, \n(2) Remove phone number, \n(3) Dial phone number, \n(4) View contacts list, \n(5) View call logs: ", (answer) => {
    switch (answer) {
      case '1':
        addContact(phone);
        break;
      case '2':
        removePhoneNumber(phone);
        break;
      case '3':
        dialPhoneNumber(phone);
        break;
      case '4':
        viewContacts(phone);
        break;
      case '5':
          displayCallHistory(phone);
          break;
      default:
        console.log("Invalid choice");
        mainMenu(phone);
        break;
    }
  });
}

const phone = new Phone();
const observer = new Observer(phone);
const observer2 = new Observer2(phone);
mainMenu(phone);
