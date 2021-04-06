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
  Alert
} from "react-native";
import Carousel from "react-native-looped-carousel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LatoText from "../Helpers/LatoText";
import { ScrollView } from "react-native-gesture-handler";
import Expandable from "../Helpers/Expandable";
import { btnStyles, bottomTab, lines } from "../styles/base";
import { Row } from "native-base";
import CheckBox from "react-native-check-box";
import InQrCode from './InQrCode'
import { bindActionCreators } from "redux";
import { cartAsync, cartSizeAsync,
  favStoreAsync,
  storeHeaderAsync,
  storeAsync } from "../store/actions";
import { connect } from "react-redux";
import axios from 'axios' 
import ImagePicker from "react-native-image-picker";
import firebase from "firebase";

const { width } = Dimensions.get("window");
const { height } = 300;

const options = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
};
class QrCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heart: false,
      qt: 1,
      image: "",
      tokenData: ''
    };
  }

  componentDidMount(){
    // if(this.props.user){
    //  alert(JSON.stringify(this.props.user.user.id))
    //  }
    this.props.cartAsync([])
    const ref = firebase
    .storage()
    .ref(
      "qr_images/" + this.props.route.params.item.storeName+this.props.route.params.id + ".jpg"
    );
  ref
    .getDownloadURL()
    .then((url) => {
      this.setState({ image: url });
    })
    .catch((err) => {
      console.log(err);
    });
    

    axios
      .get(
        "https://mysterious-anchorage-22807.herokuapp.com/get/token/"+this.props.route.params.id+"/"+this.props.route.params.item.storeName
      )
      .then((resp) => {
        // alert(JSON.stringify(resp.data))
        this.setState({
          tokenData: resp.data
        });
      })
      .catch(err => console.log(JSON.stringify(err)))

  }
  _onLayoutDidChange = e => {
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
  uploadImage = async (uri) => {
    // alert(JSON.stringify(this.props))
    this.setState({image: uri})
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("qr_images/" + this.props.route.params.item.storeName +this.props.route.params.id  + ".jpg");
      // alert("wlert")
      this.setState({a: "a"})
    return ref.put(blob);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView style={{ backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 30,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={25}
              col="#5C5C5C"
              text={this.props.route.params.item.storeName}
            ></LatoText>
          </View>
          {this.state.tokenData ? (
          <View>
          <TouchableOpacity
              onPress={() =>
                ImagePicker.showImagePicker(options, (response) => {
                  if (response.didCancel) {
                  } else if (response.error) {
                  } else if (response.customButton) {
                  } else {
                    const source = { uri: response.uri };
                    // this.saveImage(source);
                    this.uploadImage(source.uri)
                      .then((resp) => Alert("success"))
                      .then((err) => Alert(err));

                    this.setState({
                      avatarSource: source,
                    });
                  }
                })
              }
              style={{ paddingHorizontal: 80 }}
            >
              <LatoText
                fontName="Lato-Bold"
                fonSiz={18}
                col="black"
                text="Upload QR Code / Bar Code"
              />
            </TouchableOpacity>
          </View> ): (
            <View style={{ alignSelf: "center" }}>

             <LatoText
             fontName="Lato-Bold"
             fonSiz={16}
             col="black"
             text="You are not register in this E-Wallet"
           />
           </View>
          )}
         {this.state.tokenData ? (

          <View>
          {this.state.image ? (
              <Image
                style={{ width: 250, height: 250, borderRadius: 10, margin: 70 }}
                source={{ uri: this.state.image }}
              />
            ) : (
              null
            )}
          </View>
         ): null}
         {this.state.tokenData ? (

          <View style={{display: "flex", justifyContent: "space-around", flexDirection: "row"}}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#5C5C5C"
              text={"Name: "}
            ></LatoText>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={18} 
              col="#5C5C5C"
              text={this.state.tokenData ? this.state.tokenData.name : this.props.user.user.name}
            ></LatoText>
          </View>
          
          </View>
          ): null}
         {this.state.tokenData ? (

          <View style={{display: "flex", justifyContent: "space-around", flexDirection: "row"}}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={20}
              col="#5C5C5C"
              text={"Points: "}
            ></LatoText>
          </View>
          <View
            style={{ 
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <LatoText
              fontName="Lato-Regular"
              fonSiz={18}
              col="#5C5C5C"
              text={this.state.tokenData ? this.state.tokenData.token+" Rs." : "0 Rs."}
            ></LatoText>
          </View>
         
          </View>): null}
         </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  imgCon: {
    width: Dimensions.get("window").width,
    height: 250
  },
  topRight: {
    alignSelf: "flex-end"
  },
  wrapTop: {
    alignSelf: "flex-end",

    marginTop: 30,
    backgroundColor: "#7cba80",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  bottomText: {
    height: 200,
    flexDirection: "row"
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  }
});

const mapStateToProps = state => ({
  cart: state.Cart.cartData,
  user: state.user.user, 
  loading: state.Cart.cartLoading,
  error: state.Cart.cartError
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
      {
          cartAsync,
          cartSizeAsync,
          favStoreAsync,
          storeHeaderAsync,
          storeAsync
      },
      dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QrCode);