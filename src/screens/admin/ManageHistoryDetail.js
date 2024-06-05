import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import firebase from '../../database/firebase';
import { Avatar, Button, Divider } from 'react-native-elements';
import Loading from '../Loading';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native';
import { FancyAlert } from 'react-native-expo-fancy-alerts';

const ManageHistoryDetail = (props) => {
    //dialog
    const [visible, setVisible] = React.useState(false);
    const toggleAlert = React.useCallback(() => {
        setVisible(!visible);
    }, [visible]);
    const _closeApp = () => {
        setVisible(!visible);
    }
    const [colorAlert, setColorAlert] = useState()
    const [nIcon, setnIcon] = useState();
    const [title, setTitle] = useState();
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
    //Food Cart
    const [invoice, setInvoice] = useState([]);
    const [food, setFood] = useState([]);
    const [invoiceItem, setInvoiceItem] = useState([]);
    const [getItem, setItem] = useState([]);
    //User
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    //Get user throw id
    const getUserById = async (id) => {
        
        const dbRef = firebase.db.collection('users').doc(id);
        const doc = await dbRef.get();
        const user = doc.data();

        setUser({
            ...user,
            id: doc.id
        })
        var getItem = [];
        for (let x = 0; x < food.length; x++) {
            for (let y = 0; y < invoiceItem.length; y++) {
                if (food[x].id === invoiceItem[y].idFood) {
                    getItem.push(food[x]);
                }
            }
        }
        setItem(getItem);
        setLoading(false);
    }
    //Update status invoice of user
    const _updateStatus = async () => {

        const dbRef = firebase.db.collection('invoice').doc(invoice.id);
        await dbRef.set({
            createdAt: invoice.createdAt,
            idUser: props.route.params.userId,
            key: invoice.key,
            status: value,
            total: invoice.total,
        })
        setTitle('Bạn đã cập nhật trạng thái thành công');
        setnIcon('✔');
        setColorAlert('green');
        toggleAlert();
    }
    const convertFilter = (obj, key, value) => {
        return obj.find(function (v) { return v[key] === value });
    }
    useEffect(() => {
        //Load food data
        firebase.db.collection('foods')
            .onSnapshot(querySnapshot => {
                const food = [];
                querySnapshot.docs.forEach(doc => {
                    const { name, linkImage, price, } = doc.data();
                    food.push({
                        id: doc.id,
                        name,
                        linkImage,
                        price,
                    })
                });
                setFood(food);
                var getItem = [];
                for (let x = 0; x < food.length; x++) {
                    for (let y = 0; y < invoiceItem.length; y++) {
                        if (food[x].id === invoiceItem[y].idFood) {
                            getItem.push(food[x]);
                        }
                    }
                }
                setItem(getItem);
            })
        //Load data ItemInvoice
        firebase.db.collection('invoiceItem')
            .where('key', '==', props.route.params.key)
            .onSnapshot(querySnapshot => {
                const invoiceItem = [];
                querySnapshot.docs.forEach(doc => {

                    const { idFood } = doc.data();
                    invoiceItem.push({
                        id: doc.id,
                        idFood
                    })
                });
                setInvoiceItem(invoiceItem);
            })

        //Load data invoice
        firebase.db.collection('invoice')
            .where('key', '==', props.route.params.key)
            .onSnapshot(querySnapshot => {
                const invoice = [];
                querySnapshot.docs.forEach(doc => {
                    const { createdAt, status, total, key } = doc.data();
                    invoice.push({
                        id: doc.id,
                        createdAt,
                        status,
                        total,
                        key
                    })
                });

                var data = convertFilter(invoice);

                setInvoice(data);
                console.log(data);
            })
        getUserById(props.route.params.userId);
    }, [])
    const _onRefresh = useCallback(() => {
       
        var getItem = [];
        for (let x = 0; x < food.length; x++) {
            for (let y = 0; y < invoiceItem.length; y++) {
                if (food[x].id === invoiceItem[y].idFood) {
                    getItem.push(food[x]);
                }
            }
        }
        setItem(getItem);
    });
    setTimeout(() => _onRefresh(), 100)
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.top}>
                <TouchableOpacity onPress={() => _onRefresh()}>
                    <Avatar rounded source={{ uri: (user.imageUser) }} size="large" />
                </TouchableOpacity>

                <Text style={styles.email}>Email: {user.email}</Text>
            </View>
            {/* Head Information user */}
            <View style={styles.body}>
                <Text style={styles.phone}>SDT: {user.phone}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.phone}>Địa chỉ: {user.address}</Text>
                        <Text style={styles.phone}>Tổng hoá đơn: <Text style={styles.price}>đ{invoice.total}</Text></Text>
                        <Text style={styles.phone}>Thời gian: {invoice.createdAt}</Text>
                    </View>
                    <View>
                        <DropDownPicker style={{ width: 130 }}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder='Trạng thái'
                        />
                        <View style={{marginTop:10,}}><Button title="Cập Nhật" style={{borderRadius:10,}} onPress={() => _updateStatus()} /></View>
                    </View>
                </View>
                <Text style={styles.phone}>Trạng thái: <Text style={styles.status}>{invoice.status}</Text></Text>
            </View>
            {/* Bottom */}
            <View style={styles.bottom}>
                <FlatList
                    refreshing={refreshing}
                    onRefresh={() => _onRefresh()}
                    data={getItem}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.flatList}>
                                <Avatar style={styles.avatar} rounded source={{ uri: (item.linkImage) }} />
                                <View style={{ justifyContent: 'space-around', marginLeft: 20 }}>
                                    <Text numberOfLines={1} style={styles.name} >
                                        {item.name}
                                    </Text>

                                    <View >
                                        <Text style={styles.price} >đ{item.price}</Text>
                                    </View>

                                </View>
                                <Divider />
                            </View>

                        );
                    }}
                />
            </View>
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
        padding: 20
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1.2,
        zIndex: 2,
    },
    email: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    body: {
        flex: 3,
        zIndex: 3,
    },
    phone: {
        fontSize: 16,
        marginTop: 18
    },
    status: {
        fontSize: 16,
        marginTop: 18,
        color: 'red'
    },
    price: {
        color: 'red',
        fontSize: 17
    },
    bottom: {
        flex: 4,
        zIndex: 1
    },
    flatList: {
        flexDirection: 'row',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 20
    },
    avatar: {
        width: 90,
        height: 90
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold'
    }



})
export default ManageHistoryDetail;


