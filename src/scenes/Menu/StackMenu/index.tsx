import TelaProfessor from "../../Professor";
import { createStackNavigator } from "@react-navigation/stack";
import TelaHome from "../../Home";
import TelaHistorico from "../../Historico";
import TelaAluno from "../../Aluno";
import TelaDisciplina from "../../Disciplina";
import TelaTurma from "../../Turma";
import TelaMenu from "..";

export default function TelaStackMenu() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Menu">
      <Stack.Screen name="Menu" component={TelaMenu} />
      <Stack.Screen name="Historico" component={TelaHistorico} />
      <Stack.Screen name="Aluno" component={TelaAluno} />
      <Stack.Screen name="Disciplina" component={TelaDisciplina} />
      <Stack.Screen name="Professor" component={TelaProfessor} />
      <Stack.Screen name="Turma" component={TelaTurma} />
    </Stack.Navigator>
  );
}
