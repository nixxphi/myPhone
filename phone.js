const readline = require('readline');
const fs = require('fs');
const path = require('path');

// JSON FILE PATHS. FINALLY GOT IT WORKING RIGHT.
const contactsPath = path.resolve(__dirname, 'contacts.json');
const callHistoryPath = path.resolve(__dirname, 'call_history.json');

// INITIALIZING INTERFACE
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//LET US BEGIN
class Phone {
  constructor() {
    this.phoneNumbers = new Set();
    this.observers = [];
    this.loadContactsFromJSON();
    this.loadCallHistoryFromJSON();
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
    this.addCallToHistory(phoneNumber);
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
      console.log(`${phoneNumber}`);
    }
  }

  // METHOD TO SAVE CONTACTS TO JSON
  saveContactsToJSON() {
    fs.writeFileSync(contactsPath, JSON.stringify(this.contacts, null, 2));
  }

  // METHOD TO LOAD CONTACTS FROM JSON 
  loadContactsFromJSON() {
    if (fs.existsSync(contactsPath)) {
      this.contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
    } else {
      this.contacts = [];
      this.saveContactsToJSON();
    }
  }

  // METHOD TO SAVE CALL HISTORY TO JSON
  saveCallHistoryToJSON() {
    fs.writeFileSync(callHistoryPath, JSON.stringify(this.callHistory, null, 2));
  }

  // METHOD TO LOAD CALL HISTORY FROM JSON
  loadCallHistoryFromJSON() {
    if (fs.existsSync(callHistoryPath)) {
      this.callHistory = JSON.parse(fs.readFileSync(callHistoryPath, 'utf8'));
    } else {
      this.callHistory = [];
      this.saveCallHistoryToJSON();
    }
  }

  // METHOD TO ADD CALL TO HISTORY
  addCallToHistory(phoneNumber) {
    this.callHistory.push({ phoneNumber, timestamp: new Date().toISOString() });
    this.saveCallHistoryToJSON();
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
    // SAVE CONTACTS TO JSON
    this.saveContactsToJSON();
  }

  // METHOD TO EDIT AN EXISTING CONTACT
  editContact(name, newPhoneNumber) {
    const contact = this.contacts.find(c => c.name === name);
    if (contact) {
      contact.phoneNumber = newPhoneNumber;
      // NOTIFIES WATCHERS... ERR OBSERVERS
      this.notifyObservers("Edited");
      // SAVE CONTACTS TO JSON
      this.saveContactsToJSON();
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
      // SAVE CONTACTS TO JSON
      this.saveContactsToJSON();
    } else {
      console.log(`Contact ${name} not found`);
    }
  }

  // TO DISPLAY ALL CONTACTS... I'LL HAVE TO ADD A HIDdEN CONTACTS SECTION LATER LOL
  displayContacts() {
    console.log("Contacts:");
    for (let i = 0; i < this.contacts.length; i++) {
      console.log(`${i + 1}: ${this.contacts[i].name}: ${this.contacts[i].phoneNumber}`);
    }
  }
}

// CREATING OBSERVER 1
class Observer1 {
  constructor(phone) {
    this.phone = phone;
    this.phone.addObserver(this);
  }

  // UPDATE OBSERVER 1
  update(phoneNumber, action) {
    console.log(`Observer1: ${phoneNumber}`);
  }
}

// CREATING CLASS FOR OBERVER 2
class Observer2 {
  constructor(phone) {
    this.phone = phone;
    this.phone.addObserver(this);
  }

  //UPDATE OBSERVER 2
  update(phoneNumber, action) {
    const last10Digits = phoneNumber.slice(-10);
    console.log(`Observer2: Now Dialing ${last10Digits}`);
  }
}

// TO DIAL A PHONE NUMBER
function dialPhoneNumber(phone) {
  rl.question("Enter phone number: ", (input) => {
    phone.dialPhoneNumber(input);
    // GO BACK
    mainMenu();
  });
}

// FOR ADDING A NEW CONTACT
function addContact(contacts, phone) {
  rl.question("Enter contact name: ", (name) => {
    rl.question("Enter contact phone number(080 or +234 format): ", (phoneNumber) => {
      contacts.addContact(name, phoneNumber);
      phone.addPhoneNumber(phoneNumber);
      console.log(`New contact ${name} saved.`);
      // LETS GO BACK AGAIN
      mainMenu();
    });
  });
}

// FOR VIEWING CONTACTS ON THE INTERFACE.
function viewContacts(contacts, phone) {
  contacts.displayContacts();
  rl.question("Enter the index of the contact you want to interact with: ", (index) => {
    index = parseInt(index) - 1;
    if (index < 0 || index >= contacts.contacts.length) {
      console.log("Invalid contact index");
      // GO BACK
      mainMenu();
      return;
    }

    const contact = contacts.contacts[index];
    rl.question(`Do you want to (1) dial ${contact.name}, (2) edit ${contact.name}, (3) remove ${contact.name}, or (4) view call history? `, (answer) => {
      switch (answer) {
        case '1':
          phone.dialPhoneNumber(contact.phoneNumber);
          // SNAP BACK TO THE PREVIOUS MENU
          mainMenu();
          break;
        case '2':
          rl.question("Enter new phone number: ", (newPhoneNumber) => {
            contacts.editContact(contact.name, newPhoneNumber);
            console.log(`Contact ${contact.name} edited successfully.`);
            // BACK SLIDE A BIT
            mainMenu();
          });
          break;
        case '3':
          contacts.removeContact(contact.name);
          console.log(`Contact ${contact.name} erased successfully.`);
          // RETURN TO THE PAST NOW!
          mainMenu();
          break;
        case '4':
          phone.displayCallHistory();
          // MOON-WALKING TO THE PREVIOUS MENU
          mainMenu();
          break;
        case '5':
          // BACK-TRACKING
          mainMenu();
          break;
        default:
          console.log("Invalid choice");
          // HEADING BACK
          mainMenu();
          break;
      }
    });
  });
}

// HERE'S MY INFAMOUS MAIN MENU... I'VE PASTED THAT ALL OVER THIS THING 
function mainMenu() {
  rl.question("What do you want to do? \n(1) Dial phone number, \n(2) View contacts, \n(3) Add new contact, \n(4) View call history: ", (answer) => {
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
        // Return to previous menu
        mainMenu();
        break;
      default:
        console.log("Invalid choice");
        // Return to previous menu
        mainMenu();
        break;
    }
  });
}

// AND FINALLY... X SAID: "LET THERE BE PHONE... AND CONTACTS"
const phone = new Phone();
const contacts = new Contacts();

// INSTANTIATING PERVY VIEWER. SORRY OBSERVER
const observer1 = new Observer1(phone);
const observer2 = new Observer2(phone);

// MY MVP MAIN MENU ONE MORE TIME
mainMenu();
