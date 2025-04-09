export const countryMap = {
    BEL: 'Belgium',
    FRA: 'France',
    USA: 'United States',
    GBR: 'United Kingdom',
    DEU: 'Germany',
    ESP: 'Spain',
    ITA: 'Italy',
    NLD: 'Netherlands',
    VNM: 'Vietnam',
    KOR: 'South Korea',
    JPN: 'Japan',
    CHN: 'China',
    IND: 'India',
    CAN: 'Canada',
    AUS: 'Australia',
};

export const countryOptions = Object.entries(countryMap).map(
    ([value, label]) => ({ value, label })
);

export const mapCountry = (code) => countryMap[code] || code;
