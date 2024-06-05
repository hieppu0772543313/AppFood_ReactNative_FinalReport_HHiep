import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, Button, LogBox } from 'react-native';
import firebase from '../../database/firebase';
import { Input, Avatar, Card } from 'react-native-elements';
import Loading from '../Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';

const ManageFoods = (props) => {
    const initialState = {
        id: '',
        name: '',
        linkImage: '',
        price: '',
        amount: '',
        description: ''

    }
    const [food, setFood] = useState();
    const [loading, setLoading] = useState(true)

    //Event dropdown picker
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Bình dân', value: 'Bình dân' },
        { label: 'Món nướng', value: 'Món nướng' },
        { label: 'Hải sản', value: 'Hải sản' },   
        { label: 'Cháo', value: 'Cháo' },
        { label: 'Món sào', value: 'Món sào' },
        { label: 'Lẩu', value: 'Lẩu' },
        { label: 'Món hầm', value: 'Món hầm' },
        { label: 'Mì', value: 'Mì' },
        { label: 'Thức uống', value: 'Thức uống' },
        { label: 'Trái cây', value: 'Trái cây' },
        { label: 'Bánh tráng', value: 'Bánh tráng' },
        { label: 'Khác', value: 'Khác' },
    ]);
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
    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        getFoodById(props.route.params.foodId);
       
    }, [])
    const handleChangeText = (name, value) => {
        setFood({ ...food, [name]: value })
    }
    const deleteFood = async () => {
        const dbRef = firebase.db.collection('foods').doc(props.route.params.foodId);
        await dbRef.delete();
        props.navigation.navigate('FoodAdmin');
    }
    const openConfirmationAlert = () => {
        Alert.alert('Xóa món ăn', 'Bạn chắc chắn chứ? ', [
            { text: 'Có', onPress: () => deleteFood() },
            { text: 'Không', onPress: () => console.log(false) },
        ])
    }
    const updateFood = async () => {
        var dataType = '';
        if(value!=null){
            dataType = value; 
        }
        else{
            dataType = food.type;
        }
        const dbRef = firebase.db.collection('foods').doc(props.route.params.foodId);
        await dbRef.set({
            name: food.name,
            linkImage: food.linkImage,
            price: food.price,
            sold: food.sold,
            description: food.description,
            view: food.view,
            amount: food.amount,
            type: dataType,
            createdAt: food.createdAt
        })
        setFood(initialState);
        props.navigation.navigate('FoodAdmin');
    }

    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <KeyboardAwareScrollView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Title */}
                <View style={styles.header}>
                    <Avatar rounded style={styles.sImage} source={{ uri: (food.linkImage) }} />
                </View>
                {/* body */}
                <View style={styles.body}>
                    <Card>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Ngày tạo: {food.createdAt}</Text>
                            <Text>Đã bán: {food.sold}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Loại: {food.type}</Text>
                            <Text>Lượt xem: {food.view}</Text>
                        </View>
                    </Card>
                    <View style={{ marginTop: 20 }}>
                        <Input label="Tên món ăn" placeholder='Tên món ăn' value={food.name} autoCorrect={false} leftIcon={{ type: 'material', name: 'forum', }} onChangeText={(value) => handleChangeText('name', value)} />
                        <Input label="Hình ảnh món ăn" placeholder='Đường dẫn' value={food.linkImage} autoCorrect={false} leftIcon={{ type: 'material', name: 'polymer', }} onChangeText={(value) => handleChangeText('linkImage', value)} />
                        <Input keyboardType='number-pad' label="Giá món ăn" placeholder='0' value={food.price} autoCorrect={false} leftIcon={{ type: 'material', name: 'euro', }} onChangeText={(value) => handleChangeText('price', value)} />
                        <Input keyboardType='number-pad' label="Số lượng" placeholder='0' value={food.amount} autoCorrect={false} leftIcon={{ type: 'material', name: 'dock', }} onChangeText={(value) => handleChangeText('amount', value)} />
                        <Input multiline numberOfLines={8} label="Mô tả" style={{height:120}} maxLength={500} value={food.description} autoCorrect={false} placeholder='Mô tả' leftIcon={{ type: 'material', name: 'description', }} onChangeText={(value) => handleChangeText('description', value)} />
                    </View>
                </View>
                {/* footer */}
                <View style={styles.footer}>
                    <DropDownPicker style={{ width: 350, height: 40, marginLeft:10,  }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder='Danh mục'
                    />
                </View>

            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 70 }}>
                <View style={styles.vUpdate}>
                    <Button color='green' title='Cập Nhật' onPress={() => updateFood()} />
                </View>
                <View style={styles.vDetele}>
                    <Button color='red'  title='Xóa Món' onPress={() => openConfirmationAlert()} />
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        flex: 3,
        alignItems: 'center'
    },
    body: {
        flex: 5,
        marginTop: 30
    },
    footer: {
        flex: 0.2,
        marginBottom: 20
    },
    sImage: {
        resizeMode: 'stretch',
        width: 230,
        height: 140
    },
    vUpdate: {
        backgroundColor: '#FFFFCC',
        borderRadius: 20,
        width:120,
        //borderWidth: 1
    },
    vDetele: {
        backgroundColor: '#FFFFCC',
        borderRadius: 20,
        //borderWidth: 1
        width:120,
    }
})
export default ManageFoods;


