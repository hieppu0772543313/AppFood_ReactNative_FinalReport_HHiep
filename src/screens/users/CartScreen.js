import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl, StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../../database/firebase';
import Loading from '../Loading';
import { Button, Avatar } from 'react-native-elements';
import { getUserId } from '../Login';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
const { width, height } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
    var userId = getUserId();
    //Declare to using dialog
    const [colorAlert, setColorAlert] = useState()
    const [visible, setVisible] = React.useState(false);
    const [title, setTitle] = useState();
    const toggleAlert = React.useCallback(() => {
        setVisible(!visible);
    }, [visible]);
    const [nIcon, setnIcon] = useState();
    //Loading
    const [loading, setLoading] = useState(true);
    const [food, setFood] = useState([]);
    const [filterData, setFilterData] = useState([])
    const [dataCart, setDataCart] = useState([])
    const [total, setTotal] = useState(0)
    useEffect(() => {
        let isMounted = true;
        //Read all information foods
        firebase.db.collection('foods').onSnapshot(querySnapshot => {
            const food = [];
            querySnapshot.docs.forEach(doc => {
                const { name, linkImage, price, sold } = doc.data();
                food.push({
                    id: doc.id,
                    name,
                    linkImage,
                    price,
                    sold
                })
            });
            setFood(food);

            ///read all information user like before
            firebase.db.collection('addToCart').onSnapshot(querySnapshot => {
                const dataCart = [];
                querySnapshot.docs.forEach(doc => {
                    const { idFood, idUser, amountFood } = doc.data();
                    dataCart.push({
                        id: doc.id,
                        idFood,
                        idUser,
                        amountFood
                    })
                });
                setDataCart(dataCart);
            })


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
                const filterData = [];
                var total = 0;
                for (let x = 0; x < food.length; x++) {
                    for (let y = 0; y < dataCart.length; y++) {
                        if (food[x].id === dataCart[y].idFood && dataCart[y].idUser === userId) {
                            filterData.push(food[x]);
                            var toInt = parseInt(food[x].price);
                            total += toInt;
                        }
                    }
                }
                setTotal(total);
                setFilterData(filterData);
            })

        })
        return () => { isMounted = false };
    }, [])
    //Close dialog
    const _closeApp = () => {
        setVisible(!visible);
    }
    //call again data flatlist
    const onRefresh  = useCallback(() => {
        const filterData = [];
        var total = 0;
        for (let x = 0; x < food.length; x++) {
            for (let y = 0; y < dataCart.length; y++) {
                if (food[x].id === dataCart[y].idFood && dataCart[y].idUser === userId) {
                    filterData.push(food[x]);
                    var toInt = parseInt(food[x].price);
                    total += toInt;
                }
            }
        }
        setTotal(total);
        setFilterData(filterData);
    })
    //Clear data after invoice and add data item
    const _clearData = async (key) => {
        let isMounted = true;
        for (let y = 0; y < dataCart.length; y++) {
            if (dataCart[y].idUser === userId) {
                try {
                    await firebase.db.collection('invoiceItem').add({
                        key: key,
                        idUser: userId,
                        createdAt: new Date().toLocaleString().replace(",", "").replace(/:.. /, " "),
                        idFood: dataCart[y].idFood,
                        amountFood: '0'
                    })

                } catch (error) {
                    console.log(error);
                }
                const dbRef = firebase.db.collection('addToCart').doc(dataCart[y].id);
                await dbRef.delete();
            }
        }
        return () => { isMounted = false };
    }

    //Invoice
    const _invoice = async () => {
        //Check cart user not null to add
        const dateNow = new Date().toLocaleString().replace(",", "").replace(/:.. /, " ");
        const key= userId + "-"+ dateNow + "-" + total;
        if (total != 0) {
            try {
                await firebase.db.collection('invoice').add({
                    key: key,
                    idUser: userId,
                    createdAt:dateNow ,
                    status: 'Đang chờ',
                    total: total,
                   
                })
                setTitle('Thanh toán thành công');
                setnIcon('✔');
                setColorAlert('green');
                toggleAlert();
                _clearData(key);
               
            } catch (error) {
                console.log(error);
            }
        } else {
            setTitle('Thanh toán thất bại');
            setnIcon('✖');
            setColorAlert('red');
            toggleAlert();
        }
       
    }
    //set food Count
    const _subValue = async (foodId) => {
        let isMounted = true;
        let idCart = [];
        dataCart.filter((item) => {
            if (item.idFood === foodId && item.idUser == userId) {
                idCart = item;
            }
        })
        const dbRef = firebase.db.collection('addToCart').doc(idCart.id);
        await dbRef.delete();
        return () => { isMounted = false };
    }

    if (loading) {
        <Loading />
    }

    return (

        <View style={styles.container}>
            <FlatList style={{ padding: 15 }}
                data={filterData}
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item, index }) => {
                    return (

                        <View style={styles.bookContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('DetailProduct', { foodId: item.id })}>
                                <Avatar rounded style={styles.image} source={{ uri: (item.linkImage) }} />
                            </TouchableOpacity>
                            <View style={styles.dataContainer}>
                                <Text numberOfLines={1} style={styles.title}>
                                    {item.name}
                                </Text>
                                <Text numberOfLines={4} style={styles.description}>

                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.author}>đ{item.price}</Text>
                                    <TouchableOpacity onPress={() => _subValue(item.id)} style={{ marginRight: 60 }} >
                                        <FontAwesome name='close' size={32} color='black' />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                    );
                }}
            />
            <View style={{ paddingTop: 5 }}><Button onPress={() => _invoice()} icon={{
                name: "check",
                size: 25,
                color: "white"
            }} style={{ padding: 15, borderRadius: 20 }} title={'Thanh toán  -  ' + total + '.000đ'} /></View>
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
        backgroundColor: '#FFFFCC',
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


export default CartScreen;
