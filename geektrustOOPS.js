const { Console } = require("console");
const fs = require("fs");

class SubscriptionManager {
    constructor(filename) {
        this.filename = filename;
        this.subscriptionPlans = {
            "MUSIC": {
                "FREE": { "PRICE": 0, "TIME": 1 },
                "PERSONAL": { "PRICE": 100, "TIME": 1 },
                "PREMIUM": { "PRICE": 250, "TIME": 3 }
            },
            "VIDEO": {
                "FREE": { "PRICE": 0, "TIME": 1 },
                "PERSONAL": { "PRICE": 200, "TIME": 1 },
                "PREMIUM": { "PRICE": 500, "TIME": 3 }
            },
            "PODCAST": {
                "FREE": { "PRICE": 0, "TIME": 1 },
                "PERSONAL": { "PRICE": 100, "TIME": 1 },
                "PREMIUM": { "PRICE": 300, "TIME": 3 }
            }
        };

        this.topupPlans = {
            "FOUR_DEVICE": { "MAX_DEVICES": 4, "PRICE": 50, "TIME": 1 },
            "TEN_DEVICE": { "MAX_DEVICES": 10, "PRICE": 100, "TIME": 1 }
        };

        this.subscriptions = {};
        this.topupPlan = null;
        this.topupMonths = 0;
        this.subscriptionDate = null;
        this.errorFound = false;
    }

    // Validate date format
    isValidDateFormat(dateString) {
        const dateArray = dateString.split("-");
        if (dateArray.length !== 3) return false;
        const [day, month, year] = dateArray;
        return !isNaN(day) && !isNaN(month) && !isNaN(year) && day > 0 && day <= 31 && month > 0 && month <= 12;
    }

    // Convert Date to valid format
    parseToValidFormat(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    }

    // Parse Date from string
    parseDate(dateStr) {
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day); // month - 1 because JavaScript months are 0-based
    }

    // Read file and process commands
    readFile() {
        fs.readFile(this.filename, "utf8", (err, data) => {
            if (err) throw err;
            const commands = data.split(/\r?\n/);
            console.log(commands);

            commands.forEach(command => this.processCommand(command));
        });
    }

    // Process each command
    processCommand(command) {
        const cmdArray = command.split(/\s+/);

        switch (cmdArray[0]) {
            case "START_SUBSCRIPTION":
                this.startSubscription(cmdArray[1]);
                break;
            case "ADD_SUBSCRIPTION":
                this.addSubscription(cmdArray[1], cmdArray[2]);
                break;
            case "ADD_TOPUP":
                this.addTopup(cmdArray[1], cmdArray[2]);
                break;
            case "PRINT_RENEWAL_DETAILS":
                this.printRenewalDetails();
                break;
            default:
                break;
        }
    }

    // Start a new subscription
    startSubscription(date) {
        this.subscriptionDate = date;
        if (!this.isValidDateFormat(this.subscriptionDate)) {
            console.log("INVALID_DATE");
            this.errorFound = true;
        }
    }

    // Add a new subscription
    addSubscription(category, plan) {
        if (this.subscriptionPlans[category] && this.subscriptionPlans[category][plan]) {
            this.subscriptions[category] = plan;
        }
    }

    // Add a top-up plan
    addTopup(topupPlan, topupMonths) {
        if (this.topupPlans[topupPlan]) {
            this.topupPlan = topupPlan;
            this.topupMonths = topupMonths;
        }
    }

    // Reminder for renewal
    renewalReminder(category, durationMonths) {
        const parsedDate = this.parseDate(this.subscriptionDate);
        const renewalDate = new Date(parsedDate);
        renewalDate.setMonth(renewalDate.getMonth() + durationMonths);
        renewalDate.setDate(renewalDate.getDate() - 10);
        const formattedDate = this.parseToValidFormat(renewalDate);
        console.log(`RENEWAL_REMINDER ${category} ${formattedDate}`);
    }

    // Print renewal details
    printRenewalDetails() {
        if (Object.keys(this.subscriptions).length === 0) {
            console.log("SUBSCRIPTIONS_NOT_FOUND");
            this.errorFound = true;
            return;
        }

        if (this.errorFound) return;

        let totalCost = 0;

        for (const category in this.subscriptions) {
            const plan = this.subscriptions[category];
            const price = this.subscriptionPlans[category][plan].PRICE;
            const duration = this.subscriptionPlans[category][plan].TIME;
            this.renewalReminder(category, duration);
            totalCost += price;
        }

        if (this.topupPlan) {
            totalCost += this.topupMonths * this.topupPlans[this.topupPlan]["PRICE"];
        }

        console.log(`RENEWAL_AMOUNT ${totalCost}`);
    }
}

// Usage
const subscriptionManager = new SubscriptionManager(process.argv[2]);
subscriptionManager.readFile();
