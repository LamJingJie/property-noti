import './Outbox.css';

import {
    IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect,
    IonFab, IonFabButton, IonIcon, IonList, IonListHeader, useIonViewWillEnter, useIonViewWillLeave,
    withIonLifeCycle, IonItem, IonLabel, IonText, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonCardContent, IonModal, isPlatform, getPlatforms, useIonViewDidEnter, useIonViewDidLeave, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
//CRUD
import { getProperty, Property } from '../hooks/property';


//import firebase
import fb from '../firebaseConfig';

//Menu
import ExploreContainer from '../components/ExploreContainer';

//background designs
import PageDesign from '../components/pageDesign';
import { Subscription } from 'rxjs';

const Outbox: React.FC = () => {
    let subscription: Subscription;
    const [messages, setMessages] = useState<any>([]);

    /*const sendMessage = ()=>{
        console.log("Send Msg");
        // send message to subscribers via observable subject
        messageService.sendMessage('Message from Home Page Component to App Component!');
    }

    const clearMessages = ()=>{
        console.log("Clear Msg");
        messageService.clearMessages();
    }*/

    
    useIonViewWillEnter(()=>{

        /*subscription = messageService.onMessage().subscribe((message: any) => {
            if (message) {
                // add message to local state if not empty
                console.log("Message");
                console.log(messages)
                setMessages((messages: any) => [...messages, message]);
            } else {
                // clear messages when empty message received
                console.log("No Message");
                setMessages([]);
            }
        });*/
        

        
    })

    useIonViewWillLeave(()=>{
        //subscription.unsubscribe();
    })

   
    return(
        <IonPage>
            <ExploreContainer name={"Expired"} />

            <IonContent class="content"  fullscreen>


                <PageDesign />
            </IonContent>
        </IonPage>
    );
}

export default Outbox;