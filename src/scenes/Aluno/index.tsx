import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ServicoAluno from '../../services/Aluno/ServicoAluno';
import AlunoRepositorioFirebase from '../../repositories/AlunoRepositorioFirebase';
import { db, storage } from '../../database/firebase/db';
import { useEffect, useState } from 'react';
import { IAluno } from '../../interfaces/aluno/IAluno';
import { launchImageLibrary } from 'react-native-image-picker'
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';

export default function TelaAluno(){
  const servicoAluno = new ServicoAluno(new AlunoRepositorioFirebase(db))
  const [aluno, setAluno] = useState<IAluno>({
    matricula: "",
    nome: "",
    endereco: "",
    cidade: "",
    foto: ""
  })

  const [alunos, setAlunos] = useState<IAluno[]>([])

  const [carregando, setCarregando] = useState(false)

  function onChangeNomeAluno(input: string) {
    setAluno({ ...aluno, nome: input })
  }

  function onChangeMatriculaAluno(input: string) {
    setAluno({ ...aluno, matricula: input })
  }

  function onChangeEnderecoAluno(input: string) {
    setAluno({ ...aluno, endereco: input })
  }

  function onChangeCidadeAluno(input: string) {
    setAluno({ ...aluno, cidade: input })
  }

  function onChangeFotoAluno(input: string) {
    setAluno({ ...aluno, foto: input })
  }

  function uploadArquivo(){
    return new Promise((resolve,reject) => {
      const storageRef = ref(storage, aluno.matricula);

    uploadString(storageRef, aluno.foto, 'data_url').then( async (snapshot) => {
      await getDownloadURL(storageRef)
      .then((url) => {
        aluno.foto = url
        resolve(true)  
      })
    });
    })
  }

  async function onPressSalvarAluno() {
    setCarregando(true)
    await uploadArquivo()
    const alunoCriado = await servicoAluno.criar(aluno)
    alert(alunoCriado.msg)
    setCarregando(false)

    buscaTodosAlunos().then(alunos => {
      return setAlunos(alunos);
    })
  }

  function renderizaAlunoFlatList({item}: any) {
    return (
      <Text>[{item.matricula}] {item.nome} - {item.endereco}, {item.cidade}</Text>
    )
  }

  function separador() {
    return (
      <View
        style={{
          margin: 4,
          height: 1,
          width: "100%",
          backgroundColor: "purple",
        }}
      />
    );
  }

  async function buscaTodosAlunos(){
    const todosAlunos = await servicoAluno.buscarTodosAlunos()
    return todosAlunos
  }

  function launchImagePicker(){
    
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.6,
    }, (response) => {
      if(response && !response.errorCode && !response?.didCancel && response?.assets?.length){
        onChangeFotoAluno(response?.assets[0]?.uri || '')
      }
    })
  }

  useEffect(() => {
    buscaTodosAlunos().then(alunos => {
      return setAlunos(alunos);
    })
  }, [])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  

  return (
    <View style={styles.container}>
      <Text>Matricula</Text>
      <TextInput value={aluno.matricula} onChangeText={onChangeMatriculaAluno} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Nome</Text>
      <TextInput value={aluno.nome} onChangeText={onChangeNomeAluno} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Endereco</Text>
      <TextInput value={aluno.endereco} onChangeText={onChangeEnderecoAluno} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Cidade</Text>
      <TextInput value={aluno.cidade} onChangeText={onChangeCidadeAluno} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Foto</Text>
      {/* <TextInput value={aluno.foto} style={{ borderColor: "transparent", borderWidth: 1, padding: 8, backgroundColor: '#ededed'}} editable={false}/> */}
      
      <TouchableOpacity onPress={launchImagePicker} style={{margin: 8, padding: 8, backgroundColor: 'rgb(33, 150, 243)'}}>
        <Text style={{color: 'white'}}>Selecione uma foto</Text>
      </TouchableOpacity>
      
      <Button onPress={onPressSalvarAluno} title={carregando ? 'Carregando' : 'Salvar aluno'} />

      <FlatList data={alunos} renderItem={renderizaAlunoFlatList} ItemSeparatorComponent={separador} keyExtractor={aluno => aluno.matricula} />
    </View>
  )
}