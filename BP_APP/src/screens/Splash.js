import React from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";
import { conStyles } from "../styles/base";
import axios from "axios";
import { bindActionCreators } from "redux";
import { userAsync, locationAsync } from "../store/actions";
import { connect } from "react-redux";
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
   componentDidMount() {
    // setTimeout(function(this){ navigation.navigate("Login") }, 3000);
  }
  
  render() {

    const styles = StyleSheet.create({
      logo: {
        width: wp("80%"),
        alignSelf: "center",
        // marginTop: "-200px"
      },
      icon: {
        position: "absolute",
        right: 10,
        paddingTop: 8,
      },
      myText: { fontSize: hp("5%") },
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
          <View
            style={{ flex: 1 }}
            contentContainerStyle={conStyles.scroll}
            style={{backgroundColor: "#262b43"}}
          >
            <Image
              style={styles.logo}
              source={require(".././../assets/logo1.png")}
              resizeMode="contain"
            />
          </View>
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
