import './addProperty.css';

import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect,
IonFab, IonFabButton, IonIcon, IonList, IonListHeader, useIonViewWillEnter, useIonViewWillLeave,
withIonLifeCycle, IonItem, IonLabel, IonText, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, 
IonCardContent, IonModal, IonDatetime, IonLoading } from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState, useEffect } from "react";
import { useForm, Controller  } from "react-hook-form";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { object, string } from 'yup';
import Moment from 'moment'

//Icons
import {
    archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
    trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline,
    addCircleOutline, addCircle, addCircleSharp, addSharp
  } from 'ionicons/icons';

//Title & Menu function
import ExploreContainer from '../components/ExploreContainer';


  

  
const AddProperty: React.FC<{modal:boolean,showModal: any}> =  props => {
    const initialValues = {
        propertyName: '',
        address: '',
        endTime:  Moment((new Date()).toString()).format('YYYY-MM-DD')
    }

    //use states
    const [error, setError] = useState<string>();
    const [showLoading, setShowLoading] = useState(false);

    const {reset, register, handleSubmit, errors, control,formState, setValue, getValues } = useForm({
        mode: "onChange", //checks validation on every change
        defaultValues: initialValues,
        
    });


    //function
    const submitForm = async (data: any)=>{
        console.log(data.propertyName);
        console.log(data.address);
        console.log(data.endTime);

        //Wait for the system to add into the firebase before proceeding
        setShowLoading(true);

        setTimeout(() => {
            setShowLoading(false);
        }, 2000);

        await props.showModal(false);
        resetForm("Reset");
    }

    const onErrors  = (errors : any) => {
        console.log(errors);
        setError(errors);
    }

    const resetForm = (val: string) =>{
        console.log("Reset");
        reset(initialValues);
    }


    const validationOptions={
        propertyName: {
          required: "Name needed"
        },
        address: {
          required: "Address needed",
         /* pattern: {
            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
            message: "Invalid email address"
          }*/
        },
        endTime:{
          required: "End Date cannot be empty",
          /*minLength:{
            value: 8,
            message: "Password must have at least 8 characters"
          }*/
        }
    };

    return (
        <IonModal isOpen={props.modal} cssClass="content">
            <IonLoading
                cssClass='my-custom-class'
                isOpen={showLoading}
                message={'Please wait...'}
            />
            <IonHeader class="header">
                <IonToolbar>
                    <IonTitle className="title">Add Property</IonTitle>
                </IonToolbar>
            </IonHeader>
            <div id="data-content" style={{padding:"10px"}}>
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
                                    name="propertyName"
                                    rules={validationOptions.propertyName}
                                />                                                     

                            </IonItem>

                            <small className="error-msg">
                                {errors.propertyName && errors.propertyName.message}
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
                                    render={({ onChange, onBlur, value }) => (<IonInput value={value} type="date" onIonChange={onChange} />)}
                                    control={control}
                                    name="endTime"
                                    rules={validationOptions.endTime}
                            />
                           
                            <small className="error-msg">
                                {errors.endTime && errors.endTime.message}
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

        </IonModal>

    );
  };
  
  export default AddProperty;