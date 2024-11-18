import {Finger, FingerCurl, GestureDescription} from 'fingerpose'; 

/* Esta seccion declara como se hace el movimiento utilizando la definicion de los dedos definiendo si estan contraidos o no*/
export const fistDescription = new GestureDescription('fist'); 



for(let finger of [Finger.Middle, Finger.Ring, Finger.Index ,Finger.Pinky,Finger.Thumb]){
    fistDescription.addCurl(finger, FingerCurl.FullCurl, 1);

}