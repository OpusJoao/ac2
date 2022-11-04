import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import ServicoTurma from '../../services/Turma/ServicoTurma';
import TurmaRepositorioFirebase from '../../repositories/TurmaRepositorio';
import { db } from '../../database/firebase/db';
import { useEffect, useState } from 'react';
import { ITurma, ITurmaExtendida } from '../../interfaces/turma/ITurma';
import DisciplinaRepositorioFirebase from '../../repositories/DisciplinaRepositorio';
import ProfessorRepositorioFirebase from '../../repositories/ProfessorRepositorio';

export default function TelaVisualizarTurma(props: any){
  const servicoTurma = new ServicoTurma(
    new TurmaRepositorioFirebase(db),
    new DisciplinaRepositorioFirebase(db),
    new ProfessorRepositorioFirebase(db))

  const [turmas, setTurmas] = useState<ITurmaExtendida[]>([])

  const [carregando, setCarregando] = useState(false)


  function renderizaTurmaFlatList({item}: {item:ITurmaExtendida}) {
    return (
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
        <Text>[{item?.cod_turma} - {item?.disciplina?.nome_disc}] {item?.horario} - {item?.ano}, {item?.professor?.nome}</Text>
        <Button title='mais info' onPress={()=> props.navigation.navigate('VisualizarTurmaMaisInformacoes', {turma: item})}/>
      </View>
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

  async function buscaTodasTurmas(){
    const todasTurmas = await servicoTurma.buscarTodasTurmasExtendido()
    return todasTurmas
  }

  useEffect(() => {
    setCarregando(true)
    buscaTodasTurmas().then(turmas => {
      setTimeout(()=> setTurmas(turmas), 1000)
    })
    setCarregando(false)
  }, [])

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {carregando && <Text>Carregando...</Text>}
      {!carregando && <FlatList data={turmas} renderItem={renderizaTurmaFlatList} ItemSeparatorComponent={separador} keyExtractor={turma => turma.cod_turma} />}
    </View>
  )
}