const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Phone {
  constructor() {
    this.phoneNumbers = new Set();
    this.observers = [];
    this.callHistory = [];
    this.contacts = [];
    this.regexPattern = /^(0[0-9]{10}|\+[0-9]{3}[0-9]{10})$/;
  }

  // METHOD TO ADD A NEW PHONE NUMBER
  addPhoneNumber(phoneNumber) {
    if (this.regexPattern.test(phoneNumber)) {
      this.phoneNumbers.add(phoneNumber);
    } else {
      console.log(`Invalid phone number format: ${phoneNumber}`);
    }
  }

  // METHOD TO REMOVE A PHONE NUMBER
  removePhoneNumber(phoneNumber) {
    this.phoneNumbers.delete(phoneNumber);
  }

  // METHOD TO DIAL A PHONE NUMBER
  dialPhoneNumber(input) {
    let phoneNumber = input;
    let contactName = input;
    // CHECKS IF INPUT IS A PHONE NUMBER
    if (!this.regexPattern.test(input)) {
      // IF NOT, TRIES TO FIND CONTACT NAME
      const contact = this.contacts.find(c => c.name === input);
      if (contact) {
        contactName = contact.name;
        phoneNumber = contact.phoneNumber;
      } else {
        console.log(`Phone number or contact name ${input} not found`);
        return;
      }
    }

    console.log(`Dialing ${phoneNumber}`);
    // ADD CALL TO CALL HISTORY
    this.callHistory.push(phoneNumber);
    this.notifyObservers(phoneNumber, "Dialing");
  }

  // METHOD TO ADD AN OBSERVER
  addObserver(observer) {
    this.observers.push(observer);
  }

  // METHOD TO REMOVE AN OBSERVER
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  // METHOD TO NOTIFY ALL OBSERVERS
  notifyObservers(phoneNumber, action) {
    for (const observer of this.observers) {
      observer.update(phoneNumber, action);
    }
  }

  // METHOD TO DISPLAY CALL HISTORY
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
  }

  // METHOD TO ADD A NEW CONTACT
  addContact(name, phoneNumber) {
    this.contacts.push({ name, phoneNumber });
    // NOTIFY OBSERVERS
    this.notifyObservers("Adding");
  }

  // METHOD TO EDIT AN EXISTING CONTACT
  editContact(name, newPhoneNumber) {
    const contact = this.contacts.find(c => c.name === name);
    if (contact) {
      contact.phoneNumber = newPhoneNumber;
      // NOTIFY OBSERVERS
      this.notifyObservers("Editing");
    } else {
      console.log(`Contact ${name} not found`);
    }
  }

  // METHOD TO REMOVE A CONTACT
  removeContact(name) {
    const index = this.contacts.findIndex(c => c.name === name);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      this.notifyObservers("Deleting");
    } else {
      console.log(`Contact ${name} not found`);
    }
  }

  // METHOD TO DISPLAY ALL CONTACTS
  displayContacts() {
    console.log("Contacts:");
    for (let i = 0; i < this.contacts.length; i++) {
      console.log(`${i + 1}: ${this.contacts[i].name}: ${this.contacts[i].phoneNumber}`);
    }
  }
}

// FUNCTION TO DIAL A PHONE NUMBER
function dialPhoneNumber(phone) {
  rl.question("Enter phone number: ", (input) => {
    phone.dialPhoneNumber(input);
    // RETURN TO PREVIOUS MENU
    mainMenu();
  });
}

// FUNCTION TO ADD A NEW CONTACT
function addContact(contacts, phone) {
  rl.question("Enter contact name: ", (name) => {
    rl.question("Enter contact phone number(080 or +234 format): ", (phoneNumber) => {
      contacts.addContact(name, phoneNumber);
      phone.addPhoneNumber(phoneNumber);
      console.log(`New contact ${name} saved.`);
      // RETURN TO PREVIOUS MENU
      mainMenu();
    });
  });
}

// FUNCTION TO VIEW CONTACTS
function viewContacts(contacts, phone) {
  contacts.displayContacts();
  rl.question("Enter the index of the contact you want to interact with: ", (index) => {
    index = parseInt(index) - 1;
    if (index < 0 || index >= contacts.contacts.length) {
      console.log("Invalid contact index");
      // RETURN TO PREVIOUS MENU
      mainMenu();
      return;
    }

    const contact = contacts.contacts[index];
    rl.question(`Do you want to (1) dial ${contact.name}, (2) edit ${contact.name}, (3) remove ${contact.name}, or (4) view call history? `, (answer) => {
      switch (answer) {
        case '1':
          phone.dialPhoneNumber(contact.phoneNumber);
          // RETURN TO PREVIOUS MENU
          mainMenu();
          break;
        case '2':
          rl.question("Enter new phone number: ", (newPhoneNumber) => {
            contacts.editContact(contact.name, newPhoneNumber);
            console.log(`Contact ${contact.name} edited successfully.`);
            // RETURN TO PREVIOUS MENU
            mainMenu();
          });
          break;
        case '3':
          contacts.removeContact(contact.name);
          console.log(`Contact ${contact.name} removed successfully.`);
          // RETURN TO PREVIOUS MENU
          mainMenu();
          break;
        case '4':
          phone.displayCallHistory();
          // RETURN TO PREVIOUS MENU
          mainMenu();
          break;
        case '5':
          // RETURN TO PREVIOUS MENU
          mainMenu();
          break;
        default:
          console.log("Invalid choice");
          // RETURN TO PREVIOUS MENU
          mainMenu();
          break;
      }
    });
  });
}

// FUNCTION FOR THE MAIN MENU
function mainMenu() {
  rl.question("What do you want to do? (1) Dial phone number, (2) View contacts, (3) Add new contact, (4) View call history: ", (answer) => {
    switch (answer) {
      case '1':
        dialPhoneNumber(phone);
        mainMenu();
        break;
      case '2':
        viewContacts(contacts, phone);
        mainMenu();
        break;
      case '3':
        addContact(contacts, phone);
        break;
      case '4':
        phone.displayCallHistory();
        // RETURN TO PREVIOUS MENU
        mainMenu();
        break;
      default:
        console.log("Invalid choice");
        // RETURN TO PREVIOUS MENU
        mainMenu();
        break;
    }
  });
}

// AND X SAID "LET THERE BE A PHONE AND CONTACTS"
const phone = new Phone();
const contacts = new Contacts();

// ADD THE SAMPLE CONTACTS TO THE CONTACTS OBJECT, I COULDN'T FIND THE RIGHT METHOD TO GENRATE AN ENDURING CONTACTS LIST. IF YOU HAVE A CLUE ON THAT, PLEASE TELL ME.
const sampleContacts = [
  { name: 'Marachukwu', phoneNumber: '08034567890' },
  { name: 'Uche', phoneNumber: '0907654321' },
  { name: 'Gloria', phoneNumber: '+2347049309321' },
  { name: 'Chukwuma', phoneNumber: '09756757859' }
];
for (const contact of sampleContacts) {
  contacts.addContact(contact.name, contact.phoneNumber);
}

// LET'S ADD THE OBSERVERS
phone.addObserver({
  update(phoneNumber, action) {
    console.log(`${phoneNumber}`);
  }
});

phone.addObserver({
  update(phoneNumber, action) {
    console.log(`Now Dialing ${phoneNumber}`);
  }
});

// SHOW THE MAIN MENU
mainMenu();
