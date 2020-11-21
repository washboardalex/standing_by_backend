export type AlertCondition = 'greaterThan' | 'lessThan';
export type AlertType = 'newDeaths' | 'newConfirmed';

export interface IAlert {
    country: string,
    type: AlertType,
    condition: AlertCondition,
    value: number,
    id?: number
}
