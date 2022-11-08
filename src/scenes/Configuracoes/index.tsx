import { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ContextoFundo from "../../context/contextoFundo";

export default function TelaConfiguracoes() {
  const {fundo, setFundo} = useContext(ContextoFundo)
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: `${fundo}`,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  const coresDeFundo = ['#fff', 'blue', 'green']
  const tamanhoPadrao = 120
  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        { coresDeFundo.map(cor => (
          <TouchableOpacity style={{width: tamanhoPadrao, height: tamanhoPadrao, backgroundColor: cor, margin: 8, borderWidth: 1, borderColor: '#000'}} onPress={()=>{setFundo(cor)}}></TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
