

import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Dimensions,

} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get('window');
import FirstScreen from '../components/FirstScreen';
import SecondScreen from '../components/SecondScreen';
import ThirdScreen from '../components/ThirdScreen';
import FourScreen from '../components/FourSceen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FiveScreen from '../components/FiveScreen';
import SixScreen from '../components/SixCreen';
import SevenScreen from '../components/SevenScreen';
import EightScreen from '../components/EightScreen';
import NineScreen from '../components/NineScreen';
import TenScreen from '../components/TenScreen';
import ElevenScreen from '../components/ElevenScreen';
import TwiceScreen from '../components/TwiceScreen';
const List = (props) => {
    const TabView = createMaterialTopTabNavigator();
    const [query, setQuery] = useState();
    const _search = () =>{
        props.navigation.navigate('FindByFood', { nameFood: query });
    }
    return (

        <View style={styles.container}>
            <View style={styles.header}>

                <TextInput
                    placeholder="Tên món ăn..."
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
            <TabView.Navigator tabBarOptions={{
                activeTintColor: '#e91e63',
                labelStyle: { fontSize: 13, fontWeight: 'bold' },
                scrollEnabled: true,
                style: { backgroundColor: '#FFFFFF' },
            }}>
                <TabView.Screen name="FirstScreen" component={FirstScreen}   options={{ tabBarLabel: 'Bình dân' }}/>
                <TabView.Screen name="SecondScreen" component={SecondScreen}  options={{ tabBarLabel: 'Món nướng' }}/>
                <TabView.Screen name="ThirdScreen" component={ThirdScreen}  options={{ tabBarLabel: 'Hải sản' }}/>
                <TabView.Screen name="FourScreen" component={FourScreen}  options={{ tabBarLabel: 'Cháo' }}/>
                <TabView.Screen name="FiveScreen" component={FiveScreen}   options={{ tabBarLabel: 'Món sào' }}/>
                <TabView.Screen name="SixScreen" component={SixScreen}  options={{ tabBarLabel: 'Lẩu' }}/>
                <TabView.Screen name="SevenScreen" component={SevenScreen}  options={{ tabBarLabel: 'Món hầm' }}/>
                <TabView.Screen name="EightScreen" component={EightScreen}  options={{ tabBarLabel: 'Mì' }}/>
                <TabView.Screen name="NineScreen" component={NineScreen}   options={{ tabBarLabel: 'Thức uống' }}/>
                <TabView.Screen name="TenScreen" component={TenScreen}  options={{ tabBarLabel: 'Trái cây' }}/>
                <TabView.Screen name="ElevenScreen" component={ElevenScreen}  options={{ tabBarLabel: 'Bánh tráng' }}/>
                <TabView.Screen name="TwiceScreen" component={TwiceScreen}  options={{ tabBarLabel: 'Khác' }}/>
            </TabView.Navigator>


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
const styleWipe = {
    pillButton: {
        backgroundColor: 'white',
    },
    pillActive: {
        backgroundColor: 'red',
    },
    pillLabel: {
        color: 'gray',
    },
    activeLabel: {
        color: 'red',
    },
};

export default List;
