const fs = require("fs");
const SubscriptionPlan = require("./services/SubscriptionPlan");
const TopupPlan = require("./services/TopupPlan");
const DateUtils = require("./services/DateUtils");
const CommandProcessor = require("./services/CommandProcessor");

class SubscriptionManager {
    constructor(filename) {
        this.filename = filename;
        this.subscriptionPlan = new SubscriptionPlan();
        this.topupPlan = new TopupPlan();
        this.subscriptions = {};
        this.topupDetails = { plan: null, months: 0 };
        this.subscriptionDate = null;
        this.errorFound = false;
    }

    readFile() {
        fs.readFile(this.filename, "utf8", (err, data) => {
            if (err) throw err;
            const commands = data.split(/\r?\n/);
            const processor = new CommandProcessor(this);

            commands.forEach(command => processor.process(command));
        });
    }

    startSubscription(date) {
        this.subscriptionDate = date;
        if (!DateUtils.isValidDateFormat(this.subscriptionDate)) {
            console.log("INVALID_DATE");
            this.errorFound = true;
        }
    }

    addSubscription(category, plan) {
        const planDetails = this.subscriptionPlan.getPlanDetails(category, plan);
        if (planDetails) {
            this.subscriptions[category] = plan;
        } else {
            console.log("INVALID_SUBSCRIPTION");
        }
    }

    addTopup(topupPlan, topupMonths) {
        if (this.topupPlan.plans[topupPlan]) {
            this.topupDetails.plan = topupPlan;
            this.topupDetails.months = topupMonths;
        } else {
            console.log("INVALID_TOPUP");
        }
    }

    renewalReminder(category, durationMonths) {
        const parsedDate = DateUtils.parseDate(this.subscriptionDate);
        const renewalDate = new Date(parsedDate);
        renewalDate.setMonth(renewalDate.getMonth() + durationMonths);
        renewalDate.setDate(renewalDate.getDate() - 10);
        const formattedDate = DateUtils.formatToValidDate(renewalDate);
        console.log(`RENEWAL_REMINDER ${category} ${formattedDate}`);
    }

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
            const { PRICE, TIME } = this.subscriptionPlan.getPlanDetails(category, plan);
            this.renewalReminder(category, TIME);
            totalCost += PRICE;
        }

        if (this.topupDetails.plan) {
            totalCost += this.topupPlan.getTopupPrice(this.topupDetails.plan, this.topupDetails.months);
        }

        console.log(`RENEWAL_AMOUNT ${totalCost}`);
    }
}


// Usage
const filename = process.argv[2];
const subscriptionManager = new SubscriptionManager(process.argv[2]);
subscriptionManager.readFile();