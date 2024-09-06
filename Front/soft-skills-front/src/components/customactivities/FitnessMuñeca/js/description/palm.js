import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const palmDescription = new GestureDescription('palm'); 



for(let finger of [Finger.Middle, Finger.Ring, Finger.Index ,Finger.Pinky,Finger.Thumb]){
    palmDescription.addCurl(finger, FingerCurl.NoCurl, 1.0);
    palmDescription.addDirection(finger, FingerDirection.VerticalUp, 1.0);

}