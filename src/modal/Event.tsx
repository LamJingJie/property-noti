import './Event.css';

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



const Event: React.FC <{modal:boolean,setShowModal: any, data: object}> =  props => {
    const history = useHistory();
    const [event, setEvent] = useState<any>();
    const [showDelete, setShowDelete] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [msg, setMsg] = useState<string>();
    const [showToast, setShowToast] = useState(false);
    
    const onPresent = ()=>{
        console.log(props.data);
        setEvent(props.data);
    }

    const onDimiss = ()=>{
        props.setShowModal(false);
    }

    const onclick = ()=>{
        console.log(event);
        console.log(moment(event?.start.toString()).format('dddd MMMM D YYYY'));
        console.log(event?.id);
    }

    const deleteEventToast = ()=>{
        console.log("Deleted");
        setShowDelete(true);     
    }

    //toast
    const showToast_function = (msg: string) =>{
        setMsg(msg); 
        setShowToast(true);
    }


    return(
        <IonModal animated={true} swipeToClose={true} onWillPresent={() => onPresent()} onDidDismiss={() => onDimiss()} isOpen={props.modal} cssClass="content">
             <IonLoading
                cssClass='my-custom-class'
                isOpen={showLoading}
                message={'Deleting...'}
                onDidDismiss={() => setShowLoading(false)}
            />
             <IonHeader class="ion-no-border">
                <IonToolbar class="background">
                    <IonButtons slot="start"  onClick={() => onDimiss()}>
                        <IonIcon size="large" md={arrowBackSharp}></IonIcon>
                    </IonButtons>
                    <IonTitle>Event</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent style={{height:'100%'}}>    
            
                <div className="content_event" >                
                        <div className="grid-container">
                            <IonIcon id="title-icon" className='icon' color="secondary" md={text} />
                            <IonText id="title-txt" className='text end-of-item' >{event?.title}</IonText>
                            
                            <IonIcon id="address-icon" className='icon' color="secondary" md={locationOutline} />
                            <IonText id="address-txt" className='text end-of-item' >{event?.address}</IonText>

                            <IonIcon id="time-icon" className='icon' color="secondary" md={timeOutline} />
                            <div id="time-txt" className="text end-of-item">
                                <div className="time-content text">Start: {moment(event?.start.toString()).format('dddd MMMM D YYYY')}</div>
                                <div className="time-content">End: {moment(event?.end.toString()).format('dddd MMMM D YYYY')}</div>
                                <div className="time-content">Notify: {moment(event?.noti.toString()).format('dddd MMMM D YYYY')}</div>
                            {event?.allDay === true &&
                                <div className="time-content" id="allday">All day</div>
                            }
                            </div>

                            <div id="google-map">
                                Google Map will be placed here!
                            </div>                           
                        </div>               
                </div>
            </IonContent>
            <IonFooter className="background footer">
                <div style={{ display: 'flex' }}>
                    <IonButton size="large" class="background strip-shadow footer-btn"  >
                        <IonIcon id="icon-footer" md={shareSocialOutline} />
                        <IonLabel id="label-footer">Share</IonLabel>            
                    </IonButton>
                    <IonButton size="large" class="background strip-shadow footer-btn" >
                        <IonIcon id="icon-footer" md={pencilOutline} />
                        <IonLabel id="label-footer">Edit</IonLabel>                       
                    </IonButton>
                    <IonButton onClick={() => deleteEventToast()} size="large" class="background strip-shadow footer-btn">
                        <IonIcon id="icon-footer" md={trashBinOutline} />
                        <IonLabel id="label-footer">Delete</IonLabel>
                    </IonButton>
                </div>
            </IonFooter>

            <IonToast
                isOpen={showDelete}
                onDidDismiss={() => setShowDelete(false)}
                message="Delete this event?"
                position="bottom"
                keyboardClose={true}
                buttons={[                
                    {
                        text: 'CANCEL',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'DELETE',
                        handler: () => {
                            console.log('delete clicked');
                            setShowLoading(true);
                            delProperty(event?.id).then((res=>{
                                console.log(res);
                                propertyService.sendProperty(res);                               
                                onDimiss();
                                setShowLoading(false);
                                showToast_function("Successfully Deleted!");
                            })).catch((err=>{
                                setShowLoading(false);
                                showToast_function(err);
                            }))
                            
                        }
                    }
                ]}
            />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={msg}
                duration={5000}
                buttons={[
                    {
                        text: 'ok',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]}
            />
            
        </IonModal>
 
    );

}

export default Event;