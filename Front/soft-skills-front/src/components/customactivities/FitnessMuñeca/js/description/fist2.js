import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const fist2Description = new GestureDescription('fist2'); 



for(let finger of [Finger.Middle, Finger.Ring, Finger.Index ,Finger.Pinky]){
    fist2Description.addCurl(finger, FingerCurl.FullCurl, 1);
    fist2Description.addCurl(finger, FingerCurl.HalfCurl, 0,9);

}

for(let finger of [Finger.Thumb]){
    fist2Description.addCurl(finger, FingerCurl.NoCurl, 1.0);
    fist2Description.addDirection(finger, FingerDirection.VerticalUp, 1.0);
    fist2Description.addDirection(finger, FingerDirection.DiagonalUpLeft, 1.0);
    fist2Description.addDirection(finger, FingerDirection.DiagonalUpRight, 1.0);
    fist2Description.addDirection(finger, FingerDirection.HorizontalLeft, 1.0);
    fist2Description.addDirection(finger, FingerDirection.HorizontalRight, 1.0);
    fist2Description.addDirection(finger, FingerDirection.VerticalUp, 0.9);
    fist2Description.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.9);
    fist2Description.addDirection(finger, FingerDirection.DiagonalUpRight, 0.9);
    fist2Description.addDirection(finger, FingerDirection.HorizontalLeft, 0.9);
    fist2Description.addDirection(finger, FingerDirection.HorizontalRight, 0.9);
}
fist2Description.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
fist2Description.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
fist2Description.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);
fist2Description.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);