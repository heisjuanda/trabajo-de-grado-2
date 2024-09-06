import {Finger, FingerCurl, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const fistDescription = new GestureDescription('fist'); 



for(let finger of [Finger.Middle, Finger.Ring, Finger.Index ,Finger.Pinky,Finger.Thumb]){
    fistDescription.addCurl(finger, FingerCurl.FullCurl, 1);

}