import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import ServicoProfessor from '../../services/Professor/ServicoProfessor';
import ProfessorRepositorioFirebase from '../../repositories/ProfessorRepositorio';
import db from '../../database/firebase/db';
import { useEffect, useState } from 'react';
import { IProfessor } from '../../interfaces/professor/IProfessor';

export default function TelaProfessor(){
  const servicoProfessor = new ServicoProfessor(new ProfessorRepositorioFirebase(db))
  const [professor, setProfessor] = useState<IProfessor>({
    cidade: "",
    cod_prof: "",
    endereco: "",
    nome: "",
  })

  const [professores, setProfessors] = useState<IProfessor[]>([])

  const [carregando, setCarregando] = useState(false)

  function onChangeCidade(input: string) {
    setProfessor({ ...professor, cidade: input })
  }

  function onChangeCodProf(input: string) {
    setProfessor({ ...professor, cod_prof: input })
  }

  function onChangeEndereco(input: string) {
    setProfessor({ ...professor, endereco: input })
  }
  function onChangeNome(input: string) {
    setProfessor({ ...professor, nome: input })
  }

  async function onPressSalvarProfessor() {
    setCarregando(true)
    const professorCriado = await servicoProfessor.criar(professor)
    alert(professorCriado.msg)
    setCarregando(false)

    buscaTodosProfessores().then(professores => {
      return setProfessors(professores);
    })
  }

  function renderizaProfessorFlatList({item}: {item:IProfessor}) {
    return (
      <Text>[{item.cod_prof}] {item.nome} - {item.endereco}, {item.cidade}</Text>
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

  async function buscaTodosProfessores(){
    const todosProfessors = await servicoProfessor.buscarTodosProfessores()
    return todosProfessors
  }

  useEffect(() => {
    buscaTodosProfessores().then(professores => {
      return setProfessors(professores);
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
      <Text>Código professor</Text>
      <TextInput value={professor.cod_prof} onChangeText={onChangeCodProf} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Nome</Text>
      <TextInput value={professor.nome} onChangeText={onChangeNome} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Cidade</Text>
      <TextInput value={professor.cidade} onChangeText={onChangeCidade} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Endereço</Text>
      <TextInput value={professor.endereco} onChangeText={onChangeEndereco} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Button onPress={onPressSalvarProfessor} title={carregando ? 'Carregando' : 'Salvar professor'} />

      <FlatList data={professores} renderItem={renderizaProfessorFlatList} ItemSeparatorComponent={separador} keyExtractor={professor => professor.cod_prof} />
    </View>
  )
}