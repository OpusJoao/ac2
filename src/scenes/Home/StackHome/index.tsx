import { createStackNavigator } from "@react-navigation/stack";
import TelaHome from "..";

export default function TelaStackHome() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={TelaHome} />
    </Stack.Navigator>
  );
}
