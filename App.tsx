import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import TelaHistorico from './src/scenes/Historico';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Historico" component={TelaHistorico} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

