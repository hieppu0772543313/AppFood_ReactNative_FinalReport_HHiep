import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, StyleSheet, ImageBackground, Button, Alert,LogBox } from 'react-native';
import firebase from '../../database/firebase';
import { Input } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';

const ManageDetailUsers = (props) => {
    const initialState = {
        id: '',
        email: '',
        phone: '',
        address: '',
        role: ''
    }
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)
    //Event dropdown picker
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'User', value: '0' },
        { label: 'Admin', value: '1' },
    ]);
    //Get user throw id
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
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        let isMounted = true;
        getUserById(props.route.params.userId);
        return () => { isMounted = false };
    },

        [])
    const handleChangeText = (name, value) => {
        setUser({ ...user, [name]: value })
    }
    const deleteUser = async () => {
        const dbRef = firebase.db.collection('users').doc(props.route.params.userId);
        await dbRef.delete();
        props.navigation.navigate('HomeAdmin');
    }
    const openConfirmationAlert = () => {
        Alert.alert('Remove the user', 'Are you sure? ', [
            { text: 'Yes', onPress: () => deleteUser() },
            { text: 'No', onPress: () => console.log(false) },
        ])
    }
    const updateUser = async () => {
       var newRole = '';
        if(value!=null){
           newRole=value;
        }
        else{
            newRole=user.role;
        }
        const dbRef = firebase.db.collection('users').doc(props.route.params.userId);
        await dbRef.set({
            password: user.password,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: newRole,
            imageUser: user.imageUser,
        })
        setUser(initialState);
        props.navigation.navigate('HomeAdmin');
    }

    if (loading) {
        return (
            <View>
                <ActivityIndicator size='large' color='Blue' />
            </View>
        )
    }
    return (
        <ImageBackground  style={styles.image}>
            <KeyboardAwareScrollView>
                <View>
                    <Text style={styles.tTitle}>Quản lý người dùng</Text>
                </View>
                <View style={styles.inputGroup}>
                    <Input placeholder="Email user" color='black' fontSize={19}
                        value={user.email} leftIcon={<FontAwesome name='envelope' size={24} color='black' errorStyle={{ color: 'red' }} />}
                        onChangeText={(value) => handleChangeText('email', value)} />
                </View>
                <View style={styles.inputGroup}>
                    <Input placeholder="Phone User" color='black' fontSize={19}
                        value={user.phone} leftIcon={<FontAwesome name='phone' size={24} color='black' errorStyle={{ color: 'red' }} />}
                        onChangeText={(value) => handleChangeText('phone', value)} />
                </View>
                <View style={styles.inputGroup}>
                    <Input placeholder="Address User" color='black' fontSize={19}
                        value={user.address} leftIcon={<FontAwesome name='map' size={24} color='black' errorStyle={{ color: 'red' }} />} />
                </View>
                <View style={styles.inputGroup}>
                    <View style={{ flexDirection: 'row', zIndex: 7, paddingBottom: 90,}}>
                        <FontAwesome name='adjust' size={25} color='black' style={{marginLeft:10}} />
                        <Text style={{ fontSize: 19, marginLeft: 20, fontWeight: 'bold' }}>{user.role}</Text>
                        <DropDownPicker style={{ width: 170, marginLeft: 110, backgroundColor:"#EEEEEE"}}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder='Chọn quyền'
                        />
                    </View>


                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', zIndex: 5, }}>
                    <View style={styles.vUpdate}>
                        <Button color='green' title='Cập Nhật' onPress={() => updateUser()} />
                    </View>
                    <View style={styles.vDetele}>
                        <Button color='red' title='Xóa người dùng' onPress={() => openConfirmationAlert()} />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputGroup: {

        padding: 0,
        marginBottom: 5,


    },
    image: {
        flex: 1,
        resizeMode: "cover",
        padding: 30,
        backgroundColor: "#EEEEEE",
    },
    tTitle: {
        fontWeight: 'bold',
        color: 'green',
        fontSize: 27,
        textAlign: 'center',
        marginBottom: 35
    },
    vUpdate: {
        backgroundColor: 'green',
        borderRadius: 20,
        width: 150,
        
    },
    vDetele: {
        backgroundColor: 'red',
        borderRadius: 20,
        width: 150,
    }

})
export default ManageDetailUsers;


