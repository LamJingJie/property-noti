import './Outbox.css';

import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect
, IonImg } from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState, useEffect } from "react";



//import firebase
import  fb  from '../firebaseConfig';

//Menu
import ExploreContainer from '../components/ExploreContainer';

//background designs
import PageDesign from '../components/pageDesign';

const Outbox: React.FC = () => {

   
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