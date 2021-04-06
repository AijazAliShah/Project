import React from "react";
import { View, Image, StatusBar } from "react-native";
import { headerStyles } from "../styles/base";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import LatoText from "./LatoText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { bindActionCreators } from "redux";
import { storeAsync, cartAsync } from "../store/actions";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-status-bar-height";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class StoreHeader extends React.Component {
  render() {
    return (
      <View
        style={{ backgroundColor: "#000", paddingTop: getStatusBarHeight() }}
      >
        <StatusBar translucent={true} barStyle="light-content" />
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <TouchableOpacity
            style={{ padding: 20 }}
            onPress={() => this.props.navigation.toggleDrawer()}
          >
            <Image source={require("../../assets/menu-1.png")} />
          </TouchableOpacity>
          <View style={{ padding: 20 }}>
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="white"
              text={"STORES"}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Cart")}
            style={{ padding: 20 }}
          >
            <View>
              <View style={headerStyles.cartTxt}>
                <LatoText
                  fontName="Lato-Regular"
                  fonSiz={7}
                  col="white"
                  text={this.props.cartLength}
                />
              </View>
              <FontAwesome name="shopping-cart" size={30} color={"white"} />
            </View>
          </TouchableOpacity>
        </View>

    
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  store: state.Store.storeData,
  cartData: state.Cart.cartData,
  loading: state.Store.storeLoading,
  error: state.Store.storeError,
  cartLength: state.CartSize.cartSizeData,
  userLocation: state.Location.locationData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      storeAsync,
      cartAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StoreHeader);
