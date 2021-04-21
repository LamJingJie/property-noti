//import firebase
import  fb  from '../firebaseConfig';

import { useState, useEffect } from "react";
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';

import { Storage, Drivers } from '@ionic/storage';

import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
let options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults:5,
};

export interface Property{
    id: number,
    title: string,
    address: string,
    allDay: boolean,
    start: Date,
    end: Date,
    noti: Date,
    longitude: number,
    latitude: number
}



const ITEMS_KEY = 'my-property';
const subject = new Subject();//For Home.tsx
const subject2 = new Subject();//For Event.txs
export const bsubject = new BehaviorSubject([]);

/*export const messageService = {
    sendMessage: (message: any) => subject.next({ text: message }),
    clearMessages: () => subject.next(),
    onMessage: () => subject.asObservable(),
    
   
};*/

const storage = new Storage({
    driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage]
});
storage.create();
console.log("Initialize storage")

//add
export function addProperty(item: Property): Promise<any> {
    //console.log(name);
    //console.log(address);
    //console.log(beginTime);
    //console.log(endTime);
    /*return fb.collection('property').add({
        propertyName: name,
        address: address,
        beginTime: beginTime,
        endTime: endTime,
        expired: expired
    });*/
    return storage.get(ITEMS_KEY).then((items: Property[]) =>{
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

//retrieve
export function getProperty(): Promise<Property[]> {
    
    return storage.get(ITEMS_KEY);

}


//retrieve


export const propertyService = {
    sendProperty: (prop: any)=> subject.next(prop), //use this for subsequent refresh, for when u add, edit or del property
    onProperty: () => subject.asObservable(),

    //For edit event to update the 'event.tsx' values
    onOneProperty: ()=> subject2.asObservable(),
    sendOneProperty: (prop: any)=> subject2.next(prop),
};


//update
export function editProperty(item: Property): Promise<any> {
    //console.log(item);
    return storage.get(ITEMS_KEY).then(async (items: Property[])=>{
        //If no items is inside storage
        if(!items || items.length === 0){
            return null;
        }
        let updatedItems: Property[] = [];
        
        for(let i of items){
            //if id in the storage is equal to the id that was passed in
            if(i.id === item.id){
                updatedItems.push(item);
            }else{
                updatedItems.push(i);
            }
        }

        return await storage.set(ITEMS_KEY, updatedItems); //override prev values array
    });
}


//delete
export function delProperty(id: number): Promise<any> {
    //console.log(id);

        return storage.get(ITEMS_KEY).then(async(items: Property[]) =>{
            if(!items || items.length === 0){
                return null;
            }
    
            //Determine which array is to be kept
            let toKeep: Property[] = [];
            for(let i of items){
                if(i.id !== id){
                    toKeep.push(i);
                }
            }
            //console.log(toKeep);
    
            return await storage.set(ITEMS_KEY, toKeep);

        })
   
}


export function get_location_from_address(address: string): Promise<any>{
    
    return NativeGeocoder.forwardGeocode(address, options).then((result: NativeGeocoderResult[]) => {
        //alert(parseFloat(result[0].latitude));
        //alert(parseFloat(result[0].longitude));
        return result;
    }).catch((err=>{
        return null;
    }));
}