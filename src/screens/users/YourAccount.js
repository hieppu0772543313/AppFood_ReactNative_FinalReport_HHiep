import { useEffect, useState } from 'react';
import * as React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Card, Divider } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firebase from '../../database/firebase';
import {getUserId} from '../Login';
import Loading from '../Loading';

const YourAccount = (props) => {
    
    var userId = getUserId();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)

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
        getUserById(userId);
    }, [])
    if(loading){
        return(
           <Loading/>
        )
    }
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.head}>
                <Avatar
                    rounded
                    source={{uri: (user.imageUser)}}
                    style={styles.sAvatar}
                    size="large"
                />
                {/* Name  */}
                <View style={styles.vName}>
                    <Text style={styles.tName}>{user.email}</Text>
                    <Text style={styles.tBuy}>Đã mua: 32 món ăn</Text>
                </View>
            </View>

            {/* body */}
            <View style={styles.body}>
                <Card>
                    {/* Hitory */}
                    <TouchableOpacity onPress={()=>props.navigation.navigate('HistoryCart')}>
                        <View style={styles.c1}>
                            <Text style={styles.t1}><FontAwesome name='history' size={23} color='black' />   Lịch sử đặt hàng</Text>
                            <Divider style={{ backgroundColor: 'black', marginTop: 20 }} />
                        </View>
                    </TouchableOpacity>
                    {/* SettingAccount */}
                    <TouchableOpacity onPress={()=>props.navigation.navigate('SettingUser',{userId: user.id})}>
                        <View style={styles.c1}>
                            <Text style={styles.t1}><FontAwesome name='wrench' size={23} color='black' />   Thiết lập tài khoản</Text>
                            <Divider style={{ backgroundColor: 'black', marginTop: 20 }} />
                        </View>
                    </TouchableOpacity>
                    {/* Suppport */}
                    <TouchableOpacity onPress={()=>props.navigation.navigate('Support')}>
                        <View style={styles.c1}>
                            <Text style={styles.t1}><FontAwesome name='medkit' size={23} color='black' />   Hỗ trợ</Text>
                            <Divider style={{ backgroundColor: 'black', marginTop: 20 }} />
                        </View>
                    </TouchableOpacity>
                    {/* Introduction */}
                    <TouchableOpacity onPress={()=>props.navigation.navigate('Introduce')}>
                        <View style={styles.c1}>
                            <Text style={styles.t1}><FontAwesome name='certificate' size={23} color='black' />   Giới thiệu</Text>
                            <Divider style={{ backgroundColor: 'black', marginTop: 20 }} />
                        </View>
                    </TouchableOpacity>
                   
                </Card>
            </View>
            {/* Footer */}
            <View style={styles.footer}>
                <View style={{ flex: 0.5, backgroundColor: 'green', justifyContent: 'center', }}>
                    <Button color='green' title='Đăng xuất' onPress={() => props.navigation.replace('Login')} />
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
        marginTop: 40
    },
    footer: {
        flex: 2,
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
    },
    tBuy: {
        color: 'white',
        fontSize: 15,
        fontStyle: 'italic'
    },
    c1: {
        height: 70
    },
    c2: {
        height: 80
        ,backgroundColor:'red'
    },
    t1: {
        color: 'black',
        fontSize: 20
    }

})
export default YourAccount;