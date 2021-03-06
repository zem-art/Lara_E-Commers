import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import Login from '../screen/auth/login';
import Register from '../screen/auth/register';
import Forgot from '../screen/auth/forgot';
import Intro from '../screen/Intro';
import MyTabs from './TabBottom';
import Setting from '../components/setting';
import Product from '../components/productScreen';
import Category from '../controller/Category';
import DetailProduct from '../components/DetailProduct';
import AddProduct from '../components/addProduct';
import Market from '../container/marketPlace';
import Profile from '../components/FormulirProfile';
import ProfileDetail from '../components/profileDetail';
import Management from '../components/productmanage';
import EditProduct from '../components/editProduct';
import History from '../components/History';
import chatUser from '../components/chatUser';

const Stack = createStackNavigator();

class Navigation extends Component {
  componentDidMount() {
    //console.log('Home DID MOUNT');
    // get token to Asyncstore
    AsyncStorage.getItem('token').then((token) => {
      // console.log(data);
      // send To redux
      this.props.userLogin(token);
    });
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode={{headerMode: false}}>
          <Stack.Screen name="Home" component={MyTabs} />
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Category" component={Category} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Forgot" component={Forgot} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="Detail" component={DetailProduct} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
          <Stack.Screen name="Market" component={Market} />
          <Stack.Screen name="EditProfile" component={Profile} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
          <Stack.Screen name="Management" component={Management} />
          <Stack.Screen name="EditProduct" component={EditProduct} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="Product" component={Product} />
          <Stack.Screen name="chatUser" component={chatUser} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
//// get token from redux
const mapStateToProps = (state) => {
  return {
    userToken: state,
  };
};
// send token to redux
const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (access_token) =>
      dispatch({type: 'SET_USER', payload: access_token}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
