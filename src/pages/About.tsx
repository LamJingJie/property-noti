import './About.css';

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

/*
TO-DO:

1. Write shit on this page about what the application is about.
*/

const About: React.FC = () => {
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

    /*const createNoti=async ()=>{
        let testdate: Date = new Date(2021, 3, 24, 15, 50, 0, 0)
        console.log(testdate);
        createNotification(1, testdate, "Title", "address", "dategroup", "End Date").then((res=>{
            console.log(res);
            console.log("Created!");
        })).catch((err=>{
            console.log(err);
        }))
     }

     const createNoti2=async ()=>{
        createNotification(2, new Date(), "Title2", "address2", "dategroup2", "End Date2").then((res=>{
            console.log(res);
            console.log("Created!");
        })).catch((err=>{
            console.log(err);
        }))
     }
 
     const deleteNoti=async()=>{
        deleteNotification(1);
     }
 
     const updateNoti = async()=>{
        await deleteNotification(1);
        await createNotification(1, new Date(), "Title Changed", "address CHanged", "dategroup Changed", "End Date Changed").then((res=>{
             console.log(res);
             console.log("Created!");
         })).catch((err=>{
             console.log(err);
         }))
     }*/

     const setState = () => {
         window.history.replaceState('about','about',null);
     }
    
    useIonViewWillEnter(()=>{
        setState();
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

   /*Btn for testing*/
   //<IonButton onClick={()=>createNoti()}>Create noti</IonButton>
    return(
        <IonPage>
            <ExploreContainer name={"About"} />

            <IonContent class="content"  fullscreen>
                
                <div id="about-info">
                    <IonTitle id="about-title">Welcome to Property-Noti!</IonTitle>
                    <IonCard className="background strip-shadow">
                        <IonCardHeader color="white" id="card-header">
                            <IonCardTitle id="card-title">About Us</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent id="no-spacing">
                            <ul>
                                <li>
                                    I am from Singapore and I build applications like this for fun. This application is the first app that I have built on my spare time and so, if there is any issues
                                    do feel free to contact me at <b>jingjie105@hotmail.com</b>! 
                                </li>
                                <li>
                                    I build this application to practice and keep-up my coding skills especially since I have graduated from my school.
                                    And now, awaiting for my enlistment. And I am bored at home.
                                </li>
                            </ul>                 
                            
                        </IonCardContent>
                    </IonCard>
                    <IonCard className="background strip-shadow">
                        <IonCardHeader color="white" id="card-header">
                            <IonCardTitle id="card-title">About App</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent id="no-spacing">
                            <ul>
                                <li>
                                    This application sends notification to your device based on the events that you set beforehand. It will
                                    be sent at 12am. The <b>Notification Date</b> cannot be after the <b>End Date</b>, and you cannot select any date
                                    before tomorrow (including today).
                                </li>
                             
                                <li>
                                    Doesn't require internet to function (except when getting the latitude and longitude of the address during the Adding or Editing of an event).
                                </li>
                                <li>
                                    Data is stored in your device cache.
                                </li>
                            </ul>         
                    </IonCardContent>
                    </IonCard>
                </div>
               

                <PageDesign />
            </IonContent>
        </IonPage>
    );
}

export default About;