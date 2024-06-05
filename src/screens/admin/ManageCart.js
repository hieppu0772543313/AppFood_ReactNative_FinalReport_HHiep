import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Dimensions, Text } from 'react-native';
import firebase from '../../database/firebase';
import DropDownPicker from 'react-native-dropdown-picker';
import { ListItem, Avatar } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');

const ManageCart = ({ navigation }) => {
    //Event dropdown picker
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Đang chờ', value: 'Đang chờ' },
        { label: 'Xác nhận', value: 'Đã xác Nhận' },
        { label: 'Vận chuyển', value: 'Đang vận chuyển' },
        { label: 'Thanh toán', value: 'Đã thanh toán' },
        { label: 'Huỷ bỏ', value: 'Đã huỷ bỏ' }
    ]);
    //Data cart
    const [foodCart, setFoodCart] = useState([]);
    const [all, setAll] = useState([]);
    
    useEffect(() => {
        const unsubscribe = firebase.db.collection('invoice')
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
                    });
                });

                setFoodCart(foodCart);
                setAll(foodCart);
            });
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);
    
    //Filter status
    const _filterStatus = useCallback(() => {
        if (value) {
            const fStatus = foodCart.filter(item => item.status === value);
            setAll(fStatus);
        } else {
            setAll(foodCart);
        }
    }, [value, foodCart]);
    
    useEffect(() => {
        _filterStatus();
    }, [value, _filterStatus]);

    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: 'orange', zIndex: 2, padding: 15, flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ flex: 7 }}>
                    <DropDownPicker 
                        style={{ width: 300 }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={(val) => {
                            setValue(val);
                            _filterStatus(); // Call filter function when value changes
                        }}
                        setItems={setItems}
                        placeholder='Trạng thái'
                    />
                </View>
                <View style={{ flex: 1, paddingLeft: 75, paddingTop: 5 }}>
                    <TouchableOpacity onPress={_filterStatus}>
                        <FontAwesome name='search' size={30} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
            {
                all.map(item => (
                    <ListItem key={item.id} bottomDivider onPress={() => navigation.navigate('ManageHistoryDetail', { key: item.key, userId: item.idUser })}>
                        <Avatar rounded style={styles.sAvatar} source={require('../../images/cart.png')} />
                        <ListItem.Content>
                            <ListItem.Title>{item.status}</ListItem.Title>
                            <ListItem.Subtitle style={{ paddingTop: 10, color: 'red' }}>đ{item.total}</ListItem.Subtitle>
                        </ListItem.Content>
                        <Text>{item.createdAt}</Text>
                        <ListItem.Chevron />
                    </ListItem>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        fontSize: 16,
        color: 'gray',
    },
    sAvatar: {
        width: 80,
        height: 80
    }
});

export default ManageCart;
