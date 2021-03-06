import { db } from "../../db/db";
import { AlertCondition, AlertType, IAlert } from "../../models/IAlert";

interface NewAlertDbFormat {
    country_id: number 
    type: AlertType,
    condition: AlertCondition,
    value: number,
    alert_id: number
}

export interface ExistingAlertDbFormat {
    alert_id: number,
    condition: AlertCondition,
    value: number,
    type: AlertType,
    country_id: number,
    country_code: string,
    country_name: string,
    country_slug: string,
    fcm_token_id: number,
    device_id: string,
    token: string
}

export const formatNewAlertView = (dbFormat : NewAlertDbFormat, countryName : string, country_slug : string) :  IAlert => ({
    country: countryName, 
    countrySlug: country_slug,
    type: dbFormat.type,
    condition: dbFormat.condition,
    value: dbFormat.value,
    id: dbFormat.alert_id
});

export const formatExistingAlertView = (dbFormat : ExistingAlertDbFormat) : IAlert => ({
    country: dbFormat.country_name, 
    countrySlug: dbFormat.country_slug, 
    type: dbFormat.type,
    condition: dbFormat.condition,
    value: dbFormat.value,
    id: dbFormat.alert_id
});