

import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Image,
    FlatList,
    Dimensions,
    RefreshControl

} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get('window');
import firebase from '../../database/firebase';
import { getUserId } from '../Login';
import Loading from '../Loading';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Button, Divider, Avatar } from 'react-native-elements';
const EightScreen = (props) => {

    //dialog
    const [visible, setVisible] = React.useState(false);
    const toggleAlert = React.useCallback(() => {
        setVisible(!visible);
    }, [visible]);
    const _closeApp = () => {
        setVisible(!visible);
    }
    //set notification
    const [nIcon, setnIcon] = useState();
    const [title, setTitle] = useState();
    const [color, setColor] = useState();
    const [dataCart, setDataCart] = useState([])
    var userId = getUserId();

    const [colorAlert, setColorAlert] = useState()
    //Get value of firebase
    const [loading, setLoading] = useState(true);
    const [food, setFood] = useState([]);
  
    useEffect(() => {
        let isMounted = true;
        
        firebase.db.collection('foods')
        .where("type", "==", "Mì")
        .onSnapshot(querySnapshot => {
            const food = [];
            querySnapshot.docs.forEach(doc => {
                const { name, linkImage, price, description, sold } = doc.data();
                food.push({
                    id: doc.id,
                    name,
                    linkImage,
                    price,
                    description,
                    sold
                })
            });
            setFood(food);
            setDataSouce(food);
            //read all information user with cart before
            firebase.db.collection('addToCart').onSnapshot(querySnapshot => {
                const dataCart = [];
                querySnapshot.docs.forEach(doc => {
                    const { idFood, idUser, } = doc.data();
                    dataCart.push({
                        id: doc.id,
                        idFood,
                        idUser
                    })
                });
                setDataCart(dataCart);
            })

        })
        return () => { isMounted = false };
    }, [])
    //add to list cart for user
    const addDataCart = async (idFood) => {
        let isMounted = true;
        try {
            await firebase.db.collection('addToCart').add({
                idUser: userId,
                idFood: idFood,
                amountFood: 1
            })
            setTitle('Thêm món ăn vào giỏ hàng thành công^^');
            setnIcon('✔');
            setColor('red');
            setColorAlert('green');
            toggleAlert();

        } catch (error) {
            console.log(error);
        }
        return () => { isMounted = false };
    }
    // button add to cart
    const updateCartForUser = async (idFood) => {
        var checkCartExist = 0;
        dataCart.filter((item) => {
            if (item.idFood === idFood&&item.idUser===userId) {
                checkCartExist++;
            }
        })
        if (checkCartExist > 0) {
            setTitle('Bạn đã thêm món ăn này vào giỏ hàng');
            setnIcon('✔');
            setColorAlert('green');
            toggleAlert();
        }
        else {
            addDataCart(idFood);
        }
    }
    //Handle seacrch
    const [dataSouce, setDataSouce] = useState([]);

   
    if (loading) {
        <Loading />
    }
   

    //handle food user like



    return (

        <View style={styles.container}>
       

            <FlatList style={{ padding: 15 }}
                data={dataSouce}

                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                            <View style={styles.bookContainer}>
                                <Avatar rounded style={styles.image} source={{ uri: (item.linkImage) }} />
                                <View style={styles.dataContainer}>
                                    <Text numberOfLines={1} style={styles.title}>
                                        {item.name}
                                    </Text>
                                    <Text numberOfLines={4} style={styles.description}>
                                        Đã bán:  {item.sold}
                                    </Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.author}>đ{item.price}</Text>
                                        <TouchableOpacity onPress={() => updateCartForUser(item.id)} style={{ marginRight: 60 }} >
                                            <FontAwesome name='cart-plus' size={32} color='black' />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
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
                }}>
                    <Divider /><Text>{nIcon}</Text></View>}
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
        backgroundColor: '#FFFFCC',
    },
    header: {
        height: 70,
        width: '100%',
        backgroundColor: '#ff5b77',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    input: {
        height: 45,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        paddingLeft: 10,
    },
    bookContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#99FF99',
        borderRadius: 20,
        marginBottom: 15
    },
    image: {
        height: 100,
        width: 120,
    },
    dataContainer: {
        padding: 10,
        paddingTop: 5,
        width: width - 100,
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
    author: {
        fontSize: 18,
        textAlign: 'left',
        paddingTop: 15,
        color: '#fe6132'
    },
});
export default EightScreen;
