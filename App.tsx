import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TelaStackMenu from "./src/scenes/Menu/StackMenu";
import TelaStackHome from "./src/scenes/Home/StackHome";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={TelaStackHome}
          options={{
            tabBarIcon: () => (
              <Image
                style={{ width: 25, height: 25 }}
                source={{
                  uri: "https://toppng.com/uploads/preview/free-sweet-icons-easy-home-icon-blue-115629422668ad9pch50j.png",
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={TelaStackMenu}
          options={{
            tabBarIcon: () => (
              <Image
                style={{ width: 25, height: 25 }}
                source={{
                  uri: "https://assets.stickpng.com/thumbs/588a64cdd06f6719692a2d0d.png",
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Configurações"
          component={TelaStackMenu}
          options={{
            tabBarIcon: () => (
              <Image
                style={{ width: 25, height: 25 }}
                source={{
                  uri: "https://img.favpng.com/25/15/14/project-management-icon-png-favpng-LMVFPj2r00vdGwLP0dCpQYJqQ.jpg",
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
