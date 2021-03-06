import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {styles} from '../styles/stylesTroli';
import axios from 'axios';
import {connect} from 'react-redux';
import Spinner from 'react-native-spinkit';

export class Troli extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isloading: true,
      isEror: false,
      refreash: false,
    };
  }

  componentDidMount() {
    this.getDetail();
  }

  onRefreash() {
    this.setState({
      refreash: true,
    });
    this.getDetail();
  }

  getDetail = async () => {
    try {
      const response = await axios({
        // call deatail product using data passing
        url: 'https://larashop12.herokuapp.com/api/checkout',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.props.userToken.userReducer.user}`,
        },
      });
      // tidak ada then disini kalo mau di kasih then di sini
      const data = response.data;
      // console.log('ini dari troli', data.pesanan_detail);
      this.setState({
        isEror: false,
        isloading: false,
        data: data.pesanan_detail,
        refreash: false,
      });
    } catch (err) {
      this.setState({
        isloading: false,
        isEror: true,
        refreash: false,
        // tidak ada data nya di array
        data: [],
      });
      console.log(err);
      // if respon from backend
      if (err.response) {
        console.log(
          'Maaf Tidak Ada Barang Pesanan anda',
          err.response.data.message,
        );
      } else if (err.request) {
        ToastAndroid.show('kamu sedang offline nih', ToastAndroid.LONG);
      } else {
        ToastAndroid.show(
          'Tidak Ada Barang Yang Ingin Di Pesanan ',
          ToastAndroid.LONG,
        );
      }
    }
  };

  Pay() {
    try {
      axios({
        url: 'https://larashop12.herokuapp.com/api/checkout/konfirmasi',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.props.userToken.userReducer.user}`,
        },
      }).then((resulty) => {
        console.log('Hasil checkOUt', resulty);
        this.getDetail();
      });
    } catch (err) {
      console.log(err);
      if (err.response) {
        console.log(
          'Pesanan berhasil di bayar dan sedang dalam proses pengiriman',
          err.response.data.message,
        );
      } else if (err.request) {
        ToastAndroid.show('kamu sedang offline nih', ToastAndroid.LONG);
      } else {
        ToastAndroid.show(
          'Tidak Ada Barang Yang Ingin Di Pesanan ',
          ToastAndroid.LONG,
        );
      }
    }
  }

  render() {
    if (this.state.isloading) {
      return (
        <View style={styles.loading}>
          <Spinner color={'blue'} size={50} type="ThreeBounce" />
          <Text>Sedang Memuat data</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleCart}>My Troli</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('History')}
            style={styles.exMenu}>
            <Image
              style={styles.iconMenu}
              source={require('../asset/icon/manuBalok1.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.pactItem}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreash}
                onRefresh={() => this.onRefreash()}
              />
            }>
            {this.state.data.length !== 0 ? (
              <>
                {this.state.data.map((item, index) => (
                  <View style={styles.item} key={index}>
                    <Text style={styles.titleStore}>{item.product.name}</Text>
                    <View style={styles.Row}>
                      <View style={styles.inItem}>
                        <Image
                          style={styles.image}
                          source={{uri: item.product.image}}
                        />
                      </View>
                      <Text style={styles.textItems}>Keterangan</Text>

                      <View style={styles.buttom}>
                        <Text>Order : {item.jumlah}</Text>
                        <Text>{item.product.discount} %</Text>
                        <Text>$ {item.jumlah_harga}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.textcheckOut}>Tidak ada pesanan</Text>
            )}
          </ScrollView>
          <TouchableOpacity
            onPress={() => this.Pay()}
            // onPress={() => this.setState({data: []})}
            style={styles.chekOut}>
            <Text style={styles.textChekOut}>Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userToken: state,
  };
};

export default connect(mapStateToProps)(Troli);
