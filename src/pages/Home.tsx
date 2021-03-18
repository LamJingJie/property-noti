import './Home.css';

import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect,
IonFab, IonFabButton, IonIcon, IonList, IonListHeader, useIonViewWillEnter, useIonViewWillLeave,
withIonLifeCycle, IonItem, IonLabel, IonText, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, 
IonCardContent, IonModal } from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState, useEffect } from "react";

//Icons
import {
    archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
    trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline,
    addCircleOutline, addCircle, addCircleSharp, addSharp
  } from 'ionicons/icons';

//firebase
import { getProperty } from '../hooks/property';

//Title & Menu function
import ExploreContainer from '../components/ExploreContainer';

//background designs
import PageDesign from '../components/pageDesign';

//modals
import AddProperty from '../modal/addProperty';

import { Subscription } from 'rxjs';



const Home: React.FC = () => {
 
    let unsub_get: () => void; //store listener

    const [addProp_Modal, setAdd_Modal] = useState(false);
 

    useIonViewWillEnter(()=>{

        unsub_get = getProperty(true).onSnapshot((snapshot) => {
            //...
            
            console.log(snapshot.size);
            snapshot.forEach((res) =>{
                console.log(res.data());
            })
          }, (error) => {
            //...
            console.log(error);
          });
        console.log("Enter");

    })
   


    useIonViewWillLeave(()=>{
        
        //Unsubscribe / Stop listening
        if(unsub_get){
            unsub_get();
        }
        console.log("leave");
    })
   

    return(

        <IonPage>
            
            <ExploreContainer name={"Home"} />
 
            <IonContent class="content"  fullscreen>
                <div>
                    <div>
                        <div className="background">
                            <IonList class ="list">
                                <IonListHeader>
                                    Expiring Property
                                </IonListHeader>
                               <IonCard class="background">
                                   <br></br> <br></br> 
                                    <IonCardHeader>
                                        <IonCardSubtitle id="data-content">Address</IonCardSubtitle>
                                        <IonCardTitle id="data-content">Property Name</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent class="important">
                                        Time Left
                                    </IonCardContent>
                               </IonCard>
                            </IonList>
                        </div>
                    </div>
                </div>
                <div>
                    <AddProperty modal={addProp_Modal} showModal={setAdd_Modal}  />
                    <IonFab  slot="fixed" vertical="bottom" horizontal="end">
                        <IonFabButton class="transparent-btn" size="small" onClick={() => setAdd_Modal(true)} >
                            <IonIcon md={addCircle}></IonIcon>
                        </IonFabButton>
                    </IonFab>
                </div>
                



                <PageDesign />
            </IonContent>
        </IonPage>
       
    );
    
}


export default Home;
