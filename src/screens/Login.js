import React, { useState } from "react";
import { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Input, Button } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firebase from '../database/firebase';
import { FancyAlert } from 'react-native-expo-fancy-alerts';

let getId = '';

const Login = (props) => {
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
  //user
  const [user, setUser] = useState([])
  useEffect(() => {
    let isMounted = true;
    firebase.db.collection('users').onSnapshot(querySnapshot => {
      const user = [];
      querySnapshot.docs.forEach(doc => {
        const { email, password, role, userLike, userCart } = doc.data();
        user.push({
          id: doc.id,
          email,
          password,
          role,
          userLike,
          userCart
        })

      });
      setUser(user);
      return () => { isMounted = false };
    })
  }, [])
  //Check login
  const checkLogin = async () => {
    if (state.email === '' || state.password === '') {
      setTitle('Bạn không được để trống!');
      setnIcon('✖');
      setColor('red');
      toggleAlert();
    }
    else {
      var x = -1;
      user.forEach((item) => {
        if (state.email == item.email && state.password == item.password) {
          getId = item.id;

          //IF role = 1  then to admin
          if (item.role === 1) {
            props.navigation.replace('HomeAdmin', {
              screen: 'HomeAdmin',
              params: { userId: item.id }
            } ,
            );
            x = 0;

          }
          else {
            props.navigation.replace('Home', {
              screen: 'Home',
              params: { userId: item.id }
            } ,
            );
            x = 1;
          }

        }
      })
      // Alert for success
      if (x == 0) {
        setTitle('Bạn đã đăng nhập với tư cách quản trị viên');
        setnIcon('✔');
        setColor('green');
        toggleAlert();
      }
      else if (x == -1) {
        setTitle('Tài khoản hoặc mật khẩu của bạn không chính xác!');
        setnIcon('✖');
        setColor('red');
        toggleAlert();
      }

    }
  }
  const [state, setState] = useState({
    email: '',
    password: '',
  })
  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value })
  }
  const _onChagePageRegister = () => {
    props.navigation.navigate('Register');
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../images/main.jpg')} style={styles.image}>

        <View style={styles.body}>
          <Image style={styles.imageIcon} source={require('../images/ham.png')} />
        </View>
        <View style={styles.body2}>
          <Input style={styles.textIn} autoCorrect={false} placeholder='   Nhập email'  placeholderTextColor="black"  leftIcon={<FontAwesome name='envelope' size={24} color='red' errorStyle={{ color: 'red' }} />} onChangeText={(value) => handleChangeText('email', value)} />
          <Input style={styles.textIn} autoCorrect={false} secureTextEntry={true} placeholder='   Nhập mật khẩu' placeholderTextColor="black" leftIcon={<FontAwesome name='lock' size={30} color='red' errorStyle={{ color: 'red' }} />} onChangeText={(value) => handleChangeText('password', value)} />
        </View>

        {/* Handle Button */}
        <View style={styles.sButton}>
          <Button color='white' title='Đăng Nhập' onPress={() => checkLogin()} />
        </View>
        {/* Handle button register */}
        <View style={styles.bRegis}>
          <Text style={styles.sT1}>Nếu bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => _onChagePageRegister()}><Text style={styles.sT2}>Nhấn vào đây</Text></TouchableOpacity>
        </View>
      </ImageBackground>
      {/* show dialog */}
      <FancyAlert
        visible={visible}
        icon={<View style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: (color),
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
};
export const getUserId = () => {
  return getId;
}

const styles = StyleSheet.create({
  sT1: {
    color: 'white',
    fontSize: 17
  },
  sT2: {
    color: 'green',
    fontSize: 17,
    fontWeight: 'bold'
  },
  bRegis: {
    flexDirection: 'row',
    flex: 1,
    alignItems:'flex-end',
    textAlign: 'center',    
  },
  sButton: {
    backgroundColor: 'green',
    marginTop: 30,
    fontSize: 20,
  },
  container: {
    flex: 1,
    flexDirection: "column",

  },
  body: {
    alignItems: 'center',
    flex: 0.7,
  },
  body2: {
    marginTop: 50,
    flex: 1
  },
  image: {
    flex: 1,
    resizeMode: "cover",

    padding: 30,

  },
  imageIcon: {
    width: 280,
    height: 150,
    marginTop: 20
  },
  textIn: {
    //borderColor: 'orange',
    //borderWidth: 3,
    height: 40,
    color: 'white',
    fontSize: 20,
    marginTop: 15,
    //borderRadius: 15,
    
  }
});

export default Login;