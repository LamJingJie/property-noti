//import firebase
import  fb  from '../firebaseConfig';

import { useState, useEffect } from "react";
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';

import { Storage, Drivers } from '@ionic/storage';

export interface Property{
    id: number,
    title: string,
    address: string,
    allDay: boolean,
    start: Date,
    end: Date,
    noti: Date,
}



const ITEMS_KEY = 'my-property';

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


//update
export function editProperty(item: Property): Promise<any> {
    
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

        await storage.set(ITEMS_KEY, updatedItems); //override prev values array
    });
}


//delete
export function delProperty(id: number): Promise<any> {
    return storage.get(ITEMS_KEY).then(async(items: Property[]) =>{
        if(!items || items.length === 0){
            return null;
        }

        //Determine which array is to be kept
        let toKeep: Property[] = [];
        for(let i of items){
            if(i.id === id){
                toKeep.push(i);
            }
        }

        await storage.set(ITEMS_KEY, toKeep);
    })
}