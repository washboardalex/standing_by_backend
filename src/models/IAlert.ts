export type AlertCondition = 'greaterThan' | 'lessThan';
export type TypeCondition = 'newDeaths' | 'newConfirmed';

export interface IAlert {
    country: string,
    type: TypeCondition,
    condition: AlertCondition,
    value: number,
    id?: number
}
