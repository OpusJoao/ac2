import { Image, StyleSheet, Text, View } from "react-native";

export default function TelaConfiguracoes() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text>TODO: Tela de configurações para escolher plano de fundo</Text>
    </View>
  );
}
