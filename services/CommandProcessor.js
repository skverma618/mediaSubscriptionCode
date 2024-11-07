class CommandProcessor {
    constructor(subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
    }

    process(command) {
        const cmdArray = command.split(/\s+/);
        const action = cmdArray[0];
        const args = cmdArray.slice(1);

        switch (action) {
            case "START_SUBSCRIPTION":
                this.subscriptionManager.startSubscription(args[0]);
                break;
            case "ADD_SUBSCRIPTION":
                this.subscriptionManager.addSubscription(args[0], args[1]);
                break;
            case "ADD_TOPUP":
                this.subscriptionManager.addTopup(args[0], args[1]);
                break;
            case "PRINT_RENEWAL_DETAILS":
                this.subscriptionManager.printRenewalDetails();
                break;
            default:
                console.log("UNKNOWN_COMMAND");
                break;
        }
    }
}

module.exports = CommandProcessor;