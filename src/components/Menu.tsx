import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp,
  trashOutline, trashSharp, warningOutline, warningSharp, homeSharp, homeOutline, calendarSharp, calendarOutline
} from 'ionicons/icons';
import './Menu.css';

import { useForm } from "react-hook-form";

//Import firebase
import * as firebase from 'firebase';
//firebase.default.firestore().collection('user').where('gender','==','female');

import  fb  from '../firebaseConfig';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/page/home',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  },
  {
    title: 'About',
    url: '/page/about',
    iosIcon: calendarOutline,
    mdIcon: calendarSharp
  }
];


const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu  contentId="main" type="overlay">

        <IonContent class="header"  >

          <IonList id="inbox-list">
            <IonListHeader>Property-Noti</IonListHeader>
            <IonNote>Sends msg of properties deadlines to your device</IonNote>
            {appPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem  id="menu-item" className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          </IonList>

        </IonContent>

    </IonMenu>
  );
};

export default Menu;
