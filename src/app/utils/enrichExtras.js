import {extrasPricing} from "../constants/extrasPricing";

export function enrichExtras(extras) {
    return {
        meals: {
            ...extras.meals,
            price: extras.meals?.selected ? extrasPricing.meals : 0,
        },
        assistance: {
            ...extras.assistance,
            price: extras.assistance?.type
                ? extrasPricing.assistanceTiers[extras.assistance.type] || 0
                : 0,
        },
        baggageInsurance: {
            ...extras.baggageInsurance,
            price: extras.baggageInsurance?.selected ? extrasPricing.baggageInsurance : 0,
        },
        checkedBaggage: {
            ...extras.checkedBaggage,
            price: extras.checkedBaggage?.selected
                ? extrasPricing.checkedBaggage.weights[extras.checkedBaggage.weight || '20']
                : 0,
        }
    };
}
