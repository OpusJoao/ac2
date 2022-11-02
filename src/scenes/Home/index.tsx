import { Image, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

export default function TelaHome() {
  const [integrantes, setIntegrantes] = useState([
    {
      nome: "João Vitor Antunes Ferreira",
      RA: "200820",
    },
    {
      nome: "Pedro Machado Maldonado",
      RA: "200043",
    },
  ]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    user: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10%",
    },
  });

  return (
    <View style={styles.container}>
      {integrantes.map((i) => (
        <View style={styles.user}>
          <Image
            style={{ width: 100, height: 100 }}
            source={{
              uri: `https://ui-avatars.com/api/?name=${i.nome}`,
            }}
            defaultSource={{
              uri: "https://cdn-icons-png.flaticon.com/512/892/892781.png?w=360",
            }}
          ></Image>
          <Text>
            {i.nome} - {i.RA}
          </Text>
        </View>
      ))}
    </View>
  );
}
