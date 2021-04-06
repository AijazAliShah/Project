import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  Alert
} from "react-native";
import { cardStyles } from "../styles/base";
import LatoText from "../Helpers/LatoText";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase";
import { bindActionCreators } from "redux";
import { storeAsync, cartAsync, cartSizeAsync,favStoreAsync,storeHeaderAsync } from "../store/actions";
import { connect } from "react-redux";
import Modal from "react-native-modalbox";

class StoreCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      isEnabled: true,
    };
  }
  componentDidMount() {
    const ref = firebase
      .storage()
      .ref("/store_images/" + this.props.id + ".jpg");
    ref
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { storeName, amount } = this.props;
    return (
      <TouchableOpacity
        style={cardStyles.storeCard}
      >
        <View style={cardStyles.cImgWrap}>
          <Image
            style={{ width: "100%", height: 200 }}
            source={{ uri: this.state.image }}
          />
        </View>
        <View style={cardStyles.cTextWrap}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <LatoText
              fontName="Lato-Bold"
              fonSiz={20}
              col="#5C5C5C"
              text={storeName}
            />
             <LatoText
              fontName="Lato-Bold"
              fonSiz={17}
              col="#89898C"
              text={"E-Wallet Points: "+amount}
            />
          </View>
        </View> 

              </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modal3: {
    height: 230,
    width: Dimensions.get("window").width - 100,
  },
});

const mapStateToProps = (state) => ({
  store: state.Store.storeData,
  loading: state.Store.storeLoading,
  error: state.Store.storeError,
  store: state.Store.storeData,
  cart: state.Cart.cartData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      storeAsync,
      cartAsync,
      cartSizeAsync,
      favStoreAsync,
      storeHeaderAsync
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StoreCard);
