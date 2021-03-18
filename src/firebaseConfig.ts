import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyD4BN1CV5A4auC1VarH1PQe-E1DGkL5JEA",
    authDomain: "property-noti.firebaseapp.com",
    projectId: "property-noti",
    storageBucket: "property-noti.appspot.com",
    messagingSenderId: "70481430167",
    appId: "1:70481430167:web:f7a83e82261d6252824bd2",
    measurementId: "G-ZPCHDRSS7Y"
}


firebase.initializeApp(config);
firebase.analytics();
const fb = firebase.firestore();

export default fb;