import './addProperty.css';

import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect,
IonFab, IonFabButton, IonIcon, IonList, IonListHeader, useIonViewWillEnter, useIonViewWillLeave,
withIonLifeCycle, IonItem, IonLabel, IonText, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, 
IonCardContent, IonModal, IonDatetime, IonLoading, IonToast, IonButtons, IonSelectOption } from '@ionic/react';
//Icons
import {
    archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
    trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline,
    addCircleOutline, addCircle, addCircleSharp, addSharp, arrowBackSharp
  } from 'ionicons/icons';

import { useParams } from 'react-router';
import React, { useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid';

import { useForm, Controller  } from "react-hook-form";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { date, object, string } from 'yup';
import Moment from 'moment'

//Title & Menu function
import ExploreContainer from '../components/ExploreContainer';

//hooks
import { addProperty, getProperty, Property, propertyService, get_location_from_address } from '../hooks/property';
import { deleteNotification, createNotification } from '../hooks/notification';

import { App } from '@capacitor/app';
import { NativeGeocoderResult } from '@ionic-native/native-geocoder';

const AddProperty: React.FC<{modal:boolean,showModal: any, setPropData: any, resetState: any}> =  props => {

    const today: Date = new Date();
    const today_convert: string = Moment(today.toString()).format('YYYY-MM-DD');
    const tmr: string = Moment((new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0,0,0,0)).toString()).format('YYYY-MM-DD');


    const initialValues = {
        title: '',
        address: '',
        start: today_convert,
        end:  tmr,
        noti:  tmr,
        allDay: true
    }
    

    //toast
    const showToast_function = (msg: string) =>{
        setMsg(msg); 
        setShowToast(true);
    }


    //use states
    const [showToast, setShowToast] = useState(false);

    const [msg, setMsg] = useState<string>();

    const [error, setError] = useState<string>();
    const [showLoading, setShowLoading] = useState(false);

    const {reset, register, handleSubmit, errors, control,formState, setValue, getValues } = useForm({
        mode: "onChange", //checks validation on every change
        defaultValues: initialValues,
        
    });

    //function
    const submitForm = async (data: any)=>{
        let random_number: number = parseInt(uuidv4(), 36);
        let currentDate: number = new Date().getTime();
        let id: number = random_number + currentDate;

        let beginTime: Date = new Date(); 

        //convert to allow the setting of time to 0 while keeping type as 'date'
        let beginTime_converted: Date = new Date(beginTime.getFullYear(), beginTime.getMonth(), beginTime.getDate(), 0, 0,0,0);
        let beginTime_converted_number:number = beginTime.setHours(0,0,0,0);

        let end_format: string = Moment(data.end).format('dddd MMMM D YYYY');
        let end: Date = Moment(data.end).toDate();
        let end_converted_number: number = end.setHours(0,0,0,0);
        //console.log(end);
        let noti_format: string = data.noti;
        let noti: Date = Moment(noti_format).toDate();
        //console.log(noti);
        let noti_converted_number: number = noti.setHours(0,0,0,0);
        //console.log(noti_format);

        data.id = id;
        data.start = beginTime_converted;
        data.end = end;
        data.noti = noti;

        //console.log(beginTime_converted_number);
        //console.log(endTime_converted_number);

        //noti date chosen cannot be later than the end date
        if((noti_converted_number > end_converted_number)){
            //console.log("Time cannot be the same");
            showToast_function("'Notification Date' cannot be later than the 'End Date'!");
        }else{
            setShowLoading(true);

            //Only works for android or IOS
            //convert address to latitude and longitude
            get_location_from_address(data.address).then((val => {
                if(val === null || val === undefined){
                    data.longitude = 0;
                    data.latitude = 0;
                }else{
                    let result: NativeGeocoderResult[] = val;
                    data.longitude = result[0].longitude;
                    data.latitude = result[0].latitude;
                }
                
                //alert(data.longitude);
                //alert(data.latitude);
                addProperty(data).then((async res=>{
                    //console.log(res);
                    await createNotification(data.id, data.noti, data.title, data.address, noti_format, end_format);
                    propertyService.sendProperty(res);
                    resetForm("reset");
                    await props.showModal(false);
                    setShowLoading(false);
                    showToast_function("Successfully Added!");
                })).catch((err=>{
                    setShowLoading(false);
                    showToast_function(err);
                }));

            })).catch(err=>{
                setShowLoading(false);
                showToast_function(err);
            })
            
        }
        
    }

    const onErrors  = (errors : any) => {
        console.log(errors);
        setError(errors);
    }

    const resetForm = (val: string) =>{
        console.log("Reset");
        reset(initialValues);
    }

    const onPresent = () =>{
        //console.log(window.history.state);
        /*getProperty().then((async res=>{
            if(res){
                props.setPropData(res);
            }
        }));*/
    }

    const onDismiss =async () =>{
        await props.resetState();
        props.showModal(false);
        /*getProperty().then((async res=>{
            if(res){
                props.setPropData(res);
            }
        }));*/
    }


    const validationOptions={
        title: {
          required: "Name needed"
        },
        address: {
          required: "Address needed",
         /* pattern: {
            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
            message: "Invalid email address"
          }*/
        },
        start:{
            required: "Start Date cannot be empty",
        },
        end:{
          required: "End Date cannot be empty",
          /*minLength:{
            value: 8,
            message: "Password must have at least 8 characters"
          }*/
        },
        noti:{
            required: "Notification Date cannot be empty",
        },
        allDay:{
            required: "'All Day' cannot be empty",
        }
    };

    return (
        <IonModal animated={true} swipeToClose={true} onWillPresent={() => onPresent()} onDidDismiss={() => onDismiss()} isOpen={props.modal} cssClass="content">
            <IonLoading
                cssClass='my-custom-class'
                isOpen={showLoading}
                message={'Adding...'}
                onDidDismiss={() => setShowLoading(false)}
            />
            <IonHeader class="header">
                <IonToolbar>
                    <IonButtons slot="start"  onClick={() => onDismiss()}>
                        <IonIcon size="large" style={{color:'black'}} md={arrowBackSharp}></IonIcon>
                    </IonButtons>
                    <IonTitle className="title">Add Property</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent style={{ height: '100%' }}>
                <div id="data-content" style={{ padding: "20px" }}>
                    <div id="info">
                        <b>"Notification date"</b> can't be later than the <b>"End Date"</b>!
                    </div>
                    <Form onSubmit={handleSubmit(submitForm)} className="form">
                        <IonCard style={{ background: "transparent" }}>
                            <FormGroup className="formgroup">
                                <IonItem className="formitem">
                                    <IonLabel position="floating">Name</IonLabel>

                                    <Controller
                                        /*
                                          Need to add the 'value' parameter because otherwise, the value displayed will not be
                                          resetted for the client side. So you need to add it with the 'value' props inside 
                                          the curly braces.
        
                                          Only on IONIC component that needs to be done like this. For others, can just use the
                                          standard method in which u can just replace the 'render' parameter with the 'as' parameter
                                          and in the 'as' parameter, you can just input the IONIC component inside the curly braces
                                          E.g. as={<input type="number" />}
                                        */
                                        render={({ onChange, onBlur, value }) => (<IonInput value={value} onIonChange={onChange} />)}
                                        control={control}
                                        name="title"
                                        rules={validationOptions.title}
                                    />

                                </IonItem>

                                <small className="error-msg">
                                    {errors.title && errors.title.message}
                                </small>
                            </FormGroup>
                            <FormGroup className="formgroup">
                                <IonItem className="formitem">
                                    <IonLabel position="floating">Address</IonLabel>

                                    <Controller
                                        /*
                                          Need to add the 'value' parameter because otherwise, the value displayed will not be
                                          resetted for the client side. So you need to add it with the 'value' props inside 
                                          the curly braces.
        
                                          Only on IONIC component that needs to be done like this. For others, can just use the
                                          standard method in which u can just replace the 'render' parameter with the 'as' parameter
                                          and in the 'as' parameter, you can just input the IONIC component inside the curly braces
                                          E.g. as={<input type="number" />}
                                        */
                                        render={({ onChange, onBlur, value }) => (<IonInput value={value} onIonChange={onChange} />)}
                                        control={control}
                                        name="address"
                                        rules={validationOptions.address}
                                    />

                                </IonItem>
                                <small className="error-msg">
                                    {errors.address && errors.address.message}
                                </small>
                            </FormGroup>
                        </IonCard>
                        <FormGroup className="formgroup">

                            <div id="label-txt">Start Date</div>

                            <Controller
                                /*
                                  Need to add the 'value' parameter because otherwise, the value displayed will not be
                                  resetted for the client side. So you need to add it with the 'value' props inside 
                                  the curly braces.
                                
                                  Only on IONIC component that needs to be done like this. For others, can just use the
                                  standard method in which u can just replace the 'render' parameter with the 'as' parameter
                                  and in the 'as' parameter, you can just input the IONIC component inside the curly braces
                                  E.g. as={<input type="number" />}
                                */
                                render={({ onChange, onBlur, value }) => (<IonInput disabled={true} value={value} min={today_convert} type="date" onIonChange={onChange} />)}
                                control={control}
                                name="start"
                                rules={validationOptions.start}
                            />

                            <small className="error-msg">
                                {errors.start && errors.start.message}
                            </small>
                        </FormGroup>

                        <FormGroup className="formgroup">

                            <div id="label-txt">End Date</div>

                            <Controller
                                /*
                                  Need to add the 'value' parameter because otherwise, the value displayed will not be
                                  resetted for the client side. So you need to add it with the 'value' props inside 
                                  the curly braces.
    
                                  Only on IONIC component that needs to be done like this. For others, can just use the
                                  standard method in which u can just replace the 'render' parameter with the 'as' parameter
                                  and in the 'as' parameter, you can just input the IONIC component inside the curly braces
                                  E.g. as={<input type="number" />}
                                */
                                render={({ onChange, onBlur, value }) => (<IonInput value={value} min={tmr} type="date" onIonChange={onChange} />)}
                                control={control}
                                name="end"
                                rules={validationOptions.end}
                            />

                            <small className="error-msg">
                                {errors.end && errors.end.message}
                            </small>
                        </FormGroup>

                        <FormGroup className="formgroup">

                            <div id="label-txt">Notify Date</div>

                            <Controller
                                /*
                                  Need to add the 'value' parameter because otherwise, the value displayed will not be
                                  resetted for the client side. So you need to add it with the 'value' props inside 
                                  the curly braces.
                                
                                  Only on IONIC component that needs to be done like this. For others, can just use the
                                  standard method in which u can just replace the 'render' parameter with the 'as' parameter
                                  and in the 'as' parameter, you can just input the IONIC component inside the curly braces
                                  E.g. as={<input type="number" />}
                                */
                                render={({ onChange, onBlur, value }) => (<IonInput value={value} min={tmr} type="date" onIonChange={onChange} />)}
                                control={control}
                                name="noti"
                                rules={validationOptions.noti}
                            />

                            <small className="error-msg">
                                {errors.noti && errors.noti.message}
                            </small>
                        </FormGroup>

                        <FormGroup className="formgroup">

                            <div id="label-txt">All Day</div>

                            <Controller
                                /*
                                  Need to add the 'value' parameter because otherwise, the value displayed will not be
                                  resetted for the client side. So you need to add it with the 'value' props inside 
                                  the curly braces.
                                
                                  Only on IONIC component that needs to be done like this. For others, can just use the
                                  standard method in which u can just replace the 'render' parameter with the 'as' parameter
                                  and in the 'as' parameter, you can just input the IONIC component inside the curly braces
                                  E.g. as={<input type="number" />}
                                */
                                render={({ onChange, onBlur, value }) => (
                                    <IonSelect disabled={true} value={value}>
                                        <IonSelectOption value={true}>True</IonSelectOption>
                                        <IonSelectOption value={false}>False</IonSelectOption>
                                    </IonSelect>)}
                                control={control}
                                name="allDay"
                                rules={validationOptions.allDay}
                            />

                            <small className="error-msg">
                                {errors.allDay && errors.allDay.message}
                            </small>
                        </FormGroup>

                        <div style={{ padding: '10px', display: 'flex' }}>
                            <IonButton style={{ flex: '1' }} type="submit" color="success"
                                disabled={formState.isValid === false}
                            >Add</IonButton>
                            <IonButton color="danger" style={{ flex: '1' }} onClick={() => resetForm("Reset")}>Reset</IonButton>
                        </div>
                    </Form>
                </div>
            </IonContent>
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
  };
  
  export default AddProperty;