import { useEffect, useState } from 'react';
import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Avatar, Card, Divider, Input } from 'react-native-elements';
import firebase from '../../database/firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ChangePassword = (props) => {
    const [newPassword, setNewPassword] = useState({
        cPassword: '',
        nPassword: '',
        password: ''
    })
    const [user, setUser] = useState();
    //set result when user yes and no
    const [color, setColor] = useState();
    const [show, setShow] = useState();
    //Hanld firebase with data
    const [loading, setLoading] = useState(true)
    const handleChangeText = (name, value) => {
        setNewPassword({ ...newPassword, [name]: value })
    }
    const getUserById = async (id) => {
        const dbRef = firebase.db.collection('users').doc(id);
        const doc = await dbRef.get();
        const user = doc.data();

        setUser({
            ...user,
            id: doc.id
        })
        setLoading(false);
    }
    useEffect(() => {
        getUserById(props.route.params.userId);
    }, [])
    //Update this user
    const openConfirmationAlert = () => {
        Alert.alert('Bạn có chắc muốn thay đổi mật khẩu không?', '（￣︶￣）↗　', [
            { text: 'Yes', onPress: () => updateUser() },
            { text: 'No', onPress: () => cancelUpdate() },
        ])

    }
    //Alert cancel of update
    const cancelUpdate = () => {
        setShow('Bạn đã hủy bỏ');
        setColor('red');
    }
    const updateUser = async () => {
        if (newPassword.password === '' || newPassword.nPassword === '' || newPassword.cPassword === '') {
            setShow('Bạn không được để trống!');
            setColor('red');
        }
        else if (newPassword.cPassword != newPassword.nPassword) {
            setShow('Thất bại vì xác nhận mật khẩu');
            setColor('red');
        }
        else if (newPassword.password != user.password) {
            setShow('Mật khẩu cũ không chính xác');
            setColor('red');
        }
        else if (newPassword.cPassword.length<6 || newPassword.nPassword.length<6) {
            setShow('Mật khẩu phải lớn hơn 6 ký tự');
            setColor('red');
        }
        else {
            try {
                setShow('Bạn đã thay đổi mật khẩu thành công');
                setColor('green');
                const dbRef = firebase.db.collection('users').doc(props.route.params.userId);
                await dbRef.set({
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    password: newPassword.cPassword,
                    role: 0,
                    imageUser: user.imageUser
                })
                setUser(initialState);
            } catch (error) {
                console.log(console.error);
            }
        }

    }
    if (loading) {
        return (
            <View>
                <ActivityIndicator size='large' color='Blue' />
            </View>
        )
    }
    return (
       
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.head}>
                <Avatar
                    rounded
                    source={{ uri: (user.imageUser) }}
                    style={styles.sAvatar}
                    size="large"
                />
                {/* Name  */}
                <View style={styles.vName}>
                    <Text style={styles.tName}>{user.email}</Text>
                </View>

            </View>

            {/* body */}
            <KeyboardAwareScrollView>
            <View style={styles.body}>
            
                <Card style={{height:150}}>
               
                    <View style={styles.inputGroup}>
                        <Input secureTextEntry={true} placeholder='Nhập mật khẩu cũ' autoCorrect={false} placeholderTextColor="gray" leftIcon={<FontAwesome name='key' size={30} color='black' />} onChangeText={(value) => handleChangeText('password', value)} />
                    </View>
                    <View style={styles.inputGroup}>
                        <Input secureTextEntry={true} placeholder='Nhập mật khẩu mới' autoCorrect={false} placeholderTextColor="gray" leftIcon={<FontAwesome name='lock' size={30} color='black' />} onChangeText={(value) => handleChangeText('cPassword', value)} />
                    </View>
                    <View style={styles.inputGroup}>
                        <Input secureTextEntry={true} placeholder='Xác nhận mật khẩu mới' autoCorrect={false} placeholderTextColor="gray" leftIcon={<FontAwesome name='lock' size={30} color='black' />} onChangeText={(value) => handleChangeText('nPassword', value)} />
                    </View>
                   
                </Card>
               
            </View>
            </KeyboardAwareScrollView>
            {/* Footer */}

            <View style={styles.footer}>
                <View style={{ paddingBottom: 20, flex: 0.5 }}><Text style={{ textAlign: 'center', color: (color), fontSize: 16, fontWeight: 'bold' }}>{show}</Text>
                </View>
                <View style={{ flex: 0.5, backgroundColor: '#ff5b77', justifyContent: 'center', }}>
                    <Button color='white' title='Cập nhật mật khẩu' onPress={() => openConfirmationAlert()} />
                </View>
            </View>
        </View>
       
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    head: {
        flex: 1.5,
        backgroundColor: '#ff5b77',
        alignItems: 'center',
        padding: 21,
        flexDirection: 'row'
    },
    body: {
        flex: 5,
        marginTop: 40
    },
    footer: {
        flex: 2.4,
        padding: 25,
   
    },
    sAvatar: {

        width: 80,
        height: 80
    },
    tName: {
        color: 'white',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 10
    },
    vName: {
        marginLeft: 20,
    },
    inputGroup: {
        padding: 0,
    },



})
export default ChangePassword;