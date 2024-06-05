import * as React from "react";
import { Drawer } from "react-native-paper";

const DrawerCustom = ({ navigation }) => {
  return (
    <Drawer.Section style={{ padding: 40 }}>
      <Drawer.Item
        label="Contacts"
        icon="format-list-bulleted"
        onPress={() => navigation.navigate("Contacts")}
      />
      <Drawer.Item
        label="Favorites"
        icon="heart"
        onPress={() => navigation.navigate("Favorites")}
      />
      <Drawer.Item
        label="User"
        icon="account"
        onPress={() => navigation.navigate("User")}
      />
      
    </Drawer.Section>
  );
};

export default DrawerCustom;
