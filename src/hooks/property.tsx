//import firebase
import  fb  from '../firebaseConfig';

import { useState, useEffect } from "react";
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';



//add
export function addProperty() {

    
}


//retrieve
export function getProperty(expired: boolean) {


    return fb.collection('property').where('expired', '==', expired);

}


//update
export function editProperty() {

    

}


//delete
export function delProperty() {

    

}




//Check whenever user refresh or goes back to a page, whether the time has met (meaning expired) and if so, update 
//the 'expired' boolean to true
export function propertyExpired(){

}