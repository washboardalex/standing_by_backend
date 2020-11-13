"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCountries = void 0;
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
//# sourceMappingURL=functions.js.map