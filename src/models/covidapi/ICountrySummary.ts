interface ICountrySummary {
    country: string,
    countryCode: string,
    slug: string,
    newConfirmed: number,
    newDeaths: number,
    totalDeaths: number,
    newRecovered: number,
    totalRecovered: number,
    date: string,
    premium: any
}

export default ICountrySummary;
