import './addProperty.css';

import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect,
IonFab, IonFabButton, IonIcon, IonList, IonListHeader, useIonViewWillEnter, useIonViewWillLeave,
withIonLifeCycle, IonItem, IonLabel, IonText, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, 
IonCardContent, IonModal, IonDatetime, IonLoading, IonToast } from '@ionic/react';
//Icons
import {
    archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
    trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline,
    addCircleOutline, addCircle, addCircleSharp, addSharp
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

//firebase
import { addProperty, getProperty, Property, propertyService } from '../hooks/property';

  

  
const AddProperty: React.FC<{modal:boolean,showModal: any, setPropData: any}> =  props => {

    
    const today: Date = new Date();
    const tmr: string = Moment((new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0,0,0,0)).toString()).format('YYYY-MM-DD');
    //console.log(tmr);


    const initialValues = {
        title: '',
        address: '',
        end:  tmr,
        noti:  tmr,
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
        let id = uuidv4();
        
        let beginTime: Date = new Date(); 

        //convert to allow the setting of time to 0 while keeping type as 'date'
        let beginTime_converted: Date = new Date(beginTime.getFullYear(), beginTime.getMonth(), beginTime.getDate(), 0, 0,0,0);
        let beginTime_converted_number:number = beginTime.setHours(0,0,0,0);

        let end: Date = Moment(data.end).toDate();
        let end_converted_number: number = end.setHours(0,0,0,0);
        //console.log(end);

        let noti: Date = Moment(data.noti).toDate();
        //console.log(noti);
        let noti_converted_number: number = noti.setHours(0,0,0,0);
          
        data.id = id;
        data.allDay = true;
        data.start = beginTime_converted;
        data.end = end;
        data.noti = noti;

        //console.log(data);

        //console.log(beginTime_converted_number);
        //console.log(endTime_converted_number);

        //noti date chosen cannot be later than the end date
        if((noti_converted_number > end_converted_number)){
            console.log("Time cannot be the same");
            showToast_function("'Notification Date' cannot be later than the 'End Date'!");
        }else{
            console.log("Different");
            //Wait for the system to add into the firebase before proceeding
            setShowLoading(true);

            addProperty(data).then((async res=>{
                //console.log(res);
                propertyService.sendProperty(res);
                resetForm("reset");
                await props.showModal(false);
                setShowLoading(false);
                showToast_function("Successfully Added!");
            })).catch((err=>{
                setShowLoading(false);
                showToast_function(err);
            }));
            
            //addProperty
            /*addProperty(data.propertyName, data.address, beginTime_converted, endTime, false).then((async res =>{
                resetForm("reset");
                await props.showModal(false);           
                setShowLoading(false);
                showToast_function("Successfully Added!");
            })).catch((err=>{
                setShowLoading(false);
                showToast_function(err);
            }))*/
            
        }

        //console.log(data.propertyName);
        //console.log(data.address);
        //console.log(data.endTime);
        //console.log(endTime);
        //console.log(beginTime);
        //console.log(beginTime_converted);

        
    }

    const onErrors  = (errors : any) => {
        console.log(errors);
        setError(errors);
    }

    const resetForm = (val: string) =>{
        console.log("Reset");
        reset(initialValues);
    }

    const onDismiss = () =>{
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
        end:{
          required: "End Date cannot be empty",
          /*minLength:{
            value: 8,
            message: "Password must have at least 8 characters"
          }*/
        },
        noti:{
            required: "Notification Date cannot be empty",
            
            /*minLength:{
              value: 8,
              message: "Password must have at least 8 characters"
            }*/
          }
    };

    return (
        <IonModal onDidDismiss={() => onDismiss()} isOpen={props.modal} cssClass="content">
            <IonLoading
                cssClass='my-custom-class'
                isOpen={showLoading}
                message={'Please wait...'}
                onDidDismiss={() => setShowLoading(false)}
            />
            <IonHeader class="header">
                <IonToolbar>
                    <IonTitle className="title">Add Property</IonTitle>
                </IonToolbar>
            </IonHeader>
            <div id="data-content" style={{padding:"10px"}}>
                <div id="info">
                    <b>"Notification date"</b> can't be later than the <b>"End Date"</b>!                
                </div>
                <Form onSubmit={handleSubmit(submitForm)} className="form">
                    <IonCard style={{background: "transparent"}}>
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

                        <div id="label-txt">Notification Date</div>

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
                       
                    <div style={{padding: '10px',display:'flex'}}>
                        <IonButton style={{flex: '1'}} type="submit"  color="success"
                        disabled={formState.isValid === false}
                        >Add</IonButton>
                        <IonButton color="danger" style={{flex: '1'}} onClick={() => resetForm("Reset")}>Reset</IonButton>
                    </div>                 
                </Form>
            </div>

            <IonButton color="dark" fill="solid" onClick={() => props.showModal(false)}>Close</IonButton>

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