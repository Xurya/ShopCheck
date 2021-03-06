# ShopCheck

## DROPLET IS NOW OFFLINE

- As the the economy reopens due to the pandemic, small businesses need a platform to communicate their available services through the transition phases.
- ShopCheck seeks to provide a solution, by connecting services to customers, through versatile and attainable mobile platforms.
- ShopCheck is designed to be flexible and responsive for shops and their consumers, to keep pace with the unpredictable and fast paced course of the pandemic.

## Installation
### IOS
1. Download and install the [Expo Client](https://apps.apple.com/us/app/expo-client/id982107779) from the Apple iTunes Store
2. Open the Camera app and scan the QR code detailed below
### Android
1. Download and install the [Expo Client](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US) from the Google Play Store
2. Open up the Expo app and scan the QR code detailed below  

#### QR CODE (exp://9g-f5q.anonymous.shopcheck.exp.direct:80)
![QRCODE](https://media.discordapp.net/attachments/725910956542132300/738973367654285372/unknown.png)

## Deployment
*The following steps are necessary only if you plan to deploy your own back-end and front-end rather than the ones provided from 157.245.243.174

### Ubuntu 16.04 LTS
#### Front-End

1. Make sure you have NodeJS version 12 or above.
2. In bash, run ```sudo npm install -g expo-cli```
3. ```cd``` into the front-end\ShopCheck folder and run ```npm ci```
4. Run ```npm start``` if deploying locally, or run ```expo start --tunnel``` for deploying over the network.
5. Press ```shift-d``` to disable automatically opening DevTools at startup.
6. Obtain QR code and connection link, and open on your device.
7. Press ```p``` to toggle production mode on

*The front-end will by default connect to the back-end running on our remote server at 157.245.243.174:5000, where our back-end uses port 5000 by default. If you wish to run your own local instance, you will need to manually change any of these IPs to your local LAN IP.

#### Back-End 

1. Make sure you have NodeJS version 12 or above.
2. ```cd``` into the back-end\ folder and run ```npm ci```
3. Run ```npm start```



