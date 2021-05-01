import './EditEvent.css';

import {
  IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect,
  IonFab, IonFabButton, IonIcon, IonList, IonListHeader, useIonViewWillEnter, useIonViewWillLeave,
  withIonLifeCycle, IonItem, IonLabel, IonText, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonCardContent, IonModal, isPlatform, getPlatforms, useIonViewDidEnter, useIonViewDidLeave, IonGrid, IonRow, IonCol,
  IonButtons,
  IonFooter,
  IonTabButton,
  IonTabBar,
  IonRippleEffect, IonLoading,
  IonToast,
  IonSelectOption,
} from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState, useEffect, useMemo } from "react";

import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useHistory } from 'react-router-dom';


import { useForm, Controller } from "react-hook-form";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

//Icons
import {
  archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
  trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline,
  addCircleOutline, addCircle, addCircleSharp, addSharp, arrowBackSharp, backspace, text, shareSocialOutline, pencilOutline, trashBinOutline,
  locationOutline, timeOutline, closeOutline, checkmarkOutline
} from 'ionicons/icons';

//CRUD
import { getProperty, Property, delProperty, propertyService, editProperty, get_location_from_address } from '../hooks/property';
import { deleteNotification, createNotification } from '../hooks/notification';

//Title & Menu function
import ExploreContainer from '../components/ExploreContainer';

//background designs
import PageDesign from '../components/pageDesign';
import { NativeGeocoderResult } from '@ionic-native/native-geocoder';


