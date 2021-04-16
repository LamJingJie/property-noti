//local notification
//import { LocalNotificationRequest, Plugins, LocalNotification, LocalNotificationActionPerformed } from '@capacitor/core';
import { useState, useEffect } from "react";
import { isPlatform } from '@ionic/react';
import { Schedule, LocalNotifications, LocalNotificationSchema, ActionPerformed, LocalNotificationDescriptor} from '@capacitor/local-notifications';

export interface Notification{
    id: number,
    title: string,
    address: string,
    end: string,
    date_received: Date,
    propertyid: number,
}

//create
export async function createNotification(id:number, date: Date, title: string, address: string, dategroup:string, enddate: string): Promise<object> {
    //console.log(date);
    return await LocalNotifications.schedule({
        notifications: [
            {
                title:title + " (" + address + ") ",
                body: "Ending at " + enddate + "!",
                group:dategroup,
                groupSummary:true,
                id: id,
                extra:{
                    data: address
                },
                iconColor: '#0000FF',
                schedule: { at: new Date(Date.now() + 1000 * 5) }, 
            }
        ]
    })
}


//delete
export async function deleteNotification(id: number): Promise<any> {
    const  notifications: LocalNotificationDescriptor[] = [{ id : id}];
    return await LocalNotifications.cancel({notifications});

}


