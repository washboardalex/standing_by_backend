"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyValue = exports.lessThan = exports.greaterThan = exports.formatCountries = void 0;
exports.formatCountries = (data) => {
    return data.map((item) => ({
        country: item.Country,
        countryCode: item.CountryCode,
        slug: item.Slug,
        newConfirmed: item.NewConfirmed,
        newDeaths: item.NewDeaths,
        totalDeaths: item.TotalDeaths,
        newRecovered: item.NewRecovered,
        totalRecovered: item.TotalRecovered,
        date: item.Date,
        premium: item.Premiums
    }));
};
exports.greaterThan = (a, b) => a > b;
exports.lessThan = (a, b) => a < b;
exports.getKeyValue = (key) => (obj) => obj[key];
//# sourceMappingURL=functions.js.map