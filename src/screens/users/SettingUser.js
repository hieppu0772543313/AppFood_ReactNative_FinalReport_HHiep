import { useEffect, useState } from 'react';
import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Avatar, Card, Input } from 'react-native-elements';
import firebase from '../../database/firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getUserId } from '../Login';

const SettingUser = (props) => {
    const [user, setUser] = useState();
    const [allUser, setAllUser] = useState();
    //set result when user yes and no
    const [color, setColor] = useState();
    const [show, setShow] = useState();
    //Hanld firebase with data
    const [loading, setLoading] = useState(true)
    const handleChangeText = (name, value) => {
        setUser({ ...user, [name]: value })
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

        getUserById(getUserId());

    }, [])
    //check valid for email
    const checkEmailMatch = () => {
        var check = 0;
        user.filter((item) => {
            if (item.email === state.email) {
                check++;
            }
        })
        if (check > 0) {
            return false;
        }
        else {
            return true;
        }
    }
    //Update this user
    const openConfirmationAlert = () => {
        Alert.alert('Bạn có chắc muốn thay đổi thông tin không?', '', [
            { text: 'Yes', onPress: () => updateUser() },
            { text: 'No', onPress: () => cancelUpdate() },
        ])

    }
    //Alert cancel of update
    const cancelUpdate = () => {
        setShow('Bạn đã hủy bỏ');
        setColor('red');
    }
    //Reget email
    const validEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            return false;
        }
        else {
            return true;
        }
    }
    const updateUser = async () => {
        if (validEmail(user.email) === false) {
            setShow('Email không đúng định dạng');
            setColor('red');
        }
        else if (user.address.length < 10) {
            setShow('Địa chỉ phải lớn hơn 10 ký tự');
            setColor('red');
        }
        else {
            try {
                setShow('Bạn đã thay đổi thông tin thành công');
                setColor('green');
                const dbRef = firebase.db.collection('users').doc(props.route.params.userId);
                await dbRef.set({
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    password: user.password,
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
                    <Text style={styles.tName}>Thông Tin</Text>
                </View>
                <View>
                    <Button color='orange' title='Đổi mật khẩu' onPress={() => props.navigation.navigate('ChangePassword', { userId: user.id })} />
                </View>
            </View>

            {/* body */}
            <View style={styles.body}>

                <View style={styles.inputGroup}>
                    <Input placeholder="Get image online" color='black' fontSize={19}
                        value={user.imageUser} leftIcon={<FontAwesome name='map' size={24} color='black' errorStyle={{ color: 'red' }} />}
                        onChangeText={(value) => handleChangeText('imageUser', value)} />
                </View>
                <View style={styles.inputGroup}>
                    <Input placeholder="Email user" color='black' fontSize={19}
                        value={user.email} leftIcon={<FontAwesome name='envelope' size={24} color='black' errorStyle={{ color: 'red' }} />}
                        onChangeText={(value) => handleChangeText('email', value)} />
                </View>
                <View style={styles.inputGroup}>
                    <Input disabled placeholder="Phone User" color='black' fontSize={19}
                        value={user.phone} leftIcon={<FontAwesome name='phone' size={24} color='black' errorStyle={{ color: 'red' }} />}
                        onChangeText={(value) => handleChangeText('phone', value)} />
                </View>
                <View style={styles.inputGroup}>
                    <Input placeholder="Address User" color='black' fontSize={19}
                        value={user.address} leftIcon={<FontAwesome name='map' size={24} color='black' errorStyle={{ color: 'red' }} />}
                        onChangeText={(value) => handleChangeText('address', value)} />
                </View>
                <View style={{ marginTop: 20 }}><Text style={{ textAlign: 'center', color: (color), fontSize: 16, fontWeight: 'bold' }}>{show}</Text>
                </View>
            </View>
            {/* Footer */}

            <View style={styles.footer}>
                <View style={{ flex: 0.5, backgroundColor: '#ff5b77', justifyContent: 'center',}}>
                    <Button color='#ff5b77' title='Cập nhật thông tin' onPress={() => openConfirmationAlert()} />
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
        flex: 7,
        marginTop: 20,
        padding: 15
    },
    footer: {
        flex: 2.6,
        padding: 25,
        paddingTop: 120
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
        marginRight:20,
        marginTop:7,
    },
    inputGroup: {

        padding: 0,
        marginBottom: 2,


    },



})
export default SettingUser;