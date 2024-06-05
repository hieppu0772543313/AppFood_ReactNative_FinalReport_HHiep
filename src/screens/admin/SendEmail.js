import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import email from 'react-native-email';
import firebase from '../../database/firebase';
import { Input, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FancyAlert } from 'react-native-expo-fancy-alerts';

const SendEmail = (props) => {
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
    const [title, setTitle] = useState();
    //Declare value send email
    const [titleEmail, setTitleEmail] = useState('');
    const [description, setDescription] = useState('');
    const handleEmail = () => {
        if (titleEmail.length < 10 || description < 10) {
            setTitle('Tiêu đề và mô tả phải lớn hơn 10 ký tự');
            setnIcon('✖');
            setColorAlert('red');
            toggleAlert();
        } else {
            const to = user
            email(to, {
                subject: titleEmail,
                body: description,
            }).catch(console.error)
        }
    }
    //Read all user email form app
    const [user, setUser] = useState([])
    useEffect(() => {
        let isMounted = true;
        firebase.db.collection('users').onSnapshot(querySnapshot => {
            const user = [];
            querySnapshot.docs.forEach(doc => {
                const { email } = doc.data();
                user.push({
                    email,
                })
            });
            let arrUser = user.map((item) => {
                return item.email;
            })
            setUser(arrUser);

        })
        return () => { isMounted = false };
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <KeyboardAwareScrollView >
                    <Text style={{ fontSize: 18, padding: 10, fontWeight: 'bold', marginBottom: 10 }}>Gửi đến: <Text style={{ color: 'red' }}>Tất cả mọi người</Text></Text>
                    <Input multiline maxLength={40} focus label="Tiêu đề" placeholder='Nhập tiêu đề' autoCorrect={false} leftIcon={{ type: 'material', name: 'forum', }} onChangeText={(value) => setTitleEmail(value)} />
                    <Input multiline numberOfLines={3} label="Mô tả" maxLength={400} autoCorrect={false} placeholder='Mô tả' leftIcon={{ type: 'material', name: 'description', }} onChangeText={(value) => setDescription(value)} />
                </KeyboardAwareScrollView>
            </View>
            <View style={styles.bottom}>
                <Button title="Gửi Email" onPress={() => handleEmail()} />
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
                <Text style={{ marginTop: -16, marginBottom: 32, }}>{title}</Text>
                <View style={{ paddingHorizontal: 30 }}>
                    <Button style={{ paddingHorizontal: 40 }} title='Đóng' onPress={() => _closeApp()} />
                </View>
            </FancyAlert>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    top: {
        flex: 8
    },
    bottom: {
        flex: 1
    }
});
export default SendEmail;
