import * as React from "react";
import { useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
    Platform
} from "react-native";
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import {  Button } from 'react-native-elements';
const FIREBASE_CONFIG: any = {
    /*
    apiKey: "AIzaSyCN_dQB0-EkzeLAL0YrWhyPvbNT8fH1wbw",
    authDomain: "appfood2-88536.firebaseapp.com",
    projectId: "appfood2-88536",
    storageBucket: "appfood2-88536.appspot.com",
    messagingSenderId: "517638475663",
    appId: "1:517638475663:web:6b1a2a6b0b670adb2e05fa"
    */
    apiKey: "AIzaSyBEKnqWK47-Ft6Hn8gv9uLK-vy9rmack1w",
    authDomain: "appfood-74513.firebaseapp.com",
    projectId: "appfood-74513",
    storageBucket: "appfood-74513.appspot.com",
    messagingSenderId: "875720411376",
    appId: "1:875720411376:web:6f1041fd0f1f56c5d3da35"
    
};

try {
    if (FIREBASE_CONFIG.apiKey) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
} catch (err) {
    // ignore app already initialized error on snack
}

export default function OtpSMS(props) {
    const recaptchaVerifier = React.useRef(null);
    const verificationCodeTextInput = React.useRef(null);
    const [phoneNumber, setPhoneNumber] = React.useState("+84" + props.route.params.phoneNumber);
    const [verificationId, setVerificationId] = React.useState("");
    const [verifyError, setVerifyError] = React.useState();
    const [verifyInProgress, setVerifyInProgress] = React.useState(false);
    const [verificationCode, setVerificationCode] = React.useState("");
    const [confirmError, setConfirmError] = React.useState();
    const [confirmInProgress, setConfirmInProgress] = React.useState(false);
    const isConfigValid = !!FIREBASE_CONFIG.apiKey;
    //Send data when goBack screen
    const [postText, setPostText] = React.useState("False");
    useEffect(() => {
        (async function () {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            try {
                setVerifyError(undefined);
                setVerifyInProgress(true);
                setVerificationId("");
                const verificationId = await phoneProvider.verifyPhoneNumber(
                    phoneNumber,
                    // @ts-ignore
                    recaptchaVerifier.current
                );
                setVerifyInProgress(false);
                setVerificationId(verificationId);
                verificationCodeTextInput.current?.focus();
            } catch (err) {
                setVerifyError(err);
                setVerifyInProgress(false);
         } })();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={FIREBASE_CONFIG}
                />
                <Text style={styles.title}>Xác nhận số điện thoại</Text>


                {verifyError && (
                    <Text style={styles.error}>{`Error: ${verifyError.message}`}</Text>
                )}
                {verifyInProgress && <ActivityIndicator style={styles.loader} />}
                {verificationId ? (
                    <Text style={styles.success}>
                        Một mã xác nhận đã được gửi đến số điện thoại của bạn: {phoneNumber}
                    </Text>
                ) : undefined}
                <Text style={styles.text}>Nhập mã xác nhận</Text>
                <TextInput
                    ref={verificationCodeTextInput}
                    style={styles.textInput}
                    editable={!!verificationId}
                    placeholder="123456"
                    onChangeText={(verificationCode: string) =>
                        setVerificationCode(verificationCode)
                    }
                />
               <View style={{flexDirection: 'row', marginTop: 40, justifyContent: 'space-between'}}>
               <Button
                    title="Xác nhận"
                    disabled={!verificationCode}
                    onPress={async () => {
                        try {
                            setConfirmError(undefined);
                            setConfirmInProgress(true);
                            const credential = firebase.auth.PhoneAuthProvider.credential(
                                verificationId,
                                verificationCode
                            );
                            const authResult = await firebase
                                .auth()
                                .signInWithCredential(credential);
                            setConfirmInProgress(false);
                            setVerificationId("");
                            setVerificationCode("");
                            verificationCodeTextInput.current?.clear();

                            props.navigation.navigate({
                                name: 'Register',
                                params: { post: postText },
                                merge: true,
                            });
                        } catch (err) {
                            setConfirmError(err);
                            setConfirmInProgress(false);
                        }
                    }}
                />
                <Button title="Quay lại" onPress={() => props.navigation.goBack()} />
               </View>
                {confirmError && (
                    <Text style={styles.error}>{`Error: ${confirmError.message}`}</Text>
                )}
                {confirmInProgress && <ActivityIndicator style={styles.loader} />}
            </View>
            {!isConfigValid && (
                <View style={styles.overlay} pointerEvents="none">
                    <Text style={styles.overlayText}>
                        To get started, set a valid FIREBASE_CONFIG in App.tsx.
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFCC',
    },
    content: {
        marginTop: 50,
    },
    title: {
        marginBottom: 2,
        fontSize: 20,
        fontWeight: "bold",
        opacity: 0.65,
        textAlign: 'center'
    },
    textInput: {
        marginBottom: 8,
        fontSize: 21,
        fontWeight: "bold",
        textAlign: 'center',
        margin: 20
    },
    error: {
        marginTop: 10,
        fontWeight: "bold",
        color: "red",
    },
    success: {
        marginTop: 10,
        fontWeight: "bold",
        color: "blue",
        fontSize: 13,
        textAlign: 'center'
    },
    loader: {
        marginTop: 10,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#FFFFFFC0",
        justifyContent: 'center',
        alignItems: "center",
    },
    overlayText: {
        fontWeight: "bold",
    },
});
