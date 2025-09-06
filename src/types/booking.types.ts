export enum BookingStep {
    SEARCH = 'search',
    RESULTS = 'results',
    PASSENGER = 'passenger',
    SEATS = 'seats',
    EXTRAS = 'extras',
    PAYMENT = 'payment',
    CONFIRMATION = 'confirmation',
}

export enum TripType {
    ONE_WAY = 'oneway',
    RETURN = 'return',
}

export enum FlightClass {
    ECONOMY = 'economy',
    PREMIUM = 'premium',
    BUSINESS = 'business',
}

export interface FlightPrices {
    [FlightClass.ECONOMY]: number;
    [FlightClass.PREMIUM]: number;
    [FlightClass.BUSINESS]: number;
}

export interface Flight {
    id: number;
    airline: string;
    from: string;
    to: string;
    departureTime: Date;
    arrivalTime: Date;
    stops: number;
    prices: FlightPrices;
    selectedClass?: FlightClass;
    selectedPrice?: number;
}

export interface LocationOption {
    label: string;
    value: string;
}

export interface FlightSearchData {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    tripType: TripType;
    passengerCount: number;
}

export interface Seat {
    id: string;
    row: string;
    letter: string;
    class: FlightClass;
    price: number;
}

export interface PassengerExtras {
    checkedBaggage?: {
        selected: boolean;
        weight: string;
        price: number;
    };
    meals?: {
        selected: boolean;
        price: number;
    };
    baggageInsurance?: {
        selected: boolean;
        price: number;
    };
}

export interface Passenger {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passport: string;
    nationality: string;
    dateOfBirth: string;
    gender: string;
    passportExpiry: string;
    seat?: Seat;
    extras?: PassengerExtras;
}

export interface GlobalAssistance {
    type: 'normal' | 'gold' | 'premium';
    price: number;
}

export interface BookingData {
    search: FlightSearchData;
    outboundFlight: Flight | null;
    returnFlight: Flight | null;
    passengers: Passenger[];
    assistance: GlobalAssistance | null;
    totalPrice: number;
}