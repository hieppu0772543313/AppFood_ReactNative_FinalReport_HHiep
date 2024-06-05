import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import firebase from '../../database/firebase';
import { ListItem, Avatar } from 'react-native-elements';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeAdmin = (props) => {
    const [user, setUser] = useState([])

    useEffect(() => {
        firebase.db.collection('users').onSnapshot(querySnapshot => {
            const user = [];
            querySnapshot.docs.forEach(doc => {
                const { email, password, phone, address, imageUser } = doc.data();
                user.push({
                    id: doc.id,
                    email,
                    password,
                    phone,
                    address,
                    imageUser
                })
            });
            setUser(user);
        })
    }, [])

    return (

        <View style={{flex: 1}}>
             <View style={{ alignItems: 'center', backgroundColor: 'orange', paddingHorizontal: 20, padding: 20, justifyContent: 'center' }}>
                    <Text style={styles.tt}><Ionicons name='home' size={23} color='white' /> Quản lý người dùng</Text>
                </View>
            <ScrollView>
               
                {
                    user.map(item => {
                        return (
                            <ListItem key={item.id} bottomDivider
                                onPress={() => props.navigation.navigate('ManageDetailUsers', {
                                    userId: item.id
                                })}>

                                <Avatar rounded style={styles.sAvatar} source={{ uri: (item.imageUser) }} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.email}</ListItem.Title>
                                    <ListItem.Subtitle style={{ paddingTop: 10 }}>{item.address}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}
export default HomeAdmin;
const styles = StyleSheet.create({
    tt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 23
    },
    sAvatar: {
        width: 80,
        height: 80
    }
});