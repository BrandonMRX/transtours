import React, { useState, useContext, Component, useEffect, useRef } from "react";
import * as Location from 'expo-location';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import axios from 'axios';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

/* 
const notificationListener = useRef();
const responseListener = useRef(); */


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {

  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    ////////console.log("existingStatus:"+existingStatus);
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    ////////console.log("finalStatus:"+finalStatus);
    if (finalStatus !== 'granted') {
      ////////console.log("sin permisos push:");
      //alert('Failed to get push token for push notification!');
      return;
    }
    //token = (await Notifications.getExpoPushTokenAsync());
    token = (await Notifications.getExpoPushTokenAsync()).data;
    
    //////////console.log("token4:");
    //////////console.log(token);
    //////////console.log("token4fin");
  } else {
    ////////console.log(222);
    //alert('Must use physical device for Push Notifications');
  }

    //////////console.log(111);
    
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    
  

  return token;
}

async function sendPushNotification() {

    


  //////////console.log("sendPushNotification");
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Bienvenido a la App de SistemasGo2',
    body: 'Asi vas a poder recibir todas las notificaciones de la App',
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

}
/* 
// This listener is fired whenever a notification is received while the app is foregrounded
notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  setNotification(notification);
});

// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  ////////console.log("response1:"+response);
});

return () => {
  Notifications.removeNotificationSubscription(notificationListener.current);
  Notifications.removeNotificationSubscription(responseListener.current);
}; */

export { registerForPushNotificationsAsync, sendPushNotification };
