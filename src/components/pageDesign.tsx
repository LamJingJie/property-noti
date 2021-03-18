import './pageDesign.css';
import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonSelect
, IonButtons, IonMenuButton, IonImg } from '@ionic/react';

interface ContainerProps {
  name: string;
}

const pageDesign: React.FC = () => {
  return (
    <div>
      <IonImg class="background-img" src ="assets/images/propertybck.png"/>
    </div>
    
  );
};

export default pageDesign;
