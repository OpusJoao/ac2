import { useContext } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import ContextoFundo from "../../context/contextoFundo";

export default function TelaMenu({ navigation }: any) {
  const {fundo, setFundo} = useContext(ContextoFundo)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: `${fundo}`,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      marginBottom: "5%",
      height: "5%",
      width: "40%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1E90FF",
      borderRadius: 5,
    },
    text: {
      color: "white",
    },
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => navigation.push("Aluno")}>
        <Text style={styles.text}>Aluno</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.push("Professor")}
      >
        <Text style={styles.text}>Professor</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.push("Disciplina")}
      >
        <Text style={styles.text}>Disciplina</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.push("Turma")}>
        <Text style={styles.text}>Turma</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.push("VisualizarTurma")}>
        <Text style={styles.text}>Visualizar Turma</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.push("Historico")}
      >
        <Text style={styles.text}>Histórico</Text>
      </Pressable>
    </View>
  );
}
