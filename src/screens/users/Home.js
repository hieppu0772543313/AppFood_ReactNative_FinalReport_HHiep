import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, SafeAreaView, ScrollView, LogBox, Dimensions } from 'react-native';
import { Divider, Card, ListItem, Avatar } from 'react-native-elements';
import firebase from '../../database/firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import * as Notifications from 'expo-notifications';

const { width, height } = Dimensions.get('window');
const Home = (props) => {
    var i = 0;
    const [food, setFood] = useState([]);
    const [dataHead, setDataHead] = useState([]);
    const [dateFood, setDateFood] = useState([]);
    const [viewFood, setViewFood] = useState([]);
    const [soldFood, setSoldFood] = useState([]);
    const [query, setQuery] = useState();
    const _search = () => {
        props.navigation.navigate('FindByFood', { nameFood: query });
    }
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        (async function () {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "🐱‍🏍 Chào mừng bạn quay trở lại",
                    body: "Bạn muốn mua gì nào ?",
                    data: { data: 'goes here' },
                },
                trigger: { seconds: 5 },
            });
        })();
        firebase.db.collection('foods')
            .onSnapshot(querySnapshot => {
                const food = [];
                querySnapshot.docs.forEach(doc => {

                    const { name, linkImage, price, sold, view, amount, createdAt } = doc.data();
                    food.push({
                        id: doc.id,
                        name,
                        linkImage,
                        price,
                        sold,
                        view,
                        amount,
                        createdAt
                    })
                });
                let getSoldFood = food.sort(function (x, y) {
                    return y.sold - x.sold;
                })
                //get data form firebase
                setFood(food);
                //sort by date
                let dateFood = food.filter(item => {
                    return item.view > 10;
                })
                setDateFood(dateFood);
                //Sort by sold
                var arrHead = [];
                var arrSold = [];
                var arrView = [];
                var count = 0;
                for (let i = 0; i < getSoldFood.length; i++) {
                    count++;
                    if (count < 7) {
                        arrHead.push(getSoldFood[i]);
                    }
                    if (count % 2 == 0 && count < 21 && count >= 7) {
                        arrSold.push(getSoldFood[i]);
                    }
                    else if (count % 2 != 0 && count < 21 && count >= 7) {
                        arrView.push(getSoldFood[i]);
                    }
                }
                setDataHead(arrHead);
                setSoldFood(arrSold);
                //Handle view
                setViewFood(arrView);
            })
    }, [])


    return (
        <View style={styles.container}>
                <View style={styles.header}>

                    <TextInput
                        placeholder="Tên món ăn ..."
                        placeholderTextColor="gray"
                        value={query}
                        onChangeText={(query) => setQuery(query)}
                        style={styles.input}
                        onSubmitEditing={() => {
                            _search();
                        }}
                    />

                    <TouchableOpacity onPress={() => props.navigation.navigate('CartScreen')}>
                        <FontAwesome style={{ paddingHorizontal: 10 }} name='shopping-cart' size={28} color='black' />
                    </TouchableOpacity>

                </View>
            {/* body here */}

            <ScrollView>
                <View style={{ height: 170, backgroundColor: '#FFFFCC' }}>
                    <Swiper showsButtons={true}
                        autoplay={true}
                        showsPagination={false}
                        style={{ backgroundColor: '#FFFFCC' }}
                    >
                        {
                            dataHead.map(item => {
                                return (
                                    <ListItem key={item.id} bottomDivider
                                        onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                                        <Avatar style={{ width: '100%', height: 190 }} source={{ uri: (item.linkImage) }} />
                                    </ListItem>
                                )
                            })
                        }
                    </Swiper>
                </View>
                {/* Category 1-4*/}
                <View style={{ flex: 1, padding: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 25 }}>
                        <TouchableOpacity style={styles.cateButton} onPress={() => props.navigation.navigate('FirstScreen')}>
                            <View style={styles.iconCategory}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../images/BinhDan.png')}
                                />
                            </View>
                            <Text style={styles.textCate}>Bình dân</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cateButton} onPress={() => props.navigation.navigate('SecondScreen')}>
                            <View style={styles.iconCategory}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../images/MonNuong.png')}
                                />
                            </View>
                            <Text style={styles.textCate}>Món nướng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cateButton} onPress={() => props.navigation.navigate('ThirdScreen')}>
                            <View style={styles.iconCategory}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../images/Haisan.png')}
                                />
                            </View>
                            <Text style={styles.textCate}>Hải sản</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cateButton} onPress={() => props.navigation.navigate('FourScreen')}>
                            <View style={styles.iconCategory}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../images/chao.png')}
                                />
                            </View>
                            <Text style={styles.textCate}>Cháo</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Next 4-8 */}
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.cateButton} onPress={() => props.navigation.navigate('FiveScreen')}>
                            <View style={styles.iconCategory}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../images/Monsao.png')}
                                />
                            </View>
                            <Text style={styles.textCate}>Món sào</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cateButton} onPress={() => props.navigation.navigate('SixScreen')}>
                            <View style={styles.iconCategory}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../images/Lau.png')}
                                />
                            </View>
                            <Text style={styles.textCate}>Lẩu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cateButton} onPress={() => props.navigation.navigate('TenScreen')}>
                            <View style={styles.iconCategory}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../images/TraiCay.png')}
                                />
                            </View>
                            <Text style={styles.textCate}>Trái cây</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cateButton} onPress={() => props.navigation.navigate('NineScreen')}>
                            <View style={styles.iconCategory}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../images/NuocUong.png')}
                                />
                            </View>
                            <Text style={styles.textCate}>Nước uống</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Next 8-12 */}

                </View>
                <Text style={styles.fText}>Gợi ý hôm nay</Text>


                <SafeAreaView >
                    <FlatList showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        // keyExtractor={food => food.id}
                        data={dateFood}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                                        <Avatar rounded source={{ uri: (item.linkImage) }} style={{ width: 130, height: 140, marginLeft: 20, resizeMode: 'stretch' }} />
                                        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginRight: 30, marginTop: 6 }}>{item.name}</Text>
                                        <Text style={{ textAlign: 'center', marginLeft: 10, marginRight: 60, color: 'red' }}>đ{item.price}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}

                    />
                </SafeAreaView>

                <Text style={styles.fText}>Các món ăn nổi bật</Text>
                {/* Product hot */}

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {/* 5 product hot */}
                    <View style={{ flex: 1, }}>
                        <SafeAreaView  >
                            <FlatList
                                // keyExtractor={food => food.id}
                                data={viewFood}
                                renderItem={({ item }) => {

                                    return (

                                        <View style={styles.item}>
                                            <TouchableOpacity onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                                                <Avatar rounded source={{ uri: (item.linkImage) }} style={{ width: 165, height: 180, marginLeft: 0, resizeMode: 'stretch' }} />
                                                <Divider style={{ backgroundColor: 'white' }} />
                                                <Text style={{ textAlign: 'center', fontSize: 17 }}>{item.name}</Text>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Text style={{ color: 'red', fontSize: 12 }}>đ{item.price}</Text>
                                                    <Text style={{ marginLeft: 60, fontSize: 12 }}>Đã bán {item.sold}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    )
                                }}

                            />
                        </SafeAreaView>
                    </View>
                    {/* 5 product hot after */}
                    <View style={{ flex: 1 }}>
                        <SafeAreaView >
                            <FlatList
                                // keyExtractor={food => food.id}
                                data={soldFood}
                                renderItem={({ item }) => {

                                    return (
                                        <View style={styles.item}>
                                            <TouchableOpacity onPress={() => props.navigation.navigate('DetailProduct', { foodId: item.id })}>
                                                <Avatar rounded source={{ uri: (item.linkImage) }} style={{ width: 165, height: 180, marginLeft: 0, resizeMode: 'stretch' }} />
                                                <Divider style={{ backgroundColor: 'white' }} />
                                                <Text style={{ textAlign: 'center', fontSize: 17 }}>{item.name}</Text>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Text style={{ color: 'red', fontSize: 12 }}>đ{item.price}</Text>
                                                    <Text style={{ marginLeft: 60, fontSize: 12 }}>Đã bán {item.sold}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}

                            />
                        </SafeAreaView>
                    </View>
                </View>

            </ScrollView>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFCC'
    },
    tinyLogo: {
        width: 377,
        height: 120,
    },
    cateButton: {
        flex: 1,
        alignItems: 'center'
    },
    iconCategory: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        padding: 10
    },
    textCate: {
        textAlign: 'center',
        fontSize: 12
    },
    fText: {
        color: '#EE0000',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 40,
        marginBottom: 15,
        marginLeft: 8

    },
    item: {
        borderRadius: 20,
        margin: 10,
        backgroundColor: '#FFFF66'
    },
    input: {
        height: 45,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        paddingLeft: 10,
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
    wrapper: {
        width: 40,
        height: 40
    },

});
export default Home;