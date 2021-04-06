import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  Alert,
  BackHandler
} from "react-native";
import { cardStyles } from "../styles/base"; 
import LatoText from "../Helpers/LatoText";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase";
import { bindActionCreators } from "redux";
import { storeAsync, cartAsync, cartSizeAsync,favStoreAsync,storeHeaderAsync } from "../store/actions";
import { connect } from "react-redux";
import Modal from "react-native-modalbox";
import axios from "axios";

class StoreCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      image: "",
      isEnabled: true,
    };
  }

  backAction = () => {
  
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
   
  };

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


      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
      this._unsubscribe = this.props.navigation.addListener("focus", () => {
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
      });

  }
  render() {
    const { storeName, amount } = this.props;
    return (
      <TouchableOpacity
      onPress={() => {
          // alert(JSON.stringify(this.props.user.user._id))
          axios.get("https://mysterious-anchorage-22807.herokuapp.com/get/refID/"+this.props.user.user._id)
          .then(resp  => {
            // alert(JSON.stringify(resp.data))
            if(resp.data.length > 0){
              var count = 0

              for(var i=0; i< resp.data.length; i++){
                var storeData = ""
                if(resp.data[i].storeName === this.props.storeName){
                  // alert(JSON.stringify(resp.data[i]))
                  storeData = resp.data[i]
                    count++
                   this.props.navigation.push("QrCode",{
                    item: this.props.item,
                    storeName: this.props.storeName,
                    id: storeData.id
                  });
                }
              }
              if(count == 0){
                this.props.navigation.push("QrCode",{
                  item: this.props.item,
                  storeName: this.props.storeName,
                  id: "-1"
                });
              }
              
            }else{
                this.props.navigation.push("QrCode",{
                  item: this.props.item,
                  storeName: this.props.storeName,
                  id: "-1"
                });
              
            }
            
          })
          .catch(err => alert(err))
       
      }}

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
  user: state.user.user, 

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
