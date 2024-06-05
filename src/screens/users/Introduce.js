import * as React from 'react';
import { View, Text, Button, StyleSheet, Image, Linking, Alert } from 'react-native';
import { Card, SocialIcon } from 'react-native-elements';
const Introduce = ({ navigation }) => {
    const _getCheckLinkUrl = () =>{
        Linking.openURL('https://www.facebook.com/hocgioi887')
    }
    const openConfirmationAlert = () => {
        Alert.alert('Bạn có muốn rời đi đến trang web không?', '（￣︶￣）↗　', [
            { text: 'Yes', onPress: () => _getCheckLinkUrl() },
            { text: 'No', onPress: () =>  console.log('bạn đã hủy bỏ')},
        ])
       
    }
    return (
        <View style={{ flex: 1 }}>
            {/* Hearder */}
            <View style={styles.header}>
                <Image style={styles.newImage} source={require('../../images/intro.gif')} />
            </View>
            {/* Body */}
            <Card style={styles.body}>
                {/* Tên phần mêm */}
                <Text style={styles.sText}>Phần mềm đặt hàng online</Text>
                {/* Phiên bản */}
                <Text style={styles.sText}>Phiên bản: 1.0</Text>
                {/* Tên thành viên */}
                <Text style={styles.sText}>Bắt đầu dự án 01/05/2024</Text>
            </Card>
            {/* Footer */}
            <View style={styles.footer}>
                <SocialIcon
                     onPress={() => openConfirmationAlert()}
                     title='Tác giả'
                    button
                    type='facebook'
                />
            </View>
        </View>

    )
}
export default Introduce;
const styles = StyleSheet.create({
    header: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 120
    },
    body: {
        flex: 5,
        marginTop: 90
    },
    footer: {
        flex: 3,
        padding: 30
    },
    newImage: {
        resizeMode: 'stretch',
        width: 240,
        height: 170
    },
    sText: {
        marginVertical: 20,
        fontSize: 19,
        fontWeight: 'bold'
    }
})