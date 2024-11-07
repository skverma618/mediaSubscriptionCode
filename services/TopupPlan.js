class TopupPlan {
    constructor() {
        this.plans = {
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
        };
    }

    getTopupPrice(topupPlan, months) {
        const plan = this.plans[topupPlan];
        return plan ? plan.PRICE * months : 0;
    }
}

module.exports = TopupPlan;