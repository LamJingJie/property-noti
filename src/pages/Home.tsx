import './Home.css';

import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect,
IonFab, IonFabButton, IonIcon, IonList, IonListHeader, useIonViewWillEnter, useIonViewWillLeave, 
withIonLifeCycle, IonItem, IonLabel, IonText, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, 
IonCardContent, IonModal, isPlatform,getPlatforms, useIonViewDidEnter, useIonViewDidLeave, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Subscription } from 'rxjs';

//Icons
import {
    archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
    trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline,
    addCircleOutline, addCircle, addCircleSharp, addSharp
  } from 'ionicons/icons';

//CRUD
import { getProperty, Property, propertyService } from '../hooks/property';

//Title & Menu function
import ExploreContainer from '../components/ExploreContainer';

//background designs
import PageDesign from '../components/pageDesign';

//modals
import AddProperty from '../modal/addProperty';
import Event from '../modal/Event';


//import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';


const Home: React.FC = (props) => {
    let propertySubscription: Subscription;
    const history = useHistory();
    const localizer = momentLocalizer(moment);
    let unsub_get: () => void; //store listener
    const now = new Date();


    //use state
    const [addProp_Modal, setAdd_Modal] = useState(false);
    const [showEvent, setShowEvent] = useState(false);

    const [chosenDate, setChosenDate] = useState<string>();
    const [propData, setPropData] = useState<Property[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<object>();
    const [popoverData, setPopoverData] = useState<Property[]>([]);
    let calendar: any;
    /*
    Method (2) to override back btn in android
    const override_bck_btn = () =>{
        console.log("Override back btn here");
        
        if(addProp_Modal === false){
            //If false, override back btn
            console.log("False");
        }else{
            //If true, cancel it and return to normal
            console.log("True");
        }
        
    }
    */

    let height:number = window.innerHeight;

   //Will run on page initialization and when a new event is added by the device
   useEffect(()=>{
       let width:number = window.innerWidth;
       
       let view: string;
       //For android devices that are too small that events may be hard to see
       if(width <= 350){
            view="listWeek";
       }else{
           view = "dayGridMonth"
       }

       /*let aspectRatio = +(height/width).toFixed(2);
       console.log(aspectRatio);
       
       let calendarEl: HTMLElement = document.getElementById('calendar')!;

        calendar = new Calendar(calendarEl, {
           plugins: [dayGridPlugin, interactionPlugin, listPlugin],
           initialView: view,
           contentHeight: 'auto',
           titleFormat:'',
           aspectRatio: aspectRatio,
           eventClick: eventSelect,
           eventColor: 'red',
           events:
               [
                   { id: 'a', title: 'event 1', allDay: true, start: '2021-03-05', end: '2021-03-26' },
                   { id: 'b', title: 'event 2', allDay: true, start: '2021-03-06', end: '2021-03-25' }
               ]

       });

       calendar.render();*/

       
   }, [])
   
    const eventSelect = (event: object) =>{
        //console.log(event);
        setSelectedEvent(event);
        setShowEvent(true);
        window.history.replaceState('event', 'event', null);
        //history.push('/page/home/event');  
    }

    const addPropModal = () =>{
        setAdd_Modal(true);
        window.history.replaceState('addProperty', 'addProperty', null);
    }

    useIonViewDidEnter(()=>{
        //console.log("Did Enter");
    });

    //This will be its default state and it will be resetted to this everytime a modal is exited or this page is entered
    const resetState = () =>{
        window.history.replaceState('home','home',null);
    }


    useIonViewWillEnter(()=>{       
        resetState();
        /*propertySubscription = jingjie().subscribe((data: any)=>{
            
            console.log("Start");
            if(data){
                console.log(data);
                setPropData((datas: any) => [...datas, data]);
            }else{
                console.log("Empty");
                setPropData([]);
            }         
        });*/
        /*bsubject.subscribe((data: any) =>{
            console.log("HIIII");
            getProperty().then((async res=>{
                if(res){
                    setPropData(res);
                    console.log("Data");
                    console.log(res);
                }
            }));
        });*/
        propertySubscription= propertyService.onProperty().subscribe((res: any)=>{
            console.log(res);
            setPropData(res);
        });
        getProperty().then((async res=>{
            if(res){
                propertyService.sendProperty(res);
            }
        }));
 

        /*unsub_get = getProperty(true).onSnapshot((snapshot) => {
            //...
            
            console.log(snapshot.size);
            snapshot.forEach((res) =>{
                
                
                console.log(res.id);
                console.log(res.data())
                //defaultEvents.push(res.data());
            })
          }, (error) => {
            //...
            console.log(error);
          });*/

          //calendar.render();
        //console.log("Enter");

    })

    
   useIonViewDidLeave(()=>{
       //console.log("Did Leave");
   })


    useIonViewWillLeave(()=>{
        //Unsubscribe / Stop listening
        if(propertySubscription){
            propertySubscription.unsubscribe();
        }   
        /*
        if(unsub_get){
            unsub_get();
        }*/
        //console.log("leave");
    })

    return(

        <IonPage>
            
            <ExploreContainer name={"Home"} />
 
            <IonContent class="content"  fullscreen>
 
                <div id="calendarContainer">
                    <Calendar
                        localizer={localizer}
                        startAccessor="end"
                        defaultDate={now}
                        endAccessor="end"
                        popup={false}
                        showAllEvents={false}
                        defaultView='week'
                        onShowMore={(events, date) => {
                            //console.log(events);
                            console.log(date);
                            let date_converted: string = moment(date).format('MMMM Do YYYY');
                            setChosenDate(date_converted);
                            setPopoverData(events);
                        }}
                        onSelectEvent={event => eventSelect(event)}
                        views={['month', 'week', 'agenda']}
                        events={propData}
                        style={{ height: '80%' }}
                    />
                    <IonContent id="calendarEvent" scrollEvents={true}>
                        <IonList className="background">
                            <IonCard className="background">
                                <IonCardHeader>
                                    <IonCardTitle><b>{chosenDate}</b></IonCardTitle>
                                </IonCardHeader>
                                {popoverData
                                    .map((val, index) => (
                                        <IonButton onClick={()=> eventSelect(val)} key={index} className="background strip-shadow end-of-item-general">
                                            <IonItem className="background">
                                                <IonText style={{ float: 'left' }}>{val.title}</IonText>
                                            </IonItem>
                                        </IonButton>
                                    ))}
                            </IonCard>
                        </IonList>
                    </IonContent>
                    
                </div>                  

                <IonFab  slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton class="transparent-btn" size="small" onClick={() => addPropModal() } >
                        <IonIcon md={addCircle}></IonIcon>
                    </IonFabButton>
                </IonFab>

                <PageDesign />
            </IonContent>
            <AddProperty setPropData={setPropData} modal={addProp_Modal} showModal={setAdd_Modal} resetState={resetState}  />
            <Event modal={showEvent} setShowModal={setShowEvent} data={selectedEvent!} resetState={resetState}/>

        </IonPage>
       
    );
    
}


export default Home;
