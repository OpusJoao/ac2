import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import ServicoDisciplina from '../../services/Disciplina/ServicoDisciplina';
import DisciplinaRepositorioFirebase from '../../repositories/DisciplinaRepositorio';
import { db } from '../../database/firebase/db';
import { useEffect, useState } from 'react';
import { IDisciplina } from '../../interfaces/disciplina/IDisciplina';

export default function TelaDisciplina(){
  const servicoDisciplina = new ServicoDisciplina(new DisciplinaRepositorioFirebase(db))
  const [discipina, setDisciplina] = useState<IDisciplina>({
    cod_disc: "",
    nome_disc: "",
    carga_hor: "",
  })

  const [discipinas, setDisciplinas] = useState<IDisciplina[]>([])

  const [carregando, setCarregando] = useState(false)

  function onChangeCodDisc(input: string) {
    setDisciplina({ ...discipina, cod_disc: input })
  }

  function onChangeNomeDisc(input: string) {
    setDisciplina({ ...discipina, nome_disc: input })
  }

  function onChangeCargaHor(input: string) {
    setDisciplina({ ...discipina, carga_hor: input })
  }

  async function onPressSalvarDisciplina() {
    setCarregando(true)
    const discipinaCriado = await servicoDisciplina.criar(discipina)
    alert(discipinaCriado.msg)
    setCarregando(false)

    buscaTodosDisciplinas().then(discipinas => {
      return setDisciplinas(discipinas);
    })
  }

  function renderizaDisciplinaFlatList({item}: {item:IDisciplina}) {
    return (
      <Text>[{item?.cod_disc}] {item.nome_disc} - {item.carga_hor}h</Text>
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

  async function buscaTodosDisciplinas(){
    const todosDisciplinas = await servicoDisciplina.buscarTodasDisciplinas()
    return todosDisciplinas
  }

  useEffect(() => {
    buscaTodosDisciplinas().then(discipinas => {
      return setDisciplinas(discipinas);
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
      <Text>Código disciplina</Text>
      <TextInput value={discipina.cod_disc} onChangeText={onChangeCodDisc} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Nome</Text>
      <TextInput value={discipina.nome_disc} onChangeText={onChangeNomeDisc} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Carga horária</Text>
      <TextInput value={discipina.carga_hor} onChangeText={onChangeCargaHor} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Button onPress={onPressSalvarDisciplina} title={carregando ? 'Carregando' : 'Salvar discipina'} />

      <FlatList data={discipinas} renderItem={renderizaDisciplinaFlatList} ItemSeparatorComponent={separador} keyExtractor={discipina => discipina.cod_disc} />
    </View>
  )
}