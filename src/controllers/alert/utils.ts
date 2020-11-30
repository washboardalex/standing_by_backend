import { db } from "../../db/db";
import { AlertCondition, AlertType, IAlert } from "../../models/IAlert";

interface AlertDbFormat {
    country_id: number 
    type: AlertType,
    condition: AlertCondition,
    value: number,
    alert_id: number
}

export const formatNewAlertView = (dbFormat : AlertDbFormat, countryName : string) :  IAlert => {
    return {
        country: countryName, 
        type: dbFormat.type,
        condition: dbFormat.condition,
        value: dbFormat.value,
        id: dbFormat.alert_id
    }
};
