import { Button, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ServicoAluno from '../../services/Aluno/ServicoAluno';
import AlunoRepositorioFirebase from '../../repositories/AlunoRepositorioFirebase';
import { db } from '../../database/firebase/db';
import { useContext, useEffect, useState } from 'react';
import { IAluno } from '../../interfaces/aluno/IAluno';
import { launchImageLibrary } from 'react-native-image-picker'
import ContextoFundo from '../../context/contextoFundo';

export default function TelaVisuaizarAluno(props:any){
  const {fundo, setFundo} = useContext(ContextoFundo)

  const servicoAluno = new ServicoAluno(new AlunoRepositorioFirebase(db))
  const [aluno, setAluno] = useState<IAluno>({
    matricula: "",
    nome: "",
    endereco: "",
    cidade: "",
    foto: ""
  })


  async function buscarAluno(): Promise<IAluno>{
    const aluno = await servicoAluno.buscar({primeiroCampo: 'matricula', operacao: '==', segundoCampo : props?.route?.params?.aluno?.matricula})
    if(aluno.length){
      const alunoAtual = aluno.pop()
      return {
        cidade: alunoAtual?.cidade || '',
        endereco: alunoAtual?.endereco || '',
        foto: alunoAtual?.foto || '',
        matricula: alunoAtual?.matricula || '',
        nome: alunoAtual?.nome || '',
      }
    }
    return {
      cidade: '',
      endereco: '',
      foto: '',
      matricula: '',
      nome: '',
    }
  }

  useEffect(() => {
    buscarAluno().then(aluno => {
      setAluno(aluno)
    })
  }, [])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: `${fundo}`,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  

  return (
    <View style={styles.container}>
      <Text>Matricula</Text>
      <TextInput editable={false} value={aluno.matricula}  style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Nome</Text>
      <TextInput editable={false} value={aluno.nome} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Endereco</Text>
      <TextInput editable={false} value={aluno.endereco} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Cidade</Text>
      <TextInput editable={false} value={aluno.cidade} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Foto</Text>
      <Image 
        style={{ width: 100, height: 100 }}
        source={{
          uri: aluno.foto
        }} 
        defaultSource={{
          uri: "https://cdn-icons-png.flaticon.com/512/892/892781.png?w=360"
        }}
        />
      
    </View>
  )
}