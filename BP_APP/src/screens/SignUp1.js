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
  ActivityIndicator,
  // Modal
  BackHandler,
  Alert
} from "react-native";
import { BackStack } from "../Helpers/BackStack";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modalbox";
import CodeInput from "react-native-confirmation-code-input";
import * as EmailValidator from "email-validator";

import * as Font from "expo-font";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChangeText as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import { conStyles, textStyles, textIn, btnStyles } from "../styles/base";

import LatoText from "../Helpers/LatoText";
import axios from "axios";

export default class SignUp1 extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      icEye: "visibility-off",
      isPassword: true,
      fontLoaded: false,
      name: "",
      email: "",
      mobile: "",
      address: "",
      password: "",
      isOpen: false,
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      codeMsg: false,
      numVerified: false,
      num: "",
      loading: false,
      errMessage: "",
      loading: false,
      verifi: false,
      countryModal: false,
      selectedCountry: "USA",
      numberModal: false,
      id: ""
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      "Lato-Light": require("../../assets/fonts/Lato-Light.ttf"),
      "Lato-Bold": require("../../assets/fonts/Lato-Bold.ttf"),
      "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
      "Sarabun-Regular": require("../../assets/fonts/Sarabun-Regular.ttf"),
      "Sarabun-Medium": require("../../assets/fonts/Sarabun-Medium.ttf"),
      "Sarabun-Light": require("../../assets/fonts/Sarabun-Light.ttf"),
    });
    this.setState({ fontLoaded: true });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener();
  }
  getRef = (ref) => {
    if (this.props.getRef) this.props.getRef(ref);
  };

  handleSignUp = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        if (this.state.name) {
            if (this.state.email.trim()) {
              if (EmailValidator.validate(this.state.email.trim())) {
                if (this.state.password) {
                if (this.state.mobile.trim()) {
                  if (this.state.address) {
                    if (this.state.id) {
                      this.setState({ errMessage: "", loading: false });
                      axios
                      .post(
                        "https://damp-beyond-36191.herokuapp.com/signup",
                        {
                          name: this.state.name, 
                          email: this.state.email,
                          mobile: this.state.mobile,
                          password: this.state.password,
                          address: this.state.address,
                          // id: this.state.id,
                          
                        }
                      )
                      .then((resp) => {
                        // this.props.userAsync(resp.data);
                        Alert.alert(
                          "Account Created",
                          "Please Login",
                          [
                            {
                              text: "OK",
                              onPress: () =>
                                this.props.navigation.navigate("Login"),
                            },
                          ],
                          { cancelable: false }
                        );
                      })
                      .catch((err) =>
                        this.setState({ msg: err.message })
                      );
                    } else {
                      this.setState({
                        errMessage: "Please enter ID",
                        loading: false,
                      });
                    }
                    } else {
                    this.setState({
                      errMessage: "Please enter Address",
                      loading: false,
                    });
                  }
                } else {
                  this.setState({
                    errMessage: "Please enter mobile number",
                    loading: false,
                  });
                }
              } else {
                this.setState({
                  errMessage: "Please enter password",
                  loading: false,
                });
              }
            } 
              else {
                this.setState({
                  errMessage: "Please enter correct email",
                  loading: false,
                });
              }
            } else {
              this.setState({
                errMessage: "Please enter your email",
                loading: false,
              });
            }
          } else {
          this.setState({
            errMessage: "Please enter your name",
            loading: false,
          });
        }
      }
    );
  };

  render() {
    const { icEye, isPassword, icEye1, isPassword1 } = this.state;

    
    return (
      <SafeAreaView
        style={[conStyles.safeAreaMy, { backgroundColor: "#5f6aa3" }]}
      >
        <StatusBar translucent={true} barStyle="dark-content" />
        
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{ paddingLeft: 30, paddingTop: 30, paddingBottom: 10 }}
        >
          <Image source={require("../../assets/back.png")} />
        </TouchableOpacity>
        {/* <> */}
          <Image source={require('../../assets/background.jpg')} 
                      style={[styles.fixed, styles.containter]}
          />
        <ScrollView
        style={[styles.fixed, styles.scrollview, {flex: 1} ]}
          contentContainerStyle={[
            conStyles.scroll,
            { justifyContent: "space-around" },
          ]}
        >
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
              text={"SIGN UP"}
            />
            <View style={textIn.Flabel}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "100%" }}>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#fff"
                    text={"Name"}
                  />
                  <TextInput
                    style={[textIn.input]}
                    onChangeText={(name) =>
                      this.setState({
                        name,
                      })
                    }
                    value={this.state.name}
                  />
                </View>
                
              </View>
            </View>
            <View>
              <View style={textIn.label}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#fff"
                  text={"Email Address"}
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
                  value={this.state.email.trim()}
                  autoCapitalize="none"
                  keyboardType={"email-address"}
                />
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
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
                  secureTextEntry={isPassword1}
                  onChangeText={(password) => {
                    this.setState({
                      password,
                    });
                  }}
                  autoCapitalize="none"
                  value={this.state.password}
                  secureTextEntry={true}
                />
              </View>
              
            </View>
            <View>
              <View style={textIn.label}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="#fff"
                  text={"Phone Number"}
                />
              </View>
              <TouchableOpacity
                onPress={() => this.refs.coModal.open()}
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
               
                <TextInput
                  keyboardType={"numeric"}
                  onChangeText={(mobile) =>
                    mobile.length < 10
                      ? this.setState({
                          mobile,
                        })
                      : this.setState({
                          mobile,
                          verifi: true,
                        })
                  }
                  value={this.state.mobile}
                  style={[textIn.input, { width: "100%" }]}
                />
              </TouchableOpacity>
             
              <View>
                <View style={textIn.label}>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#fff"
                    text={"Address"}
                  />
                </View>
                <View>
                  <TextInput
                    style={textIn.input}

                    onChangeText={(address) =>
                      this.setState({
                        address,
                      })
                    }
                    value={this.state.address}
                  />
                </View>
              </View>
              
              {/* <View>
                <View style={textIn.label}>
                  <LatoText
                    fontName="Lato-Regular"
                    fonSiz={17}
                    col="#fff"
                    text={"ID"}
                  />
                </View>
                <View>
                  <TextInput
                    style={textIn.input}

                    onChangeText={(id) =>
                      this.setState({
                        id,
                      })
                    }
                    value={this.state.id}
                  />
                </View>
              </View> */}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 40,
              width: "100%",
            }}
          >
            {this.state.errMessage !== "" && (
              <>
               
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="red"
                  text={this.state.errMessage}
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
              style={[
                btnStyles.basic,
                { backgroundColor: "white" }
              ]}
              onPress={() => this.handleSignUp()}
            >
              {this.state.loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={17}
                  col="black"
                  text={"Sign Up"}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: "center", marginTop: 20 }}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <LatoText
                fontName="Lato-Regular"
                fonSiz={17}
                col="white"
                text={"Already a member Sign In "}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    flex: 1,
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
    height: 230,
    width: Dimensions.get("window").width - 100,
  },

  modal4: {
    height: 300,
  },

  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10,
  },

  btnModal: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: "transparent",
  },

  text: {
    color: "black",
    fontSize: 22,
  },
  logo: {
    width: wp("30%"),
    alignSelf: "center",
  },
  icon: {
    position: "absolute",
    right: 10,
    paddingTop: 8,
  },
  myText: { fontSize: hp("5%") },
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
