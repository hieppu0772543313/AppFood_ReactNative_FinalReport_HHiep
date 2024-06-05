import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, Image, Linking, Alert } from 'react-native';
import firebase from '../../database/firebase';
import { Card } from 'react-native-elements';
import color from 'color';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Divider } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { Tab } from 'react-native-elements';
import { getUserId } from '../Login';
import Loading from '../Loading';
import { FancyAlert } from 'react-native-expo-fancy-alerts';



const DetailProduct = (props) => {
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
    var userId = getUserId();
    var count = 0;
    const [dataFood, seteDataFood] = useState([])
    const [color, setColor] = useState()
    const [colorAlert, setColorAlert] = useState()
    const [dataViewOne, setDataViewOne] = useState()
    const [dataViewTwo, setDataViewTwo] = useState()
    const [dataLike, setDataLike] = useState([])
    const [dataCart, setDataCart] = useState([])
    useEffect(() => {
        let isMounted = true;
        firebase.db.collection('foods').onSnapshot(querySnapshot => {
            const food = [];
            querySnapshot.docs.forEach(doc => {

                const { name, linkImage, price, sold, description } = doc.data();
                dataFood.push({
                    id: doc.id,
                    name,
                    linkImage,
                    price,
                    sold,
                    description,
                })
            });
            //read data like of users
            getFoodById(props.route.params.foodId);
            getUserById(userId);

            ///read all information user like before
            firebase.db.collection('usersLike').onSnapshot(querySnapshot => {
                const dataLike = [];
                querySnapshot.docs.forEach(doc => {
                    const { idFood, idUser, } = doc.data();
                    dataLike.push({
                        id: doc.id,
                        idFood,
                        idUser
                    })
                });
                setDataLike(dataLike);
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
            })

            
            seteDataFood(dataFood);
            let getTopViewFood = dataFood.sort(function (x, y) {
                return y.View - x.View;
            })
            //handle dataview one for list view

            const dataViewOne = [];
            const dataViewTwo = [];
            for (let i = 0; i < getTopViewFood.length; i++) {
                count++;
                if (count % 2 == 0 && count <= 10) {
                    dataViewOne.push(getTopViewFood[i]);
                }
                else if (count % 2 != 0 && count <= 10) {
                    dataViewTwo.push(getTopViewFood[i]);
                }
            }
           
            setDataViewOne(dataViewOne);
            setDataViewTwo(dataViewTwo);
        })
        return () => { isMounted = false };
    },
        [])
    const [food, setFood] = useState();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();
    //get user id
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
    //get food id
    const getFoodById = async (id) => {
        const dbRef = firebase.db.collection('foods').doc(id);
        const doc = await dbRef.get();
        const food = doc.data();

        setFood({
            ...food,
            id: doc.id
        })
        setLoading(false);
    }
   
    //when user want add it in list like
    const _deleteFoodUserLike = async () => {
        let isMounted = true;
        let idLike = [];
        dataLike.filter((item) => {
            if (item.idFood === props.route.params.foodId && item.idUser == userId) {
                idLike = item;

            }
        })
        const dbRef = firebase.db.collection('usersLike').doc(idLike.id);
        await dbRef.delete();
        setColor('black');
        return () => { isMounted = false };
    }
    //Add to list like in firebase
    const addDataLike = async () => {
        let isMounted = true;
        try {
            await firebase.db.collection('usersLike').add({
                idUser: userId,
                idFood: props.route.params.foodId
            })
            setTitle('Thêm vào danh sách yêu thích thành công^^');
            setnIcon('💖');
            setColor('red');
            setColorAlert('green');
            toggleAlert();

        } catch (error) {
            console.log(error);
        }
        return () => { isMounted = false };
    }
    //add to list cart for user
    const addDataCart = async () => {
        let isMounted = true;
        try {
            await firebase.db.collection('addToCart').add({
                idUser: userId,
                idFood: props.route.params.foodId,
                amountFood: 1
            })
            setTitle('Thêm món ăn vào giỏ hàng thành công^^');
            setnIcon('✔');
            setColorAlert('green');
            toggleAlert();

        } catch (error) {
            console.log(error);
        }
        return () => { isMounted = false };
    }
    //button tym
    const updateLike = async () => {
        var checkLikeExist = 0;
        dataLike.filter((item) => {
            if (item.idFood === props.route.params.foodId&&item.idUser===userId) {
                checkLikeExist++;
            }
        })
        if (checkLikeExist > 0) {
            setColor('red');
            Alert.alert('Bạn muốn xoá món ăn ra khỏi danh sách yêu thích?', '[]~(￣▽￣)~*', [
                { text: 'Có', onPress: () => _deleteFoodUserLike() },
                { text: 'Không', onPress: () => console.log(false) },
            ])
        }
        else {
            addDataLike();
        }

    }
    // update cart of user
    const updateCartForUser = async () => {
        var checkCartExist = 0;
        dataCart.filter((item) => {
            if (item.idFood === props.route.params.foodId&&item.idUser===userId) {
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
            addDataCart();
        }

    }
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Image source={{ uri: (food.linkImage) }} style={{ width: 377, height: 200, marginLeft: 0, resizeMode: 'stretch' }} />
                </View>
                <View style={styles.cont}>
                    <Text style={styles.sTitle}>{food.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.sPrice}>Giá: {food.price} vnđ</Text>
                        <TouchableOpacity onPress={() => updateLike()} style={{ marginRight: 14 }}>
                            <FontAwesome name='heart' size={30} color={color} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.sPrice}>Đã bán: {food.sold} </Text>
                        <Text style={styles.sPrice}>Số lượng: {food.amount}</Text>
                    </View>
                </View>
                <Divider style={{ backgroundColor: 'black' }} />
                <View style={styles.vFoody}>
                    <Text style={styles.tDescription1}>Mô tả</Text>
                </View>
                <Card>
                    <View style={styles.vFood}>

                        <Text style={styles.tDescription2}>{food.description}</Text>
                    </View>
                </Card>
                <View style={{ paddingLeft: 17, paddingTop: 30 }}>
                    <Text style={styles.tDescription1}>Có thể bạn cũng thích</Text>
                </View>
                <Card>
                    <View style={styles.vFoodx}>


                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* 5 product hot */}
                            <View style={{ flex: 1, }}>
                                <SafeAreaView >
                                    <FlatList
                                        keyExtractor={food => food.description}
                                        data={dataViewOne}
                                        renderItem={({ item }) => {

                                            return (
                                                <TouchableOpacity onPress={() => props.navigation.replace('DetailProduct2', { foodId: item.id })}>
                                                    <View style={styles.item}>
                                                        <Image source={{ uri: (item.linkImage) }} style={{ width: 133, height: 160, marginLeft: 0, resizeMode: 'stretch' }} />
                                                        <Divider style={{ backgroundColor: 'white' }} />
                                                        <Text style={{ textAlign: 'center', fontSize: 17 }}>{item.name}</Text>
                                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                            <Text style={{ color: 'red', fontSize: 12 }}>{item.price}</Text>
                                                            <Text style={{ marginLeft: 33, fontSize: 12 }}>Đã bán {item.sold}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}

                                    />
                                </SafeAreaView>
                            </View>
                            {/* 5 product hot after */}
                            <View style={{ flex: 1 }}>
                                <SafeAreaView >
                                    <FlatList
                                        keyExtractor={food => food.description}
                                        data={dataViewTwo}
                                        renderItem={({ item }) => {

                                            return (
                                                <TouchableOpacity onPress={() => props.navigation.replace('DetailProduct2', { foodId: item.id })}>
                                                    <View style={styles.item}>
                                                        <Image source={{ uri: (item.linkImage) }} style={{ width: 133, height: 160, marginLeft: 0, resizeMode: 'stretch' }} />
                                                        <Divider style={{ backgroundColor: 'white' }} />
                                                        <Text style={{ textAlign: 'center', fontSize: 17 }}>{item.name}</Text>
                                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                            <Text style={{ color: 'red', fontSize: 12 }}>{item.price}</Text>
                                                            <Text style={{ marginLeft: 33, fontSize: 12 }}>Đã bán {item.sold}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}

                                    />
                                </SafeAreaView>
                            </View>
                        </View>

                    </View>
                </Card>

            </ScrollView>
            <Tab>
                <View style={{ flexDirection: 'row', flex: 1.6 }}>
                    <View style={{ flex: 1, backgroundColor: '#259d55' }}>
                        <Button type="clear" onPress={() => { Linking.openURL('tel:056 8442815'); }} icon={<FontAwesome name='phone' size={31} color='white' />} />
                    </View>
                    <Divider />
                    <Divider style={{ backgroundColor: 'blue' }} />
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#259d55', borderRightWidth: 1, borderLeftWidth: 1 }}>
                        <Button onPress={() => _deleteFoodUserLike()} type="clear" icon={<FontAwesome name='comment' size={31} color='white' />} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => updateCartForUser()} style={{ flex: 1.5, backgroundColor: 'red', color: 'red', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 22, color: 'white', }}>Mua ngay</Text>
                    </TouchableOpacity>

                </View>
            </Tab>
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

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cont: {
        padding: 15
    },
    sTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        color: 'green',
        marginTop: 10
    },
    sPrice: {
        fontSize: 16,
        color: 'black',
        marginTop: 30
    },
    sAmount: {
        fontSize: 16,
        color: 'black',
        marginTop: 30,

    },
    vFood: {
        padding: 0,
    },
    vFoodx: {
        padding: 0,
    },
    vFoody: {
        paddingTop: 26,
        paddingLeft: 17
    },
    tDescription1: {
        fontWeight: 'bold',
        fontSize: 18
    },
    tDescription2: {
        marginTop: 15,
        fontSize: 18
    },
    item: {
        borderWidth: 1,
        margin: 10
    }

})
export default DetailProduct;


