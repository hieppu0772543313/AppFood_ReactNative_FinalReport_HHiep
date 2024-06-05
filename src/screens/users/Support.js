
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import DropDownItem from 'react-native-drop-down-item';
import { LogBox } from 'react-native';

const IC_ARR_DOWN = require('../../images/drop.png');
const IC_ARR_UP = require('../../images/drop.png');


const Support = (props) => {
  LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

 const state = {
    contents: [
      {
        title: 'Không thể đăng nhập ?',
        body: 'Có thể đã nhập thông tin tài khoản hoặc mật khẩu không chính xác. Bạn vui lòng kiểm tra lại thông tin, nếu vẫn không thành công bạn có thể chọn quên mật khẩu để có thể đăng nhập',
      },
      {
        title: 'Quên mật khẩu ?',
        body: 'Nếu bạn quên mật khẩu bạn có thể chọn quên mật khẩu, xác thực thông qua email để có mật khẩu mới',
      },
      {
        title: 'Bạn không thể thấy giỏ hàng ?',
        body: 'Nếu bạn không thể thấy giỏ hàng của mình, thì bạn vui lòng liên hệ với nhân viên để khắc sự cố này',
      },
      {
        title: 'Thay đổi mật khẩu ?',
        body: 'Nếu bạn muốn thay đổi mật khẩu thì bạn phải vào chỗ thông tin cá nhân, xác nhận mật khẩu cũ và bạn đã có thể thay đổi mật khẩu',
      },
      {
        title: 'Phần mềm có sự cố ?',
        body: 'Nếu phần mềm có sự cố hay lỗi gì thì hãy liên hệ với nhân viên của chúng tôi, chúng tôi sẽ khắc phục cho bạn',
      },
      {
        title: 'Món ăn vẫn chưa được gửi đi ?',
        body: 'Trong vòng 2 tiếng kể từ lúc bạn đặt giỏ hàng nếu bạn thấy món ăn của mình vẫn chưa đến nơi thì bạn hãy liên hệ với nhân viên cúng tôi, chúng tôi sẽ hỗ trợ cho bạn',
      },
      {
        title: 'Không thể liên hệ với nhân viên ?',
        body: 'Trong trường hợp bạn không thể liên hệ với nhân viên thì bạn có thể gọi qua só 056 8442 815, chúng tôi sẽ khắc phục vấn đề cho bạn',
      },
      {
        title: 'Hoàn tiền ?',
        body: 'Về việc hoàn tiền sau khi bạn đã mua thì trong vòng 20 phút bạn đặt mua, bạn có thể hủy đơn món ăn và có thể hoàn được 100% số tiền.',
      },
      {
        title: 'Các món ăn chưa đảm bảo ?',
        body: 'Về việc khiếu nại món ăn nếu có vấn để gì thì bạn có thể liên hệ với nhân viên chúng tôi, chúng tôi sẽ cố gắng cải thiện món ăn ngày càng tốt hơn. Cám ơn vì sự quan tâm của bạn',
      },
    ],
  };


  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 14 }}>
        <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>Bạn gặp vấn đề gì?</Text>
      </View>
      <ScrollView style={{ alignSelf: 'stretch' }} >
        {
          state.contents
            ? state.contents.map((param, i) => {
              return (
                <DropDownItem
                  key={i}
                  contentVisible={false}
                  invisibleImage={IC_ARR_DOWN}
                  visibleImage={IC_ARR_UP}
                  header={
                    <View style={styles.header}>
                      <Text style={{
                        fontSize: 20,
                        color: 'blue',
                      }}>{param.title}</Text>
                    </View>
                  }
                >
                  <Text style={[
                    styles.txt,
                    {
                      fontSize: 20,
                    },
                  ]}>
                    {param.body}
                  </Text>
                </DropDownItem>
              );
            })
            : null
        }
        <View style={{ height: 96 }} />
      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',


  },
  header: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTxt: {
    fontSize: 12,
    color: 'rgb(74,74,74)',
    marginRight: 60,
    flexWrap: 'wrap',
  },
  txt: {
    fontSize: 14,
  },

});
export default Support;
