class SubscriptionPlan {
    constructor() {
        this.plans = {
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
        };
    }

    getPlanDetails(category, plan) {
        return this.plans[category]?.[plan];
    }
}

module.exports = SubscriptionPlan;