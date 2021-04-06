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
  ActivityIndicator,
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
import OrderCards from "../Helpers/OrderCards";
import axios from "axios";
import { bindActionCreators } from "redux";
import { userAsync } from "../store/actions";
import { connect } from "react-redux";
import Collapsible from "react-native-collapsible";
import WalletCard from '../Components/walletCard'
import StoreCard from '../Components/StoreCard'
const { width } = Dimensions.get("window");
const { height } = 300;

class MyOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      wallet: [],
      loading: true,
      activeCollapsed: false,
      pastCollapsed: true,
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://damp-beyond-36191.herokuapp.com/get/wallet/user1/" +
          this.props.user.user._id
      )
      .then((resp) => this.setState({ wallet: resp.data, loading: false }))
      .catch((err) => console.log(err));

    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.setState(
        {
          loading: true,
        },
        () =>
          axios
            .get(
              "https://damp-beyond-36191.herokuapp.com/get/wallet/user1/" +
                this.props.user.user._id
            )
            .then((resp) =>
              this.setState({ wallet: resp.data, loading: false })
            )
            .catch((err) => console.log(err))
      );
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {

   
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
            {this.state.wallet.map((item,index) => (
                <WalletCard  id={item.storeId} amount={item.amount} storeName={item.storeName}/>
            ))}
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
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      userAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
