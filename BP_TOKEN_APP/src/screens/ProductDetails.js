import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  StyleSheet,
  LinearGradient,
  TouchableOpacity,
  Alert,
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Toast from 'react-native-simple-toast';
import Carousel from "react-native-looped-carousel";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import CourselImage from "../Components/CourselImage";
import { btnStyles, bottomTab } from "../styles/base";
import { Row } from "native-base";
const { width } = Dimensions.get("window");
const { height } = 300;
import firebase from "firebase";
import { bindActionCreators } from "redux";
import {
  cartAsync,
  cartSizeAsync,
  storeAsync,
  favStoreAsync,
} from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";

class ProductDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      favourites: [],
      buttonDisable: false
    };
  }

  componentDidMount() {
    if (this.props.route.params.product.favourites === undefined) {
      this.setState({ favourites: [] });
    } else {
      for (
        var i = 0;
        i < this.props.route.params.product.favourites.length;
        i++
      ) {
        if (
          this.props.route.params.product.favourites[i].userId ===
          this.props.user.user._id
        ) {
          this.setState({ heart: true });
        }
      }
      this.setState({ favourites: this.props.route.params.product.favourites });
    }
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  };
  // handleChange (num){
  //   var preNum = this.state.qt
  //   preNum =num + preNum
  //   if(preNum>=1){
  //     this.setState({qt:preNum})
  //   }
  // }
  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }

    var pCart = this.props.cart;
    var that = this;
    pCart.map(function (pro, ind) {
      if (
        pro.product.productName === that.props.route.params.product.productName
      ) {
        pro.quantity = that.state.qt + num;
      }
    });

    this.props.cartAsync(pCart);
  }
  render() {
    var product = this.props.route.params.product;
    var noOfImg = product.noOfImages;
    noOfImg = parseInt(noOfImg);
    var temp = [];
    for (var i = 0; i < noOfImg; i++) {
      temp.push(i);
    }
    var abc = [1, 2, 3];

    var cSize = 0;

    for (var i = 0; i < this.props.cart.length; i++) {
      cSize = cSize + parseInt(this.props.cart[i].quantity);
    }

    this.props.cartSizeAsync(cSize);

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            onLayout={this._onLayoutDidChange}
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Carousel
              delay={6000}
              style={{
                width: Dimensions.get("window").width - 40,
                height: 250,
                marginTop: 20,
                borderRadius: 10,
              }}
              autoplay={true}
              bullets
              bulletStyle={{
                padding: 0,
                margin: 3,
                marginTop: 80,
                borderColor: "#89898C",
              }}
              chosenBulletStyle={{
                padding: 0,
                margin: 3,
                marginTop: 80,
                backgroundColor: "#89898C",
              }}
            >
                <CourselImage id={product._id} />
            </Carousel>
          </View>

       
          <View style={{ paddingHorizontal: 20 }}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={25}
              col="#5C5C5C"
              text={product.productName}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 22,
                  alignItems: "center",display: "flex",
                  justifyContent: "space-evenly"

                }}
              >
                <LatoText
                  fontName="Lato-Bold"
                  fonSiz={20}
                  col="#5C5C5C"
                  text={` pkr  ${parseFloat(
                    product.price - (product.price * product.discount) / 100
                  ).toFixed(2)} / unit `}
                />
                <LatoText
                  style={{marginLeft: 20}}
                  fontName="Lato-Regular"
                  fonSiz={17}
                  lineThrough="line-through"
                  col="#89898C"
                  text={`pkr ${product.price} / unit `}
                />
              </View>
          
            </View>
            <View style={{ marginTop: 22 }}>
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#5C5C5C"
                text={product.productDescription}
              />
            </View>
          </View>
          {/* <Expandable product={product} />s */}
        </ScrollView>
        <View style={bottomTab.cartSheet}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            <TouchableOpacity
              style={btnStyles.plusBtn}
              onPress={() => this.handleChange(-1)}
            >
              <FontAwesome color="#000" size={18} name="minus" />
            </TouchableOpacity>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="#5C5C5C"
              text={this.state.qt}
            />
            <TouchableOpacity
              style={btnStyles.plusBtn}
              onPress={() => this.handleChange(1)}
            >
              <FontAwesome color="#000" size={18} name="plus" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
          disabled={this.state.buttonDisable}
            onPress={() => {

              if (this.props.cart.length === 0) {
                var pCart = this.props.cart;
                pCart.push({
                  product: product,
                  quantity: this.state.qt,
                });
                this.props.storeAsync({
                  name: this.props.storeHeader.name,
                  address: this.props.storeHeader.address,
                  id: this.props.storeHeader.id,
                  phone: this.props.storeHeader.phone,
                  sId: this.props.storeHeader.storeId,
                  oId: this.props.storeHeader.oId,

                });
                this.props.favStoreAsync(product.storeId);
                this.props.cartAsync(pCart);
                this.setState({ cart: true, buttonDisable: true });
              } else {
                if (this.props.store.id === product.storeId) {
                  var pCart = this.props.cart;
                  pCart.push({
                    product: product,
                    quantity: this.state.qt,
                  });
                  this.props.storeAsync({
                    name: this.props.storeHeader.name,
                    address: this.props.storeHeader.address,
                    id: this.props.storeHeader.id,
                    phone: this.props.storeHeader.phone,
                    sId: this.props.storeHeader.storeId,
                    oId: this.props.storeHeader.oId,

                  });
                  this.props.favStoreAsync(product.storeId);
                  this.props.cartAsync(pCart);
                  this.setState({ cart: true, buttonDisable: true }, () => {
                    Toast.show('Product added to cart');
                  });
                } else {
                  this.setState({ temp: product.storeId }, () => {
                    Alert.alert(
                      "Alert!",
                      "If you add a product from a new store, you will lose your cart from the previous store",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => {
                            var pCart = [];
                            pCart.push({
                              product: product,
                              quantity: this.state.qt,
                            });
                            this.props.storeAsync({
                              name: this.props.storeHeader.name,
                              address: this.props.storeHeader.address,
                              id: this.props.storeHeader.id,
                              phone: this.props.storeHeader.phone,
                              sId: this.props.storeHeader.storeId,
                              oId: this.props.storeHeader.oId,

                            });
                            this.props.favStoreAsync(product.storeId);
                            this.props.cartAsync(pCart);
                            this.setState({ cart: true, buttonDisable: true });
                          },
                        },
                      ],
                      { cancelable: true }
                    );
                  });
                }
              }
            }}
            style={[this.state.buttonDisable ? btnStyles.cartBtn1 : btnStyles.cartBtn, { width: "40%" }]}
            
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={15}
              col="white"
              text="Add To Cart"
            ></LatoText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imgCon: {
    width: Dimensions.get("window").width,
    height: 250,
  },
  topRight: {
    alignSelf: "flex-end",
  },
  wrapTop: {
    alignSelf: "flex-end",

    marginTop: 30,
    backgroundColor: "#7cba80",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  bottomText: {
    height: 200,
    flexDirection: "row",
  },
  buybBtn: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

const mapStateToProps = (state) => ({
  cart: state.Cart.cartData,
  loading: state.Cart.cartLoading,
  error: state.Cart.cartError,
  user: state.user.user,
  store: state.Store.storeData,
  cartSize: state.CartSize.cartSizeData,
  storeHeader: state.storeHeader.storeData1,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
      cartSizeAsync,
      favStoreAsync,
      storeAsync,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
