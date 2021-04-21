//local notification
//import { LocalNotificationRequest, Plugins, LocalNotification, LocalNotificationActionPerformed } from '@capacitor/core';
import { useState, useEffect } from "react";
import { isPlatform } from '@ionic/react';
import { Schedule, LocalNotifications, LocalNotificationSchema, ActionPerformed, LocalNotificationDescriptor} from '@capacitor/local-notifications';
import { Storage, Drivers } from '@ionic/storage';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

export interface Notification{
    id: number,
    title: string,
    address: string,
    end: string,
    date_received: Date,
    propertyid: number,
    hasRead: boolean,
}

const ITEMS_KEY = 'my-notification';
const storage = new Storage({
    driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
});
storage.create();
/*----------Local Storage-----------*/


//Retrieve notification in local storage based on filter
export function getFilteredNotification(hasRead_filter: boolean): Promise<any>{
    return storage.get(ITEMS_KEY).then((items: Notification[])=>{
        if(!items || items.length === 0){
            return null;
        }

        let filtered_Notification: Notification[] = [];
        for(let i of items){
            if(i.hasRead === hasRead_filter){
                filtered_Notification.push(i);
            }
        }
        return filtered_Notification;
    })
}

//retrieve all notification
export function getAllNotification(): Promise<Notification[]> {
    return storage.get(ITEMS_KEY);
}

export function addNotification(item: Notification): Promise<any> {
    
    return storage.get(ITEMS_KEY).then((items: Notification[]) =>{
        //Check if items exists in storage
        if(items){
            items.push(item);
            return storage.set(ITEMS_KEY, items);
        }else{
            //in the beginning this will run
            return storage.set(ITEMS_KEY, [item]);
        }
    });
}

//delete
export function delOneNotification(id: number): Promise<any> {
    //console.log(id);

    return storage.get(ITEMS_KEY).then(async (items: Notification[]) => {
        if (!items || items.length === 0) {
            return null;
        }

        //Determine which array is to be kept
        let toKeep: Notification[] = [];
        for (let i of items) {
            if (i.id !== id) {
                toKeep.push(i);
            }
        }
        //console.log(toKeep);

        return await storage.set(ITEMS_KEY, toKeep);

    })
}

export function delAllNotification(): Promise<any>{
    return storage.remove(ITEMS_KEY);
}

/*----------END----------*/


/*----------Notifications---------*/


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
                autoCancel: false,
                id: id,
                extra:{
                    data_address: address,
                    data_title: title,
                    data_enddate: enddate,
                    data_dategroup: dategroup
                },
                iconColor: '#0000FF',
                schedule: { at: date }, 
            }
        ]
    })
}


//delete
export async function deleteNotification(id: number): Promise<any> {
    const  notifications: LocalNotificationDescriptor[] = [{ id : id}];
    return await LocalNotifications.cancel({notifications});

}

/*----------END----------*/
