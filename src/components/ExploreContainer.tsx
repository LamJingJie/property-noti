import './ExploreContainer.css';
import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect
, IonButtons, IonMenuButton } from '@ionic/react';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <IonHeader class="header">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
  );
};

export default ExploreContainer;
