import { IonApp, IonRouterOutlet, IonSplitPane, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

//Pages
import Home from './pages/Home';
import About from './pages/About';
import * as $ from "jquery"

//local notification
import { Schedule, LocalNotifications, LocalNotificationSchema, ActionPerformed} from '@capacitor/local-notifications';


import { AppPlugin, App } from '@capacitor/app'

const Apps: React.FC = () => {
  //There was a bug that causes u to be unable to exit a modal using your android back btn.
  //So, the idea of this is to override the default back btn on android and manually add the code
  //that checks the current state and act accordingly depending on the current state.
  let bckbtn = App.addListener('backButton', ()=>{
    if(window.history.state === 'home' || window.history.state === 'about'){  
      App.exitApp();
    }else{  
      window.history.back();
    }
  });

  
  //console.log("App");
  LocalNotifications.requestPermissions();

  LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction: ActionPerformed)=> {
    console.log("Notification Clicked: " + notificationAction.notification);
    alert("Notification Clicked");
  });

  LocalNotifications.addListener('localNotificationReceived', (notification: LocalNotificationSchema) => {
    console.log('Notification: ', notification);
    alert("Notification Received");
  });

 

 
  console.log("Done")

  return (
    <IonApp >
      <IonReactRouter >
        <IonSplitPane  contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/page/home" />
            </Route>

            <Route path="/page/home" component={Home} exact={true} /> 

            <Route path="/page/about" component={About} exact={true} /> 

            
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default Apps;
