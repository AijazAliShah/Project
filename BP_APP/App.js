import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  CreateAccount,
} from "./src/Screens";
import Home from "./src/screens/Home";
import Login from "./src/screens/Login";
// import Map from "./src/screens/Map";
import StackHeader from "./src/Helpers/StackHeader";
import ProductDetails from "./src/screens/ProductDetails";
import StoreDetails from "./src/screens/StoreDetails";
import SingleStoreHeader from "./src/Helpers/SingleStoreHeader";
import SingleCategHeader from "./src/Helpers/SingleCategHeader";
import store from "./src/store";
import { Provider as StoreProvider } from "react-redux";
import Cart from "./src/screens/Cart";
import Checkout1 from "./src/screens/Checkout1";
import QrCode from "./src/screens/QrCode";
import CustomDrawerContent from "./src/Helpers/CustomDrawerContent";
import StackGrayHeader from "./src/Helpers/StackGrayHeader";
import MyOrders from "./src/screens/MyOrders";
import EWallet from "./src/screens/EWallet";
import SignUp1 from "./src/screens/SignUp1";
import OrderDetails from "./src/screens/OrderDetails";
import LastHeader from "./src/Helpers/LastHeader";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator initialRouteName={"Login"} headerMode="none">
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp1" component={SignUp1} />

    <AuthStack.Screen
      name="CreateAccount"
      component={CreateAccount}
      options={{ title: "Create Account" }}
    />
  </AuthStack.Navigator>
);
const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const FavouritesStack = createStackNavigator();
const HomeStackScreen = (route) => (
  <HomeStack.Navigator headerMode="screen">
    <HomeStack.Screen
      name="Home"
      component={TabsScreen}
      options={{ header: (props) => null }}
    />
    <HomeStack.Screen
      name="StoreDetails"
      component={StoreDetails}
      options={{ header: (props) => <SingleStoreHeader {...props} /> }}
    />
    <HomeStack.Screen
      name="ProductDetails"
      component={ProductDetails}
      options={{
        header: (props) => (
          <StackHeader cart={true} nameTitle="Product Details" {...props} />
        ),
        tabBarOptions: false,
      }}
    />
    <HomeStack.Screen
      name="Cart"
      component={Cart}
      options={{
        header: (props) => (
          <StackHeader
          pic={true}
          cart={false}
          nameTitle="CART"
          {...props}
        />
        ),
      }}
    />
    <HomeStack.Screen
      name="Checkout1"
      component={Checkout1}
      options={{
        header: (props) => (
          <StackHeader
          pic={true}
          cart={false}
          nameTitle="CHECK OUT"
          {...props}
        />
        ),
      }}
    />
    <HomeStack.Screen
      name="OrderDetails"
      component={OrderDetails}
      options={{
        header: (props) => (
          <StackHeader
            pic={false}
            cart={false}
            nameTitle="ORDER DETAILS"
            {...props}
          />
        ),
      }}
    />

    <HomeStack.Screen
      name="QrCode"
      component={QrCode}
      options={{
        header: (props) => (
          <LastHeader cart={false} nameTitle="ORDER PLACED" {...props} />
        ),
      }}
    />

   
  

  </HomeStack.Navigator>
);

const MyOrderStack = createStackNavigator();
const MyOrderStackScreen = () => (
  <MyOrderStack.Navigator initialRouteName="MyOrders">
    <MyOrderStack.Screen
      name="MyOrders"
      component={MyOrders}
      options={{
        header: (props) => <StackGrayHeader nameTitle="My Orders" {...props} />,
      }}
    />
  </MyOrderStack.Navigator>
);


const EWalletStackScreen = () => (
  <MyOrderStack.Navigator initialRouteName="MyOrders">
    <MyOrderStack.Screen
      name="EWallet"
      component={EWallet}
      options={{
        header: (props) => <StackGrayHeader nameTitle="My Orders" {...props} />,
      }}
    />
  </MyOrderStack.Navigator>
);


const TabsScreen = () => (
  <Tabs.Navigator
    headerMode={"none"}
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === "Home") {
          return (
            <FontAwesome
              name="home"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        }
        else if (route.name === "MyOrderStackScreen") {
          return (
            <FontAwesome
              name="clipboard"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        }else if (route.name === "EWalletStackScreen") {
          return (
            <FontAwesome
              name="google-wallet"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        }

      },
    })}
    tabBarOptions={{
      activeTintColor: "#2E2E2E",
      inactiveTintColor: "#89898C",
    }}
  >
    <Tabs.Screen name="Home" component={Home} />
    <Tabs.Screen
      options={{
        tabBarLabel: "My Orders",
      }}
      name="MyOrderStackScreen"
      component={MyOrderStackScreen}
    />
    {/* <Tabs.Screen
      options={{
        tabBarLabel: "E-Wallet",
      }}
      name="EWalletStackScreen"
      component={EWalletStackScreen}
    /> */}
  </Tabs.Navigator>
);
const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator
    drawerContentOptions={{
      activeTintColor: "#e91e63",
      itemStyle: { backgroundColor: "transparent" },
      labelStyle: { color: "#FFFFFF" },
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={({ route }) => ({
      drawerIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === "About Us") {
          return (
            <FontAwesome
              name="information"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Favourites") {
          return (
            <FontAwesome
              name="heart"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Home") {
          return (
            <FontAwesome
              name="home"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "My Orders") {
          return (
            <FontAwesome
              name="clipboard-text"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Rate Us") {
          return (
            <FontAwesome
              name="star"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Share") {
          return (
            <FontAwesome
              name="share-variant"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        } else if (route.name === "Share") {
          return (
            <FontAwesome
              name="Home"
              size={26}
              color={focused ? "#2e2e2e" : "#89898c"}
            />
          );
        }
      },
    })}
  >
    <Drawer.Screen name="Home" component={HomeStackScreen} />
    {/* <Drawer.Screen name="Favourites" component={FavouritesStackScreen} /> */}
  </Drawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      name="Auth"
      component={AuthStackScreen}
      options={{
        animationEnabled: false,
      }}
    />

    <RootStack.Screen
      name="App"
      component={DrawerScreen}
      options={{
        animationEnabled: false,
      }}
    />
  </RootStack.Navigator>
);
export default () => {
  return (
    <StoreProvider store={store}>
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    </StoreProvider>
  );
};
