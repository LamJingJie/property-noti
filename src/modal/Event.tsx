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
import React, { useState, useEffect, useRef } from "react";

import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { Subscription } from 'rxjs';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';


//Icons
import {
    archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
    trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline,
    addCircleOutline, addCircle, addCircleSharp, addSharp, arrowBackSharp, backspace, text, shareSocialOutline, pencilOutline, trashBinOutline,
    locationOutline, timeOutline, refreshOutline, bodyOutline, callOutline, idCardOutline, manOutline, expandOutline, pricetagOutline
  } from 'ionicons/icons';

//CRUD
import { getProperty, Property, delProperty, propertyService, get_location_from_address, editProperty } from '../hooks/property';
import { deleteNotification, createNotification } from '../hooks/notification';

//Title & Menu function
import ExploreContainer from '../components/ExploreContainer';

//background designs
import PageDesign from '../components/pageDesign';

//Modal
import EditEvent from './EditEvent';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'


const Event: React.FC <{modal:boolean,setShowModal: any, data: any, resetState: any}> =  props => {
    //map
    const animateRef = useRef(false)
    let state = {
        keyMAP: Math.random(),
     };

    //Subscription
    let eventSub: Subscription;

    //Load
    const [showLoading, setShowLoading] = useState(false);
    const [showLoadingMap, setShowLoadingMap] = useState(false);

    const history = useHistory();
    const [event, setEvent] = useState<any>();
    const [showDelete, setShowDelete] = useState(false);
    const [msg, setMsg] = useState<string>();
    const [showToast, setShowToast] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);//ensure modal is completely initialized before loading map
    const [latlongErr, setlatlongErr] = useState(false);//check if latlong is 0 (lat long error), false if not, true if so.

    //Edit Event Modal
    const [showEditEvent, setShowEditEvent] = useState(false);
    
    const onPresent = ()=>{    
        
        setEvent(props.data);  

        //check if latitude and longitude is invalid (0,0)
        if(props.data?.latitude === 0 && props.data?.longitude === 0){
            setlatlongErr(true);
        }    
        eventSub= propertyService.onOneProperty().subscribe((res: any)=>{
            setlatlongErr(false);
            //console.log(res);
            setEvent(res);

            //check if latitude and longitude is invalid (0,0)
            if(res.latitude === 0 && res.longitude === 0){
                setlatlongErr(true);
            }
        });   
        //console.log("Latitude: " + latitude + " Longitude: " + longitude); 
    }

    const refreshmap = ()=>{
        setShowLoadingMap(true);
        get_location_from_address(event?.address).then((val => {
            if (val === null || val == undefined) {
                showToast_function("No Internet or Invalid Address!");
                setShowLoadingMap(false);
                return;
            }
            let result: NativeGeocoderResult[] = val;

            event.latitude =  result[0].latitude;
            event.longitude = result[0].longitude;

            //update localstorage for event with the updated latitude and longitude
            editProperty(event).then((res=>{
                propertyService.sendOneProperty(event);//for subscription in 'event.tsx'. Returns only the updated object
                propertyService.sendProperty(res);//for the subscription in the 'home.tsx'. Returns entire list of updated array      
                setShowLoadingMap(false); 
            })).catch((err=>{
                setShowLoadingMap(false);
                showToast_function(err);
            }))         
            
        })).catch((err=>{
            setShowLoadingMap(false);
            showToast_function(err);
        }))
    }

    const onDidPresent=()=>{
        setIsLoaded(true);
    }

    const onDimiss = async ()=>{
        setIsLoaded(false);
        setlatlongErr(false);
        await props.resetState();
        if(eventSub){
            eventSub.unsubscribe();
        } 
        props.setShowModal(false);
    }

    const deleteEventToast = ()=>{
        //console.log("Deleted");
        setShowDelete(true);     
    }

    const editEventBtn = ()=>{
        setShowEditEvent(true);     
    }

    //toast
    const showToast_function = (msg: string) =>{
        setMsg(msg); 
        setShowToast(true);
    }


    return(
        <IonModal animated={true} swipeToClose={true}  onWillPresent={() => onPresent()} onDidPresent={()=> onDidPresent()} onDidDismiss={() => onDimiss()} isOpen={props.modal} cssClass="content">
            
            <IonLoading
                cssClass='my-custom-class'
                isOpen={showLoading}
                message={'Deleting...'}
                onDidDismiss={() => setShowLoading(false)}
            />

            <IonLoading
                cssClass='my-custom-class'
                isOpen={showLoadingMap}
                message={'Mapping...'}
                onDidDismiss={() => setShowLoadingMap(false)}
            />

             <IonHeader class="header">
                <IonToolbar>
                    <IonButtons slot="start"  onClick={() => onDimiss()}>
                        <IonIcon size="large" style={{color:'black'}} md={arrowBackSharp}></IonIcon>
                    </IonButtons>
                    <IonTitle class="title">Event</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent style={{height:'100%'}}>    
            
                <div className="content_event">
                    <div className="grid-container">
                        <IonIcon id="title-icon" className='icon' color="secondary" md={text} />
                        <IonText id="title-txt" className='text end-of-item-event' >{event?.title}</IonText>

                        <IonIcon id="address-icon" className='icon' color="secondary" md={locationOutline} />
                        <IonText id="address-txt" className='text end-of-item-event' >{event?.address}</IonText>

                        <IonIcon id="price-icon" className='icon' color="secondary" md={pricetagOutline} />
                        <IonText id="price-txt" className='text end-of-item-event' >${event?.price}</IonText>

                        <IonIcon id="time-icon" className='icon' color="secondary" md={timeOutline} />
                        <div id="time-txt" className="text end-of-item-event">
                            <div className="time-content text">Start: {moment(event?.start?.toString()).format('dddd MMMM D YYYY')}</div>
                            <div className="time-content">End: {moment(event?.end?.toString()).format('dddd MMMM D YYYY')}</div>
                            <div className="time-content">Notify: {moment(event?.noti?.toString()).format('dddd MMMM D YYYY HH:mm')}</div>
                            {event?.allDay === true &&
                                <div className="time-content" id="allday">All day</div>
                            }
                        </div>

                        <IonTitle id="owner-title" className='text' >Owner</IonTitle>

                        <IonIcon id="ownername-icon" className='icon' color="secondary" md={bodyOutline} />
                        <IonText id="ownername-txt" className='text end-of-item-event' >{event?.ownername}</IonText>

                        <IonIcon id="ownerno-icon" className='icon' color="secondary" md={callOutline} />
                        <IonText id="ownerno-txt" className='text end-of-item-event' >{event?.ownerno}</IonText>

                        <IonTitle id="tenant-title" className='text' >Tenant</IonTitle>

                        <IonIcon id="tenantname-icon" className='icon' color="secondary" md={manOutline} />
                        <IonText id="tenantname-txt" className='text end-of-item-event' >{event?.tenantname}</IonText>

                        <IonIcon id="tenantno-icon" className='icon' color="secondary" md={idCardOutline} />
                        <IonText id="tenantno-txt" className='text end-of-item-event' >{event?.tenantno}</IonText>

                        <IonIcon id="size-icon" className='icon' color="secondary" md={expandOutline} />
                        <IonText id="size-txt" className='text end-of-item-event' >{event?.size}</IonText>

                        

                        {isLoaded === true && latlongErr === false &&

                            //Wait for modal to finish loading before initializing the map. 
                            //To prevent the map from initializing beforehand that causes the center of the map to be
                            //on the top-left corner of the app on mobile devices.
                            <MapContainer key={state.keyMAP} id="google-map" className="map-container" center={[event?.latitude, event?.longitude]} zoom={18} scrollWheelZoom={false} zoomAnimation={true}>
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[event?.latitude, event?.longitude]}>
                                    <Popup>
                                        {event?.address}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        }

                        {isLoaded === true && latlongErr === true &&
                            <div id="google-map" className="error">
                                <IonCard className="background strip-shadow">
                                    <IonCardHeader>
                                        <IonCardTitle>What Happen to Map?</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>When you're <b>Editing</b> or <b>Adding</b> events, ensure that there's <b>Internet and a Valid Address</b>. Otherwise, wouldn't be able to get latitude and longitude from address. Map won't load correctly!</IonCardContent>
                                    <IonButton class="background strip-shadow" onClick={() => refreshmap()}>
                                        <IonIcon md={refreshOutline} />
                                        <IonLabel id="label-footer">map</IonLabel>
                                    </IonButton>
                                </IonCard>
                            </div>
                        }

                    </div>
                </div>
            </IonContent>
            <IonFooter className="background footer">
                <div style={{ display: 'flex' }}>
                    <IonButton onClick={() => editEventBtn()} size="large" class="background strip-shadow footer-btn" >
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
                            delProperty(event?.id).then((async res=>{
                                await deleteNotification(event?.id);
                                //console.log(res);
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

            <EditEvent modal2={showEditEvent} setShowModal2={setShowEditEvent} data2={event!} />   
            
        </IonModal>
 
    );
}

export default Event;