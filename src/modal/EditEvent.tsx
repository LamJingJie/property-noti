import './EditEvent.css';

import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect,
    IonFab, IonFabButton, IonIcon, IonList, IonListHeader, useIonViewWillEnter, useIonViewWillLeave, 
    withIonLifeCycle, IonItem, IonLabel, IonText, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, 
    IonCardContent, IonModal, isPlatform,getPlatforms, useIonViewDidEnter, useIonViewDidLeave, IonGrid, IonRow, IonCol,
    IonButtons,
    IonFooter,
    IonTabButton,
    IonTabBar,
    IonRippleEffect, IonLoading,
    IonToast,} from '@ionic/react';
    import { useParams } from 'react-router';
    import React, { useState, useEffect } from "react";
    
    import { Calendar, momentLocalizer } from 'react-big-calendar'
    import 'react-big-calendar/lib/css/react-big-calendar.css';
    import moment from 'moment';
    import { useHistory } from 'react-router-dom';
    
    //Icons
    import {
        archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
        trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline,
        addCircleOutline, addCircle, addCircleSharp, addSharp, arrowBackSharp, backspace, text, shareSocialOutline, pencilOutline, trashBinOutline,
        locationOutline, timeOutline
      } from 'ionicons/icons';
    
    //CRUD
    import { getProperty, Property, delProperty, propertyService } from '../hooks/property';
    
    //Title & Menu function
    import ExploreContainer from '../components/ExploreContainer';
    
    //background designs
    import PageDesign from '../components/pageDesign';


const EditEvent: React.FC = () => {
  return (
    <div>
      hi
    </div>
    
  );
};

export default EditEvent;
