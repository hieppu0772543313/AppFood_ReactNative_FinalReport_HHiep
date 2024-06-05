import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Favorites from "./screen/Favorites";
import Contacts from "./screen/Contacts";
import User from "./screen/User";
import colors from "./utility/colors";
import { Icon } from "react-native-paper";
import StackNavCount from "./routes/StackNavCount";
import StackNavFavorites from "./routes/StackNavFavorites";
import StackNavUser from "./routes/StackNavUser";

const Tab = createMaterialBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator initialRouteName="StackNavCount">
      <Tab.Screen
        name="Contacts"
        component={StackNavCount}
        options={{
          tabBarLabel: "Contacts",
          tabBarIcon: () => <Icon source="format-list-bulleted" color="#000" size={26} />,
        }}
      />
      <Tab.Screen name="Favorites" component={StackNavFavorites} options={{
          tabBarLabel: "Favorite",
          tabBarIcon: () => <Icon source="heart" color="#000" size={26} />,
        }}/>
      <Tab.Screen name="User" component={StackNavUser} options={{
          tabBarLabel: "User",
          tabBarIcon: () => <Icon source="account" color="#000" size={26} />,
        }}/>
    </Tab.Navigator>
  );
};

export default BottomTabs;
