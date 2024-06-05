import { createDrawerNavigator } from "@react-navigation/drawer";
import Profiles from "./screen/Profiles";
import Contacts from "./screen/Contacts";
import Favorites from "./screen/Favorites";
import User from "./screen/User";
import colors from "./utility/colors";
import DrawerCustom from "./DrawerCustom";
import Options from "./screen/Options";
const drawer = createDrawerNavigator();
export default function DrawerNav() {
    return(
        <drawer.Navigator
          backBehavior="history"
          initialRouteName="Contacts"
          drawerContent={(props) => <DrawerCustom {...props} />}
        >
          <drawer.Screen
            name="Contacts"
            component={Contacts}
            options={{
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: colors.blue,
                borderBottomWidth: 1,
                borderColor: colors.black,
              },
            }}
          />
          <drawer.Screen
            name="Profiles"
            component={Profiles}
            options={{
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: colors.blue,
                borderBottomWidth: 1,
                borderColor: colors.black,
              },
            }}
          />
          <drawer.Screen
            name="Favorites"
            component={Favorites}
            options={{
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: colors.blue,
                borderBottomWidth: 1,
                borderColor: colors.black,
              },
            }}
          />
          <drawer.Screen
            name="User"
            component={User}
            options={{
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: colors.blue,
                borderBottomWidth: 1,
                borderColor: colors.black,
              },
            }}
          />
          <drawer.Screen
            name="Options"
            component={Options}
            options={{
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: colors.blue,
                borderBottomWidth: 1,
                borderColor: colors.black,
              },
            }}
          />
        </drawer.Navigator>
    )
}