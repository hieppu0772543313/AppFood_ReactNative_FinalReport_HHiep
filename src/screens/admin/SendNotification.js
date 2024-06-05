import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FancyAlert } from 'react-native-expo-fancy-alerts';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const SendNotification = () => {
    const [title, setTitle] = useState('You have got mail! 📬');
    const [body, setBody] = useState('Here is the notification body');
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
     //dialog
     const [visible, setVisible] = React.useState(false);
     const toggleAlert = React.useCallback(() => {
         setVisible(!visible);
     }, [visible]);
     const _closeApp = () => {
         setVisible(!visible);
     }
     const [colorAlert, setColorAlert] = useState()
     const [nIcon, setnIcon] = useState();
     const [titleAlert, setTitleAlert] = useState();
    //Send data
    const _sendRequest = async (title, body) => {
        if(title.length<3||body.length<5){
            setTitleAlert('Bạn không được để trống');
            setnIcon('✖');
            setColorAlert('red');
            toggleAlert();
        }
        else{
            setTitleAlert('Gửi thành công');
            setnIcon('✔');
            setColorAlert('green');
            toggleAlert();
            await schedulePushNotification('📬 ' + title, ' 😍 '+body);
        }
      
    }
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.textTitle}>Gửi thông báo người dùng</Text>
            </View>
            <View style={styles.body}>
                <KeyboardAwareScrollView>
                    <Input label="Tiêu đề" placeholder='Nhập tiêu đề' autoCorrect={false} leftIcon={{ type: 'material', name: 'bolt', }} onChangeText={(item) => setTitle(item)} />
                    <Input label="Tin nhắn" multiline numberOfLines={4} maxLength={100} placeholder='Nhập tin nhắn' autoCorrect={false} leftIcon={{ type: 'material', name: 'email', }} onChangeText={(item) => setBody(item)} />
                </KeyboardAwareScrollView>
            </View>
            <View style={styles.bottom}>
                <View style={styles.sButton}>
                    <Button color='green' title='Gửi thông báo' onPress={() => _sendRequest(title, body)} />
                </View>
            </View>
            {/* show dialog */}
            <FancyAlert
                visible={visible}
                icon={<View style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: (colorAlert),
                    borderRadius: 80,
                    width: '100%',
                }}><Text>{nIcon}</Text></View>}
                style={{ backgroundColor: 'white' }}
            >
                <Text style={{ marginTop: -16, marginBottom: 32, }}>{titleAlert}</Text>
                <View style={{ paddingHorizontal: 30 }}>
                    <Button style={{ paddingHorizontal: 40 }} title='Đóng' onPress={() => _closeApp()} />
                </View>
            </FancyAlert>
        </View>
    );
}

async function schedulePushNotification(title, body) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    top: {
        flex: 2
    },
    body: {
        flex: 5
    },
    bottom: {
        flex: 1
    },
    sButton: {
        //backgroundColor: '#66FF66',
        fontSize: 20,
        borderRadius: 50,
        padding: 10,
        marginBottom: 10,
        marginHorizontal: 20
    },
    textTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        opacity: 0.5,
        textAlign: 'center'
    }
});
export default SendNotification;

