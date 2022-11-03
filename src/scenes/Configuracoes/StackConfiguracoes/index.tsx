import { createStackNavigator } from "@react-navigation/stack";
import TelaConfiguracoes from "..";

export default function TelaStackConfiguracoes() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Configuracoes">
      <Stack.Screen name="Configurações" component={TelaConfiguracoes} />
    </Stack.Navigator>
  );
}
