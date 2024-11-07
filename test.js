//Add your tests here
// test/test.js
const { expect } = require("chai");
const SubscriptionManager = require("./geektrust")

describe("SubscriptionManager", function () {
    let subscriptionManager;

    beforeEach(function () {
        // Create a new instance before each test to isolate tests
        subscriptionManager = new SubscriptionManager("test.txt");
    });

    describe("isValidDateFormat", function () {
        it("should return true for a valid date format", function () {
            expect(subscriptionManager.isValidDateFormat("15-09-2024")).to.be.true;
        });

        it("should return false for an invalid date format", function () {
            expect(subscriptionManager.isValidDateFormat("2024-09-15")).to.be.false;
        });
    });

    describe("parseToValidFormat", function () {
        it("should return the date in DD-MM-YYYY format", function () {
            const date = new Date(2024, 8, 15); // September 15, 2024
            expect(subscriptionManager.parseToValidFormat(date)).to.equal("15-09-2024");
        });
    });

    describe("startSubscription", function () {
        it("should set subscriptionDate and not log an error for valid date", function () {
            subscriptionManager.startSubscription("15-09-2024");
            expect(subscriptionManager.subscriptionDate).to.equal("15-09-2024");
            expect(subscriptionManager.errorFound).to.be.false;
        });

        it("should log 'INVALID_DATE' and set errorFound to true for invalid date", function () {
            const consoleLogSpy = this.sinon.spy(console, "log");
            subscriptionManager.startSubscription("invalid-date");
            expect(consoleLogSpy.calledWith("INVALID_DATE")).to.be.true;
            expect(subscriptionManager.errorFound).to.be.true;
            consoleLogSpy.restore();
        });
    });

    describe("addSubscription", function () {
        it("should add a valid subscription", function () {
            subscriptionManager.startSubscription("15-09-2024"); // prerequisite
            subscriptionManager.addSubscription("MUSIC", "PERSONAL");
            expect(subscriptionManager.subscriptions["MUSIC"]).to.equal("PERSONAL");
        });

        it("should ignore adding a subscription if subscription date is invalid", function () {
            subscriptionManager.startSubscription("invalid-date");
            subscriptionManager.addSubscription("MUSIC", "PERSONAL");
            expect(subscriptionManager.subscriptions["MUSIC"]).to.be.undefined;
        });
    });

    describe("addTopup", function () {
        it("should add a valid top-up plan", function () {
            subscriptionManager.startSubscription("15-09-2024"); // prerequisite
            subscriptionManager.addTopup("FOUR_DEVICE", 3);
            expect(subscriptionManager.topupPlan).to.equal("FOUR_DEVICE");
            expect(subscriptionManager.topupMonths).to.equal(3);
        });

        it("should not add top-up if subscription is not started", function () {
            subscriptionManager.addTopup("FOUR_DEVICE", 3);
            expect(subscriptionManager.topupPlan).to.be.null;
            expect(subscriptionManager.topupMonths).to.equal(0);
        });
    });

    describe("renewalReminder", function () {
        it("should log the correct renewal reminder date for a subscription", function () {
            const consoleLogSpy = this.sinon.spy(console, "log");
            subscriptionManager.subscriptionDate = "15-09-2024";
            subscriptionManager.renewalReminder("MUSIC", 1);

            expect(consoleLogSpy.calledWith("RENEWAL_REMINDER MUSIC 05-10-2024")).to.be.true;
            consoleLogSpy.restore();
        });
    });

    describe("printRenewalDetails", function () {
        it("should print total renewal amount and renewal dates when subscriptions are valid", function () {
            const consoleLogSpy = this.sinon.spy(console, "log");
            subscriptionManager.startSubscription("15-09-2024");
            subscriptionManager.addSubscription("MUSIC", "PERSONAL");
            subscriptionManager.addSubscription("VIDEO", "PREMIUM");
            subscriptionManager.addTopup("FOUR_DEVICE", 2);

            subscriptionManager.printRenewalDetails();

            expect(consoleLogSpy.calledWith("RENEWAL_REMINDER MUSIC 05-10-2024")).to.be.true;
            expect(consoleLogSpy.calledWith("RENEWAL_REMINDER VIDEO 05-12-2024")).to.be.true;
            expect(consoleLogSpy.calledWith("RENEWAL_AMOUNT 850")).to.be.true;
            consoleLogSpy.restore();
        });

        it("should print 'SUBSCRIPTIONS_NOT_FOUND' if no subscriptions are added", function () {
            const consoleLogSpy = this.sinon.spy(console, "log");
            subscriptionManager.startSubscription("15-09-2024");

            subscriptionManager.printRenewalDetails();

            expect(consoleLogSpy.calledWith("SUBSCRIPTIONS_NOT_FOUND")).to.be.true;
            consoleLogSpy.restore();
        });
    });
});
