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
  Keyboard,
  Button,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChangeText as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import CodeInput from "react-native-confirmation-code-input";
import Carousel from "react-native-looped-carousel";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  btnStyles,
  bottomTab,
  lines,
  conStyles,
  textStyles,
  textIn,
} from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
const { width } = Dimensions.get("window");
const { height } = 300;
import { bindActionCreators } from "redux";
import {
  cartAsync,
  userAsync,
  cartSizeAsync,
  favStoreAsync,
  storeHeaderAsync,
  storeAsync,
} from "../store/actions";
import { connect } from "react-redux";
import axios from "axios";
import timestamp from "time-stamp";
import Modal from "react-native-modalbox";
import DatePicker from 'react-native-datepicker'
import TimePicker from 'react-native-simple-time-picker';

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      isOpen: false,
      date: 0,
      times: 0,
      isChecked: false,
      orderDate: new Date(),
      orderTime: "12:00",
      postDate: "",
      postTime: "",
      storeTimings: {},
      start: "",
      end: "",
      startUnit: "",
      endUnit: "",
      timeArray: [],
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      num: "",
      tax: "",
      hours: 0,
      minutes: 0,
      numVerified: false,
      codeMsg: false,
      on: "",
      isDisabled: false,
      selectdDay: "",
      isStoreClosed: false,
      sId: "",
      oId: "",
      isOut: false,
      clickCheck: true,
      keyState: false,
      show: false
    };
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentDidMount() {
    console.log("ORDERRRRRRRRRRRRRRR numer", this.props.user.user);
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    this.setState({
      name: this.props.user.user.name ? this.props.user.user.name : "",
      email: this.props.user.user.email ? this.props.user.user.email: "",
      mobile: this.props.user.user.mobile ? this.props.user.user.mobile.substring(2,this.props.user.user.mobile.length) : "",
      previousMobileNumber: this.props.user.user.mobile ? this.props.user.user.mobile.substring(2,this.props.user.user.mobile.length): ""
    });
    axios
      .get(
        "https://damp-beyond-36191.herokuapp.com/get/store/" + this.props.store.id
      )
      .then((resp) => {
        this.setState({
          sId: resp.data.storeId,
          oId: resp.data.orderNum,
        });
      });

    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var d = new Date();
    var n = d.getDay();
    this.getTimings(days[n]);

    if (!this.props.user.user.isGuest) {
      this.setState({ numVerified: true });
    }else{
      if(this.props.user.user.isGuestVerified){
        this.setState({ numVerified: true });
      }
    }
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({
      keyState: true,
    });
  }

  _keyboardDidHide() {
    this.setState({
      keyState: false,
    });
  }
  getTimings(day) {
    axios
      .get(
        "https://damp-beyond-36191.herokuapp.com/get/store/" + this.props.store.id
      )
      .then((resp) => {
        //
        var ishalf = false;
        for (var i = 0; i < resp.data.storeTimings.length; i++) {
          //

          if (resp.data.storeTimings[i].day.substring(0, 3) === day) {
            //
            var temp = {};
            if (resp.data.storeTimings[i].isClosed === true) {
              temp = {};
            } else {
              if (resp.data.storeTimings[i].openTime.includes("30")) {
                ishalf = true;
              }
              var su = "";
              var eu = "";
              if (resp.data.storeTimings[i].openTime.includes("PM")) {
                su = "PM";
              } else {
                su = "AM";
              }
              if (resp.data.storeTimings[i].ClosingTime.includes("PM")) {
                eu = "PM";
              } else {
                eu = "AM";
              }
              //
              var st = resp.data.storeTimings[i].openTime.substring(0, 2);
              var et = resp.data.storeTimings[i].ClosingTime.substring(0, 2);
              if (ishalf) {
                st = parseInt(st) + 1;
              }
              var arr = [];
              var unit = su;
              for (var j = 0; j < 24; j++) {
                if (parseInt(st) === parseInt(et) && unit === eu) {
                  break;
                }
                var temp1 = st + ":00 " + unit + " - ";
                st = parseInt(parseInt(st) + 1);

                if (parseInt(st) > 11) {
                  if (unit === "PM") {
                    unit = "AM";
                  } else {
                    unit = "PM";
                  }
                }
                if (parseInt(st) > 12) {
                  st = 1;
                }
                // if(parseInt(st) === parseInt(et) && unit === eu) {
                //   break
                // }
                var temp2 = parseInt(st) + ":00 " + unit;
                // st=parseInt(parseInt(st)+1)

                if (parseInt(st) > 11) {
                  if (unit === "PM") {
                    unit = "AM";
                  } else {
                    unit = "PM";
                  }
                }
                if (parseInt(st) > 12) {
                  st = 1;
                }
                var temp = temp1 + temp2;
                arr.push(temp);

                if (parseInt(st) === parseInt(et) && unit === eu) {
                  break;
                }
              }
              temp = resp.data.storeTimings[i];
            }

            if (resp.data.storeTimings[i].isClosed) {
              this.setState({
                storeTimings: "",
                start: "",
                end: "",
                startUnit: "",
                endUnit: "",
                timeArray: ["Store Closed"],
                orderTime: "",
                tax: resp.data.tax,
                isStoreClosed: true,
              });
            } else {
              this.setState({
                storeTimings: resp.data.storeTimings[i],
                start: resp.data.storeTimings[i].openTime.substring(0, 2),
                end: resp.data.storeTimings[i].ClosingTime.substring(0, 2),
                startUnit: su,
                endUnit: eu,
                timeArray: arr,
                orderTime: arr[0],
                tax: resp.data.tax,
                isStoreClosed: false,
              });
            }
          }
        }
        //
      })
      .catch((err) => console.log(err));
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  };
  handleChange(num) {
    var preNum = this.state.qt;
    preNum = num + preNum;
    if (preNum >= 1) {
      this.setState({ qt: preNum });
    }
  }
  onClose() {}

  onOpen() {}

  getDayName(dateStr) {
    //
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var tes = dateStr.replace("-", "/");
    var tes = tes.replace("-", "/");
    var dt = tes.split("/");
    var rt = dt[1] + "/" + dt[0] + "/" + dt[2];
    //
    // // var tes = "05/23/2014";
    //

    return days[new Date(rt).getDay()];
  }

  makeid(length) {
    var result = "";
    var characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  

   axios
      .get("https://damp-beyond-36191.herokuapp.com/get/order/bynumber/" + result)
      .then((resp) => {
        if (resp.data === null) {
          // /edit/store/orderNum/
        } else {
          this.makeid(6);
        }
      })
      .then((err) => console.log(err));

    if (result) {
      return result;
    }

    // ;
  }
  //  ejIEyo
  render() {
    console.log("SD", this.state, this.props.user);
    var codeId = this.makeid(6);
    console.log("CODE ID", codeId);

    if (this.props.cart.length > 0) {
      var sId = this.props.cart[0].product.storeId;
    } else {
      var sId = "123";
    }

    var subTotal = 0;
    for (var i = 0; i < this.props.cart.length; i++) {
      var temp = this.props.cart[i].price;
      subTotal = subTotal + parseFloat(temp);
    }
    console.log("SUNBTOTALLLLLLLLLLLLLLLLLL",subTotal)
    const daysMap = [1, 2, 3, 4, 5];
    const timeMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var date = new Date();
    var day = date.getDate();
    var month1 = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month1 < 10) {
      month1 = "0" + month1;
    }
    //
    var todaysDate = day + "-" + month1 + "-" + year;
    console.log("sdddddddddddd", todaysDate);
    var dates = [];

    for (var i = -1; i < 12; i++) {
      var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      currentDate.setDate(currentDate.getDate() + i);
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }

      dates.push(day + "-" + month + "-" + year);
    }

    //
    var nameCheck = false;
    if (!this.props.user.user.isGuest) {
      nameCheck = true;
    }

    if (this.state.name || this.props.user.user.firstName) {
      nameCheck = true;
    }
    //

    var storeProducts = this.props.cart.filter((item, index) => {
      return item.product.storeId === this.props.store.id;
    });
    console.log("storeProductsstoreProducts", storeProducts);
    var isOut = false;
    var pname = "";

    if (this.state.clickCheck) {
      for (var i = 0; i < storeProducts.length; i++) {
        if (storeProducts[i].product.isOutOfStock) {
          var currentDate = new Date();
          var day = currentDate.getDate();
          var month = currentDate.getMonth() + 1;
          var year = currentDate.getFullYear();
          if (day < 10) {
            day = "0" + day;
          }
          if (month < 10) {
            month = "0" + month;
          }

          var todaysDate1 = year + "-" + month + "-" + day;
          console.log(todaysDate1 , storeProducts[i].product.outOfStockDate,"SDDDDDDDDDDDDDDDDDSSDS564564");
          if (todaysDate1 === storeProducts[i].product.outOfStockDate) {
            pname = storeProducts[i].product.productName;
            isOut = true;
          }
        }
        var temp = storeProducts[i].price;
      }
    }
    console.log("iout ois out", isOut);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    console.log("THIS.STATE", this.state);
    return (
      <>
       
         <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <ScrollView style={{ backgroundColor: "white" }}>
       
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingBottom: 0,
                paddingVertical: 30,
                paddingTop: 0,
                alignItems: "center",
              }}
            >
              <View style={{marginTop: 20}}>
                <LatoText
                  fontName="Lato-Bold"
                  fonSiz={20}
                  col="#2E2E2E"
                  text={this.props.store.name}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                // paddingLeft: 70,
                justifyContent: "space-between",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2E2E2E"
                text={this.props.store.address}
              />
            </View>

            <View style={lines.simple} />
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingTop: 30,
                paddingBottom: 20,

                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text="Order Date and Time"
              ></LatoText>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingBottom: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
            <DatePicker
              style={{width: 200}}
              date={this.state.orderDate}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate={new Date()}
              // maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {this.setState({orderDate: date})}}
            />
      
            </View>
          

      <View style={styles.container}>
        <Text>Selected Time: {this.state.orderTime}</Text>
        <TimePicker
          selectedHours={this.state.hours}
          selectedMinutes={this.state.minutes}
          onChange={(hours, minutes) => this.setState({ hours: hours, minutes: minutes, orderTime: hours+":"+minutes })}
        />
      </View>
            
            <View style={lines.simple} />

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingTop: 30,
                paddingBottom: 20,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={20}
                col="#2E2E2E"
                text="Contact Details"
              />

            </View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingBottom: 20,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2E2E2E"
                text="Name"
              />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2E2E2E"
                text={
                  this.state.name
                }
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingBottom: 20,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2E2E2E"
                text="Phone Number"
              />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2E2E2E"
                text={
                  this.state.mobile
                }
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingBottom: 20,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2E2E2E"
                text="Email"
              />
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="#2E2E2E"
                text={
                  this.props.user.user.email
                    ? this.props.user.user.email
                    : this.state.email
                }
              />
            </View>
            <View style={lines.simple} />
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 30,
                paddingBottom: 20,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#2E2E2E"
                text="Home Delivery?"
              />
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: 20,
              }}
            >
              <CheckBox
                style={{ flex: 1 }}
                onClick={() => {
                  this.setState({
                    isChecked: !this.state.isChecked,
                  });
                }}
                isChecked={this.state.isChecked}
                rightText={"Yes"}
              />
            </View>

            {this.state.isChecked && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-evenly",
                  marginBottom: 100,
                }}
              >
                <View style={{ flexGrow: 1 }}>
                  <View
                    style={{
                      width: "100%",
                      flex: 1,
                      justifyContent: "space-evenly",
                      paddingHorizontal: 20,
                    }}
                  >
                    <View>
                      <View
                        style={[
                          textIn.Flabel,
                          { width: "100%", paddingTop: wp("5%") },
                        ]}
                      >
                        <View>
                          <LatoText
                            fontName="Lato-Regular"
                            fonSiz={17}
                            col="#5C5C5C"
                            text={"Enter Address"}
                          />
                        </View>
                        <View>
                          <TextInput
                            style={[{ borderBottomColor: "#000",
                            borderBottomWidth: 1,
                            paddingTop: 5,
                            fontSize: 17,
                            paddingBottom:5,
                            color: '#000'}, { width: "100%" }]}
                            onChangeText={(address) =>
                              this.setState({
                                address,
                              })
                            }
                            value={this.state.address}
                          />
                        </View>
                      </View>
                    
                      
                  </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={lines.simple} />



          {!this.state.keyState && (
            <View style={bottomTab.cartSheet}>
              <TouchableOpacity
                disabled={
                  this.state.storeTimings.isClosed ||
                  !nameCheck ||
                  !this.state.numVerified ||
                  this.state.isStoreClosed
                }
                onPress={() => {
                
                    this.setState({ cart: true });

                    var pDate = new Date();
                    var dd = String(pDate.getDate()).padStart(2, "0");
                    var mm = String(pDate.getMonth() + 1).padStart(2, "0"); //January is 0!
                    var yyyy = pDate.getFullYear();

                    pDate = dd + "-" + mm + "-" + yyyy;

                    var currentdate = new Date();
                    var hr =
                      currentdate.getHours() < 10
                        ? "0" + currentdate.getHours()
                        : currentdate.getHours();
                    var mi =
                      currentdate.getMinutes() < 10
                        ? "0" + currentdate.getMinutes()
                        : currentdate.getMinutes();
                    var sc =
                      currentdate.getSeconds() < 10
                        ? "0" + currentdate.getSeconds()
                        : currentdate.getSeconds();
                    var pTime = hr + ":" + mi + ":" + sc;
                    var dt = "";
                    this.state.orderDate === ""
                      ? (dt = todaysDate)
                      : (dt = this.state.orderDate);
                    var timeCheck = true;
                    console.log(this.state.orderTime, dt, pTime, pDate);
                    if (dt === pDate) {
                      console.log("sdsd");
                      var t1 = pTime.split(":");

                      var t2 = this.state.orderTime.split(":");
                      console.log(parseInt(t1[0]), parseInt(t2[0]));
                      if (parseInt(t1[0]) >= parseInt(t2[0])) {
                        timeCheck = false;
                      }
                    }
                    // if (timeCheck) {
                      axios
                        .post(
                          "https://damp-beyond-36191.herokuapp.com/add/order",
                          {
                            storeId: sId,
                            products: storeProducts,
                            totalAmount: subTotal,
                            storeName: this.props.store.name,
                            storeAddress: this.props.store.address,
                            storePhone: this.props.store.phone,
                            userId: this.props.user.user._id,
                            name:
                              this.state.name,
                            phone: this.state.mobile,
                            email: this.state.email,
                            orderTime: this.state.orderTime,
                            orderDate:
                              this.state.orderDate === ""
                                ? todaysDate
                                : this.state.orderDate,
                            orderNumber: codeId,
                            isHomeDelivery: this.state.isChecked
                          }
                        )
                        .then((resp) => {
                          this.props.navigation.navigate("QrCode", {
                            orderId: resp.data.order1._id,
                            codeId: codeId,
                            order: resp.data.order1,
                          });
                        });

                }}
                style={[
                  this.state.storeTimings.isClosed ||
                  !nameCheck ||
                  !this.state.numVerified ||
                  this.state.isStoreClosed
                    ? btnStyles.cartBtn1
                    : btnStyles.cartBtn,
                  { width: "100%" },
                ]}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={15}
                  col="white"
                  text="CONFIRM"
                ></LatoText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </>
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
  modal: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998",
  },

  modal3: {
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width - 50,
  },

  modal4: {
    height: 370,
    width: Dimensions.get("window").width - 50,
    marginTop: 30,
  },
  modal6: {
    height: 230,
    width: Dimensions.get("window").width - 100,
  },
  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10,
  },
  dUnSelect: {
    width: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    paddingVertical: 5,
    marginRight: 10,
  },
  dSelect: {
    width: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    paddingVertical: 5,
    backgroundColor: "#2E2E2E",
    marginRight: 10,
  },
  tSelect: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    backgroundColor: "#2E2E2E",
    flexDirection: "row",
    marginVertical: 5,
    paddingVertical: 8,
    justifyContent: "center",
  },
  tUnSelect: {
    width: Dimensions.get("window").width / 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    flexDirection: "row",
    marginVertical: 5,
    paddingVertical: 8,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({
  cart: state.Cart.cartData,
  loading: state.Cart.cartLoading,
  error: state.Cart.cartError,
  user: state.user.user,
  store: state.Store.storeData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      cartAsync,
      userAsync,
      storeAsync,
      cartSizeAsync,
      favStoreAsync,
      storeHeaderAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
