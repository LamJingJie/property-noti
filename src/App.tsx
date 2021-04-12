import { IonApp, IonRouterOutlet, IonSplitPane, useIonViewWillEnter } from '@ionic/react';
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
import Outbox from './pages/Outbox';
import * as $ from "jquery"

//local notification
import { LocalNotification, LocalNotificationActionPerformed, LocalNotificationRequest, Plugins } from '@capacitor/core';

const App: React.FC = () => {
  
  const { LocalNotifications } = Plugins;
  //console.log("App");
  LocalNotifications.requestPermission();

  LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction: LocalNotificationActionPerformed)=> {
    alert(notificationAction.notification.title);
  });

  LocalNotifications.addListener('localNotificationReceived', (notification: LocalNotification) => {
    console.log('Notification: ', notification);
    alert(notification.title);
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

            <Route path="/page/outbox" component={Outbox} exact={true} /> 

            
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
