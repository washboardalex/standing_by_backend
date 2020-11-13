interface ITimeSeriesPoint {
    updated_at: string,
    data: string,
    deaths: number | null,
    confirmed: number | null,
    recovered: number | null,
    active: number | null,
    new_confirmed: number | null,
    new_recovered: number | null,
    new_deaths: number | null,
    is_in_progress: boolean
}

export default ITimeSeriesPoint;