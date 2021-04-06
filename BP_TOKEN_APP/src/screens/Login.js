import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import Geolocation from "@react-native-community/geolocation";
import { BackStack } from "../Helpers/BackStack";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Font from "expo-font";
import * as EmailValidator from "email-validator";
import { CommonActions } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import { conStyles, textStyles, textIn, btnStyles } from "../styles/base";
import LatoText from "../Helpers/LatoText";
import axios from "axios";
import { bindActionCreators } from "redux";
import { userAsync, locationAsync } from "../store/actions";
import { connect } from "react-redux";
import { getUniqueId, getManufacturer } from "react-native-device-info";
class Login extends React.Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);

    this.state = {
      icEye: "visibility-off",
      isPassword: true,
      fontLoaded: false,
      email: "",
      password: "",
      msg: "",
      mainLoading: true,
    };
  }
  async componentDidMount() {
    // const jsonValue1 = "";
    const jsonValue1 = await AsyncStorage.getItem("user");
    var jsonValue = JSON.parse(jsonValue1)
     
      

    if (jsonValue) {

      await axios.get('http://192.168.0.103:3fff/get/user/byId/'+jsonValue)
      .then(async resp => {
        console.log("res[==============================================================================p",resp.data)
        await this.props.userAsync({user: resp.data})
      })
      .catch(err => console.log("err1",err))
           this.setState({
        mainLoading:false
      }
      // ()=> this.props.navigation.navigate("App")
      )
    }
    else{
      this.setState({
        mainLoading:false
      })
    }
  }
  getRef = (ref) => {
    if (this.props.getRef) this.props.getRef(ref);
  };
  changePwdType = () => {
    const { isPassword } = this.state;
    // set new state value
    this.setState({
      icEye: isPassword ? "visibility" : "visibility-off",
      isPassword: !isPassword,
    });
  };
  handleApp = async (value, loc) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(value.user._id));
    } catch (e) {
      alert(error);
    }
    
    this.setState(
      {
        icEye: "visibility-off",
        isPassword: true,
        fontLoaded: false,
        email: "",
        password: "",
        msg: "",
        loading: false,
      },
      () => this.props.navigation.navigate("App")
    );
  };
  
  handleLogin = () => {
    console.log("called")
    this.setState(
      {
        loading: true,
      },
      () => {
        if (this.state.email.trim()) {
          if (EmailValidator.validate(this.state.email.trim())) {
            if (this.state.password) {
              console.log("inn")
              axios
                .post("https://mysterious-anchorage-22807.herokuapp.com/signin", {
                  email: this.state.email.toLowerCase().trim(),
                  password: this.state.password,
                })
                .then((resp) => { 
                  if (resp.data === "Incorrect password.") {
                    this.setState({
                      errMessage: "Password is incorrect",
                      loading: false,
                    }); 
                    Î;
                  } else if (resp.data === "Email does not exist.") {
                    this.setState({
                      errMessage: "Email does not exist.",
                      loading: false,
                    });
                  } else {
                    this.setState({ errMessage: false });
                          this.props.userAsync(resp.data)
                          this.handleApp(resp.data);
                  }
                })
                .catch((err) =>
                  this.setState({ msg: err.message, loading: false })
                );
            } else {
              this.setState({
                errMessage: "Please Enter Your Password",
                loading: false,
              });
            }
          } else {
            this.setState({
              errMessage: "Please enter a valid email",
              loading: false,
            });
          }
        } else {
          this.setState({
            errMessage: "Please Enter Your Email",
            loading: false,
          });
        }
      }
    );
  };

 
  render() { 
    const { icEye, isPassword } = this.state;

    const styles = StyleSheet.create({
      logo: {
        width: wp("100%"),
        alignSelf: "center",
      },
      icon: {
        position: "absolute",
        right: 10,
        paddingTop: 8,
      },
      myText: { fontSize: hp("5%") },
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
      },
      containter: {
        width: Dimensions.get("window").width, //for full screen
        height: Dimensions.get("window").height //for full screen
      },
      fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
     scrollview: {
       backgroundColor: 'transparent'
 
     }
    });
    return (
      <SafeAreaView
        style={[conStyles.safeAreaMy, { backgroundColor: "white" }]}
      >
        <StatusBar translucent={true} barStyle="dark-content" />
        {this.state.mainLoading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color="gray" size="large" />
          </View>
        ) : (
          <>
          <Image source={require('../../assets/background.jpg')} 
                      style={[styles.fixed, styles.containter]}
          />
          <ScrollView
            // style={{ }}
            style={[styles.fixed, styles.scrollview, {flex: 1} ]}
            contentContainerStyle={conStyles.scroll}
            // style={{backgroundColor: "#5f6aa3"}}
          >
            {/* <Image
              style={styles.logo}
              source={require(".././../assets/logo1.png")}
              resizeMode="contain"
            /> */}
            <View
              style={{
                justifyContent: "flex-start",
                paddingHorizontal: wp("10%"),
              }}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={20}
                col="#fff"
                text={"SIGN IN"}
              />
              <View style={textIn.Flabel}>
                <View>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#fff"
                    text={"Email address"}
                  />
                </View>
                <View>
                  <TextInput
                    style={textIn.input}
                    onChangeText={(email) =>
                      this.setState({
                        email: email,
                      })
                    }
                    value={this.state.email.toLowerCase().trim()}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>
              <View>
                <View style={textIn.label}>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#fff"
                    text={"Password"}
                  />
                </View>
                <View>
                  <TextInput
                    style={textIn.input}
                    secureTextEntry={isPassword}
                    onChangeText={(password) => {
                      this.setState({
                        password,
                      });
                    }}
                    autoCapitalize="none"
                    value={this.state.password}
                  />
                  <Icon
                    style={styles.icon}
                    name={icEye}
                    size={20}
                    color={"#ffffff"}
                    onPress={this.changePwdType}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {this.state.errMessage && (
                <>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="red"
                    text={this.state.errMessage || ""}
                  />
                </>
              )}
            </View>
            <View
              style={{
                justifyContent: "space-evenly",

                paddingHorizontal: wp("10%"),
              }}
            >
              <TouchableOpacity
                style={btnStyles.basic}
                onPress={() => this.handleLogin()}
              >
                
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="black"
                    text={"SIGN IN"}
                  />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center", marginTop: 20 }}
                onPress={() => this.props.navigation.navigate("SignUp1")}
              >
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="white"
                  text={" New memeber? Sign up "}
                />
              </TouchableOpacity>
            
            </View>
          </ScrollView>
          </>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  loading: state.user.userLoading,
  error: state.user.userError,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      userAsync,
      locationAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);
