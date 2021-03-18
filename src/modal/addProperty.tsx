import './addProperty.css';

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

//Title & Menu function
import ExploreContainer from '../components/ExploreContainer';


  
  const addProperty: React.FC<{modal:boolean,showModal: any}> =  props => {
    return (
        <div>
            <IonModal isOpen={props.modal} cssClass="content">
                <IonHeader class="header">
                    <IonToolbar>

                        <IonTitle className="title">Add Property</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div>
                    <div id="data-content">Add Property form here!</div>
                    <IonButton onClick={() => props.showModal(false)}>Close Modal</IonButton>
                </div>

            </IonModal>

        </div>
    );
  };
  
  export default addProperty;