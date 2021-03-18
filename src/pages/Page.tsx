import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage >
      
        <IonHeader class="header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{name}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent class="content"  fullscreen>
          <div id="data-content">
            <div>
              <h5></h5>
              <b>Data will appear here!</b>
            </div>          
          </div>
        </IonContent>

    </IonPage>
  );
};

export default Page;
