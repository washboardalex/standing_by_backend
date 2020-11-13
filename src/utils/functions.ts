import ICountrySummary from "../models/covidapi/ICountrySummary";

export const formatCountries = (data : Array<any>) : Array<ICountrySummary> => {
    return data.map((item: any) : ICountrySummary => ({
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
}

export const greaterThan = (a: number, b: number) : boolean => a > b;
export const lessThan = (a: number, b: number) : boolean => a < b;
export const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>
obj[key];