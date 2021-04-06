import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import CardsRow from "../Components/CardsRow";
import axios from "axios";
import SingleStoreHeader from "../Helpers/SingleStoreHeader";
import { bindActionCreators } from "redux";
import { filterAsync, searchAsync } from "../store/actions";
import { connect } from "react-redux";
import ProCards from "../Helpers/ProCards";

class StoreDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      products: [],
      finalProducts: [],
      featuredProducts: [],
      loading: true,
    };
  }
  getMyData = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        axios
          .get(
            "https://damp-beyond-36191.herokuapp.com/get/all/products/" +
              this.props.route.params.storeId
          )
          .then((resp) => {
            this.setState({ products: resp.data, loading: false });
          })
          .catch((err) => console.log(err));


      }
    );
  };
  componentDidMount() {
    this.getMyData();
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getMyData();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  componentWillUnmount() {
    this.props.searchAsync("");
  }
  render() {
    var fp = [];
    this.state.products.map((category, index) =>
      fp.push({
        name: "Products",
        products: this.state.products.filter(function (item) {
          return true;
        }),
      })
    );
    console.log("FPPPP",fp, this.state.products)
    var searchedProducts = [];
    var key1 = this.props.searchInput;
    if (this.props.searchInput) {
        searchedProducts= this.state.products.filter(function (product) {
          return product.productName
            ? product.productName.toLowerCase().includes(key1.toLowerCase())
            : null;
        });

    }

    return (
      <View>
        {this.state.loading ? (
          <View style={{ paddingVertical: 50 }}>
            <ActivityIndicator color="gray" size="large" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.props.searchInput

              ? <ScrollView vertical={true} showsVerticalScrollIndicator={false}>

                {searchedProducts.map((cat, index) =>
                    <ProCards
                    navigation={this.props.navigation}
                    key={index}
                    product={cat}
                    id={cat._id}
                  />
                )}
                </ScrollView>
              : (
              <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
              {this.state.products.map((prod, index) => (
                <ProCards
                  navigation={this.props.navigation}
                  key={index}
                  product={prod}
                  id={prod._id}
                />
              ))}
            </ScrollView>)
                }
            <View style={{ paddingTop: 10 }}></View>
          </ScrollView>
        )}
      </View>
    );
  }
}
// export default StoreDetails
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({
  searchInput: state.Search.searchData,
});
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      filterAsync,
      searchAsync,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StoreDetails);
