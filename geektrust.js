const { Console } = require("console")
const fs = require("fs")

const filename = process.argv[2]

const subscriptionPlans = {
    "MUSIC": {
        "FREE": {
            "PRICE": 0,
            "TIME": 1
        },
        "PERSONAL": {
            "PRICE": 100,
            "TIME": 1
        },
        "PREMIUM": {
            "PRICE": 250,
            "TIME": 3
        }
    },
    "VIDEO": {
        "FREE": {
            "PRICE": 0,
            "TIME": 1
        },
        "PERSONAL": {
            "PRICE": 200,
            "TIME": 1
        },
        "PREMIUM": {
            "PRICE": 500,
            "TIME": 3
        }
    },
    "PODCAST": {
        "FREE": {
            "PRICE": 0,
            "TIME": 1
        },
        "PERSONAL": {
            "PRICE": 100,
            "TIME": 1
        },
        "PREMIUM": {
            "PRICE": 300,
            "TIME": 3
        }
    }
}

const TopupPlans = {
    "FOUR_DEVICE": {
        "MAX_DEVICES": 4,
        "PRICE": 50,
        "TIME": 1
    },
    "TEN_DEVICE": {
        "MAX_DEVICES": 10,
        "PRICE": 100,
        "TIME": 1
    }
}

const isValidDateFormat = (dateString) => {
    const dateArray = dateString.split("-");
    if (dateArray.length !== 3) return false;
    const [day, month, year] = dateArray;
    return !isNaN(day) && !isNaN(month) && !isNaN(year) && day > 0 && day <= 31 && month > 0 && month <= 12;
}

const parseToValidFormat = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
}

const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // month - 1 because JavaScript months are 0-based
}

fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err;
    const commands = data.split(/\r?\n/);
    console.log(commands);
    let subscriptionDate;
    let subscriptions = {};
    let topupPlan;
    let topupMonths = 0;
    let errorFound = false;

    commands.forEach(command => {
        const cmdArray = command.split(/\s+/);
        if (cmdArray[0] === "START_SUBSCRIPTION") {
            subscriptionDate = cmdArray[1];
            if (!isValidDateFormat(subscriptionDate)) {
                console.log("INVALID_DATE");
                errorFound = true;
            }
        } else if (cmdArray[0] === "ADD_SUBSCRIPTION") {
            const category = cmdArray[1];
            const plan = cmdArray[2];

            if (subscriptionPlans[category] && subscriptionPlans[category][plan]) {
                subscriptions[category] = plan;
            }
        } else if (cmdArray[0] === "ADD_TOPUP") {
            topupPlan = cmdArray[1];
            topupMonths = cmdArray[2];
        } else if (cmdArray[0] === "PRINT_RENEWAL_DETAILS") {
            if (subscriptions.length === 0) {
                console.log("SUBSCRIPTIONS_NOT_FOUND");
                errorFound = true;
                return;
            }
            if (errorFound) return;
            printRenewalDetails(subscriptionDate, subscriptions, topupPlan, topupMonths);
        }
    })


})

const renewalReminder = (subscriptionDate, category, durationMonths) => {
    const parsedDate = parseDate(subscriptionDate);
    const renewalDate = new Date(parsedDate);
    renewalDate.setMonth(renewalDate.getMonth() + durationMonths);
    renewalDate.setDate(renewalDate.getDate() - 10);
    const formattedDate = parseToValidFormat(renewalDate);
    console.log(`RENEWAL_REMINDER ${category} ${formattedDate}`);
}

const printRenewalDetails = (subscriptionDate, subscriptions, topupPlan, topupMonths) => {
    let totalCost = 0;
    for (const category in subscriptions) {
        const plan = subscriptions[category];
        const price = subscriptionPlans[category][plan].PRICE;
        const duration = subscriptionPlans[category][plan].TIME;
        renewalReminder(subscriptionDate, category, duration);
        totalCost += price;
    }
    totalCost += topupMonths * TopupPlans[topupPlan]["PRICE"];
    console.log(`RENEWAL_AMOUNT ${totalCost}`);
}
