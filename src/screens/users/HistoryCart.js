import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Dimensions, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../../database/firebase';
import Loading from '../Loading';
import { ListItem, Avatar } from 'react-native-elements';
import { getUserId } from '../Login';
const { width, height } = Dimensions.get('window');

const HistoryCart = ({ navigation }) => {
    var userId = getUserId();
    const [foodCart, setFoodCart] = useState([]);
    const [filterCart, setFilterCart] = useState([]);
    useEffect(() => {
        firebase.db.collection('invoice')
            // .where('idUser', '==',  userId)
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const foodCart = [];
                querySnapshot.docs.forEach(doc => {

                    const { createdAt, status, idUser, total, key } = doc.data();
                    foodCart.push({
                        id: doc.id,
                        createdAt,
                        status,
                        idUser,
                        total,
                        key
                    })
                });

                setFoodCart(foodCart);
                const filterCart = foodCart.filter((item) => {
                    return item.idUser === userId;
                })
                setFilterCart(filterCart);
                //sort by date
            })
    }, [])
    return (
        <View style={styles.container}>
            {
                foodCart.map(item => {
                    return (
                        <ListItem key={item.id} bottomDivider
                            onPress={() => navigation.navigate('DetailHistory', { key: item.key })}>

                            <Avatar rounded style={styles.sAvatar} source={require('../../images/cart.png')} />
                            <ListItem.Content>
                                        <ListItem.Title>{item.status}</ListItem.Title>
                                        <ListItem.Subtitle style={{ paddingTop: 10, color: 'red' }}>đ{item.total}</ListItem.Subtitle>
                                    </ListItem.Content>
                              <Text>{item.createdAt}</Text>        
                            <ListItem.Chevron />
                        </ListItem>
                    )
                })
            }
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFCC',
    },
    sAvatar: {
        width: 80,
        height: 80
    }
});


export default HistoryCart;
