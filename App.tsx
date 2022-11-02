import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TelaHistorico from "./src/scenes/Historico";
import TelaAluno from "./src/scenes/Aluno";
import TelaDisciplina from "./src/scenes/Disciplina";
import TelaProfessor from "./src/scenes/Professor";
import TelaTurma from "./src/scenes/Turma";
import TelaHome from "./src/scenes/Home";
import TelaMenu from "./src/scenes/Menu";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={TelaMenu} />
        <Stack.Screen name="Home" component={TelaHome} />
        <Stack.Screen name="Historico" component={TelaHistorico} />
        <Stack.Screen name="Aluno" component={TelaAluno} />
        <Stack.Screen name="Disciplina" component={TelaDisciplina} />
        <Stack.Screen name="Professor" component={TelaProfessor} />
        <Stack.Screen name="Turma" component={TelaTurma} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
