import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import firebase from '../../database/firebase';
import { ListItem, Avatar, FAB } from 'react-native-elements';
import { StyleSheet,LogBox } from 'react-native';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
//fix error yellow (It's not error because it dependace software)
import _ from 'lodash';
const FoodAdmin = (props) => {
    //Turn of waring yello componen will...
    LogBox.ignoreLogs(['componentWillReceiveProps']);
    LogBox.ignoreLogs(['source.uri should not be an empty string']);
    const _console = _.clone(console);
    console.warn = message => {
    if (message.indexOf('componentWillReceiveProps') <= -1) {
     _console.warn(message);
    } 
   };
   //Set value default
    const [food, setFood] = useState([])

    useEffect(() => {
        firebase.db.collection('foods').onSnapshot(querySnapshot => {
            const food = [];
            querySnapshot.docs.forEach(doc => {
                const { name, linkImage, price } = doc.data();
                food.push({
                    id: doc.id,
                    name,
                    linkImage,
                    price,
                })
            });
            setFood(food);
        })
    }, [])
    return (
        <View style={{flex: 1}}>
            <View style={{ alignItems: 'center', backgroundColor: 'orange', paddingHorizontal: 20, padding: 20, justifyContent: 'center' }}>
                    <Text style={styles.tt}><Ionicons name='earth' size={23} color='white' /> Quản lý món ăn</Text>
                </View>
            <ScrollView>
                
                {
                    food.map(item => {
                        return (
                            <ListItem key={item.id} bottomDivider
                                onPress={() => props.navigation.navigate('ManageFoods', {
                                    foodId: item.id
                                })}>

                                <Avatar rounded style={styles.sAvatar} source={{ uri: (item.linkImage) }} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.name}</ListItem.Title>
                                    <ListItem.Subtitle style={{ paddingTop: 10 }}>Giá: {item.price}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        )
                    })
                }

            </ScrollView>


            
            <ActionButton 
                style={styles.createBu}
                buttonColor="rgba(231,76,60,1)"
                onPress={() => props.navigation.navigate('CreateFood')}
            />


        </View>

    )
}
export default FoodAdmin;
const styles = StyleSheet.create({
    tt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 23
    },
    createBu: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 400
    },
    sAvatar: {
        width: 80,
        height: 80
    }
});