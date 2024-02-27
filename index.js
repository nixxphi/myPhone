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
    // CHECKS IF INPUT IS A REAL PHONE NUMBER
    if (!this.regexPattern.test(input)) {
      // IF NOT, TRIES TO FIND CONTACT NAME. I'LL ADMIT IT, THIS CODE IS A LITTLE REDUNDANT BUT I DON'T WANNA TOPPLE THE HOUSE OF CARDS 
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
    // ADDS CALL TO CALL HISTORY SO YOUR BAE CAN CATCH YOU
    this.callHistory.push(phoneNumber);
    this.notifyObservers(phoneNumber, "Now Dialing");
  }

  // THE METHOD FOR ADDING AN OBSERVER
  addObserver(observer) {
    this.observers.push(observer);
  }

  // THE METHOD FOR REMOVING AN OBSERVER
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  // NOTIFYING ALL OBSERVERS, WATCHERS, SNOOPERS AND VOYEURS 
  notifyObservers(phoneNumber, action) {
    for (const observer of this.observers) {
      observer.update(phoneNumber, action);
    }
  }

  // METHOD TO DISPLAY CALL HISTORY... I LEFT OUT THE OPTION TO DELETE CALL HISTORY INTENTIONALLY. CHOP YOUR OWN BREAKFAST LIKE A MAN.
  displayCallHistory() {
    console.log("Call History:");
    for (const phoneNumber of this.callHistory) {
      console.log(`${contact.name} : ${phoneNumber}`);
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
    // NOTIFY OBSERVERS... DEFINITELY REMINDS ME OF THE WATCHERS
    this.notifyObservers("Added");
  }

  // METHOD TO EDIT AN EXISTING CONTACT
  editContact(name, newPhoneNumber) {
    const contact = this.contacts.find(c => c.name === name);
    if (contact) {
      contact.phoneNumber = newPhoneNumber;
      // NOTIFIES WATCHERS... ERR OBSERVERS
      this.notifyObservers("Edited");
    } else {
      console.log(`Contact ${name} not found`);
    }
  }

  // TO DELETE A CONTACT
  removeContact(name) {
    const index = this.contacts.findIndex(c => c.name === name);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      this.notifyObservers("Deleted");
    } else {
      console.log(`Contact ${name} not found`);
    }
  }

  // TO DISPLAY ALL CONTACTS... I'LL HAVE TO ADD A HIDDEN CONTACTS SECTION LATER LOL
  displayContacts() {
    console.log("Contacts:");
    for (let i = 0; i < this.contacts.length; i++) {
      console.log(`${i + 1}: ${this.contacts[i].name}: ${this.contacts[i].phoneNumber}`);
    }
  }
}

// THE FIRST OBSERVER CLASS
class Observer {
  constructor(phone) {
    this.phone = phone;
    this.phone.addObserver(this);
  }

  // FOR UPDATING OBSERVER1
  update(phoneNumber, action) {
    console.log(`Now Dialing ${phoneNumber}`);
  }
}

// CREATING SECOND OBSERVER CLASS
class Observer2 {
  constructor(phone) {
    this.phone = phone;
    this.phone.addObserver(this);
  }

  // FOR UPDATING OBSERVER2
  update(phoneNumber, action) {
    const last10Digits = phoneNumber.slice(-10);
    console.log(`Observer2: Now Dialing ${last10Digits}`);
  }
}

// FOR DIALING A PHONE NUMBER
function dialPhoneNumber(phone) {
  rl.question("Enter phone number: ", (input) => {
    phone.dialPhoneNumber(input);
    //RETURN TO PREVIOUS MENU
    mainMenu();
  });
}

// FOR ADDING CONTACTS
function addContact(contacts, phone) {
  rl.question("Enter contact name: ", (name) => {
    rl.question("Enter contact phone number(080 or +234 format): ", (phoneNumber) => {
      contacts.addContact(name, phoneNumber);
      phone.addPhoneNumber(phoneNumber);
      console.log(`New contact ${name} saved.`);
      mainMenu();
    });
  });
}

// FOR VIEWING CONTACTS 
function viewContacts(contacts, phone) {
  contacts.displayContacts();
  rl.question("Enter the index of the contact you want to interact with: ", (index) => {
    index = parseInt(index) - 1;
    if (index < 0 || index >= contacts.contacts.length) {
      console.log("Invalid contact index");
      mainMenu();
      return;
    }

    const contact = contacts.contacts[index];
    rl.question(`Do you want to (1) dial ${contact.name}, (2) edit ${contact.name}, (3) remove ${contact.name}, or (4) view call history? `, (answer) => {
      switch (answer) {
        case '1':
          phone.dialPhoneNumber(contact.phoneNumber);
          mainMenu();
          break;
        case '2':
          rl.question("Enter new phone number: ", (newPhoneNumber) => {
            contacts.editContact(contact.name, newPhoneNumber);
            console.log(`Contact ${contact.name} edited successfully.`);
            mainMenu();
          });
          break;
        case '3':
          contacts.removeContact(contact.name);
          console.log(`Contact ${contact.name} deleted successfully.`);
          mainMenu();
          break;
        case '4':
          phone.displayCallHistory();
          mainMenu();
          break;
        case '5':
          console.log("Go back to the main menu");
          mainMenu();
          break;
        default:
          console.log("Invalid choice");
          mainMenu();
          break;
      }
    });
  });
}

// HERE'S OUR MAIN MENU
function mainMenu() {
  rl.question("What do you want to do? (1) Dial phone number, (2) View contacts, (3) Add new contact, (4) View call history: ", (answer) => {
    switch (answer) {
      case '1':
        dialPhoneNumber(phone);
        break;
      case '2':
        viewContacts(contacts, phone);
        break;
      case '3':
        addContact(contacts, phone);
        break;
      case '4':
        phone.displayCallHistory();
        mainMenu();
        break;
      default:
        console.log("Invalid choice");
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
const observer1 = new Observer(phone);
const observer2 = new Observer2(phone);

// LETS BRING BACK THAT MAIN MENU AGAIN
mainMenu();
