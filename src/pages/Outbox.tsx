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

//local notification
import { deleteNotification, createNotification } from '../hooks/notification';

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

    const createNoti=async ()=>{
       /*createNotification(1).then((res=>{
           console.log(res);
           console.log("Created!");
       })).catch((err=>{
           console.log(err);
       }))*/
    }

    const deleteNoti=async()=>{
       deleteNotification(1);
    }

    const updateNoti = async()=>{
       
    }

    
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
                <IonButton onClick={()=> createNoti()}>Create Noti</IonButton>
                <IonButton onClick={()=> deleteNoti()}>Delete Noti</IonButton>
                <IonButton onClick={()=> updateNoti()}>Update Noti</IonButton>

                <PageDesign />
            </IonContent>
        </IonPage>
    );
}

export default Outbox;