const EditEvent: React.FC<{modal2:boolean,setShowModal2: any, data2: any}> = (props) => {
  const today: Date = new Date();
  const tmr: string = moment((new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0,0,0,0)).toString()).format('YYYY-MM-DD');
  const today_convert: string = moment(today.toString()).format('YYYY-MM-DD');
  const today_time: string = moment().format('YYYY-MM-DDTHH:mm');
  //Toast
  const [msg, setMsg] = useState<string>();
  const [showToast, setShowToast] = useState(false);
  const showToast_function = (msg: string) =>{
    setMsg(msg); 
    setShowToast(true);
  }

  //Load
  const [showLoading, setShowLoading] = useState(false);

  const onPresent = () => {
    //Add an observable that listens and executes whenever an update is made to it
    console.log("Edit Event Present");
    reset(initialValues); //Reload the function with the loaded default values
  }

  const onDimiss = () => {
    props.setShowModal2(false);
  }

  //console.log(event);
  const initialValues = {
    title: props.data2?.title,
    address: props.data2?.address,
    start: moment(props.data2?.start?.toString()).format('YYYY-MM-DD'),
    end: moment(props.data2?.end?.toString()).format('YYYY-MM-DD'),
    noti: moment(props.data2?.noti?.toString()).format('YYYY-MM-DDTHH:mm'),
    allDay: props.data2?.allDay,
    price: props.data2?.price,
    ownerno: props.data2?.ownerno,
    ownername: props.data2?.ownername,
    tenantno: props.data2?.tenantno,
    tenantname: props.data2?.tenantname,
    size: props.data2?.size
  }

  const { reset, register, handleSubmit, errors, control, formState, setValue, getValues } = useForm({
    mode: "onChange", //checks validation on every change
    defaultValues: initialValues,

  });


  const submitForm = async (data: any)=>{
    let start: Date = moment(data.start).toDate();

    let end_format: string = moment(data.end).format('dddd MMMM D YYYY');
    let end: Date = moment(data.end).toDate();
    let end_converted_number: number = end.setHours(0,0,0,0);

    let noti_format: string = data.noti;
    let noti: Date = moment(noti_format).toDate();
    let noti_converted_number: number = +noti;
    //console.log(noti);
    data.id = props.data2?.id;
    data.start = start;
    data.end = end;
    data.noti = noti;
    //console.log(data);
    if((noti_converted_number > end_converted_number)){
      //console.log("Time cannot be the same");
      showToast_function("'Notification Date' cannot be later than the 'End Date'!");
    }
    else{
      //console.log("Time is diff");
      setShowLoading(true);

      //Only works for android or IOS
      get_location_from_address(data.address).then((val => {
        if (val === null || val == undefined) {
          data.longitude = 0;
          data.latitude = 0;
        } else {
          let result: NativeGeocoderResult[] = val;
          data.longitude = result[0].longitude;
          data.latitude = result[0].latitude;
        }
        //alert("Longitude: " + data.longitude);
        //alert("Latitude: " + data.latitude);

        editProperty(data).then((async res=>{
          await deleteNotification(data.id);
          await createNotification(data.id, data.noti, data.title, data.address, noti_format, end_format);
          //console.log(res);
          propertyService.sendOneProperty(data);//for subscription in 'event.tsx'. Returns only the updated object
          propertyService.sendProperty(res);//for the subscription in the 'home.tsx'. Returns entire list of updated array       
          props.setShowModal2(false);
          setShowLoading(false);
          showToast_function("Successfully Added!");
        })).catch((err=>{
          setShowLoading(false);
          showToast_function(err);
        }));

      })).catch((err=>{
        setShowLoading(false);
        showToast_function(err);
      }));
    }
  }

  
  const validationOptions = {
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
    allDay: {
      required: "'All Day' needed",
    },
    start: {
      required: "Start Date cannot be empty",
    },
    end: {
      required: "End Date cannot be empty",
    },
    noti: {
      required: "Notification Date cannot be empty",

      /*minLength:{
        value: 8,
        message: "Password must have at least 8 characters"
      }*/
    },
    price: {
      required: "Price of property needed",
    },
    ownerno: {
      required: "Owner Number needed",
      minLength: {
        value: 8,
        message: "Tenant Number must have at least 8 numbers"
      }
    },
    ownername: {
      required: "Owner Name needed",
    },
    tenantno: {
      required: "Tenant Number needed",
      minLength: {
        value: 8,
        message: "Tenant Number must have at least 8 numbers"
      }
    },
    tenantname: {
      required: "Tenant Name needed"
    },
    size: {
      required: "Property Size needed"
    }
  };


  return (
    <IonModal id="modal" animated={true} swipeToClose={true} onWillPresent={() => onPresent()} onDidDismiss={() => onDimiss()} isOpen={props.modal2} cssClass="content">
       <IonLoading
                cssClass='my-custom-class'
                isOpen={showLoading}
                message={'Updating...'}
                onDidDismiss={() => setShowLoading(false)}
        />
      <Form onSubmit={handleSubmit(submitForm)} style={{ height: '100%', width: '100%' }}>
        <IonHeader class="header">
          <IonToolbar>
            <IonButtons slot="start" onClick={() => onDimiss()}>
              <IonIcon size="large" style={{ color: 'black' }} md={closeOutline}></IonIcon>
            </IonButtons>
            <IonButton slot="end" type="submit" id="transparent-bckground"
              disabled={formState.isValid === false}
            ><IonIcon size="large" style={{ color: 'black' }} md={checkmarkOutline}></IonIcon></IonButton>
            <IonTitle class="title">Edit Event</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent style={{ height: '100%' }}>
          <div id="data-content" style={{ padding: "20px" }}>
            <div id="info">
              <b>"Notification date"</b> can't be later than the <b>"End Date"</b>!
            </div>

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
              <FormGroup className="formgroup">
                <IonItem className="formitem">
                  <IonLabel position="floating">Price</IonLabel>

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
                    render={({ onChange, onBlur, value }) => (<IonInput type="number" value={value} onIonChange={onChange} />)}
                    control={control}
                    name="price"
                    rules={validationOptions.price}
                  />

                </IonItem>

                <small className="error-msg">
                  {errors.price && errors.price.message}
                </small>
              </FormGroup>
              <FormGroup className="formgroup">
                <IonItem className="formitem">
                  <IonLabel position="floating">Owner Name</IonLabel>

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
                    name="ownername"
                    rules={validationOptions.ownername}
                  />

                </IonItem>

                <small className="error-msg">
                  {errors.ownername && errors.ownername.message}
                </small>
              </FormGroup>
              <FormGroup className="formgroup">
                <IonItem className="formitem">
                  <IonLabel position="floating">Owner Number</IonLabel>

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
                    render={({ onChange, onBlur, value }) => (<IonInput type="number" value={value} onIonChange={onChange} />)}
                    control={control}
                    name="ownerno"
                    rules={validationOptions.ownerno}
                  />

                </IonItem>

                <small className="error-msg">
                  {errors.ownerno && errors.ownerno.message}
                </small>
              </FormGroup>
              <FormGroup className="formgroup">
                <IonItem className="formitem">
                  <IonLabel position="floating">Tenant Name</IonLabel>

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
                    name="tenantname"
                    rules={validationOptions.tenantname}
                  />

                </IonItem>

                <small className="error-msg">
                  {errors.tenantname && errors.tenantname.message}
                </small>
              </FormGroup>
              <FormGroup className="formgroup">
                <IonItem className="formitem">
                  <IonLabel position="floating">Tenant Number</IonLabel>

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
                    render={({ onChange, onBlur, value }) => (<IonInput type="number" value={value} onIonChange={onChange} />)}
                    control={control}
                    name="tenantno"
                    rules={validationOptions.tenantno}
                  />

                </IonItem>

                <small className="error-msg">
                  {errors.tenantno && errors.tenantno.message}
                </small>
              </FormGroup>
              <FormGroup className="formgroup">
                <IonItem className="formitem">
                  <IonLabel position="floating">Property Size</IonLabel>

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
                    name="size"
                    rules={validationOptions.size}
                  />

                </IonItem>

                <small className="error-msg">
                  {errors.size && errors.size.message}
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
                render={({ onChange, onBlur, value }) => (<IonInput value={value} min={today_time} type="datetime-local" onIonChange={onChange} />)}
                control={control}
                name="noti"
                rules={validationOptions.noti}
              />

              <small className="error-msg">
                {errors.noti && errors.noti.message}
              </small>
            </FormGroup>

            <FormGroup id="allday2" className="formgroup" disabled={true}>

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

          </div>
        </IonContent>
      </Form>
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

export default EditEvent;
