import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import ServicoTurma from '../../services/Turma/ServicoTurma';
import TurmaRepositorioFirebase from '../../repositories/TurmaRepositorio';
import { db } from '../../database/firebase/db';
import { useEffect, useState } from 'react';
import { ITurma, ITurmaExtendida } from '../../interfaces/turma/ITurma';
import DisciplinaRepositorioFirebase from '../../repositories/DisciplinaRepositorio';
import ProfessorRepositorioFirebase from '../../repositories/ProfessorRepositorio';

export default function TelaTurma(){
  const servicoTurma = new ServicoTurma(
    new TurmaRepositorioFirebase(db),
    new DisciplinaRepositorioFirebase(db),
    new ProfessorRepositorioFirebase(db))
  const [turma, setTurma] = useState<ITurma>({
    ano: 0,
    cod_disc: "",
    cod_prof: "",
    cod_turma: "",
    horario: "",

  })

  const [turmas, setTurmas] = useState<ITurmaExtendida[]>([])

  const [carregando, setCarregando] = useState(false)

  function onChangeAno(input: string) {
    const inputToInt = parseInt(input)
    setTurma({ ...turma, ano: isNaN(inputToInt) ? 0 : inputToInt})
  }

  function onChangeCodDisc(input: string) {
    setTurma({ ...turma, cod_disc: input })
  }

  function onChangeCodProf(input: string) {
    setTurma({ ...turma, cod_prof: input })
  }
  function onChangeCodTurma(input: string) {
    setTurma({ ...turma, cod_turma: input })
  }
  function onChangeHorario(input: string) {
    setTurma({ ...turma, horario: input })
  }

  async function onPressSalvarTurma() {
    setCarregando(true)
    const turmaCriado = await servicoTurma.criar(turma)
    alert(turmaCriado.msg)
    setCarregando(false)

    buscaTodasTurmas().then(turmas => {
      setTimeout(()=> setTurmas(turmas), 1000)
    })
  }

  function renderizaTurmaFlatList({item}: {item:ITurmaExtendida}) {
    return (
      <Text>[{item?.cod_turma} - {item?.disciplina?.nome_disc}] {item?.horario} - {item?.ano}, {item?.professor?.nome}</Text>
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
    buscaTodasTurmas().then(turmas => {
      setTimeout(()=> setTurmas(turmas), 1000)
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
      <Text>Código turma</Text>
      <TextInput value={turma.cod_turma} onChangeText={onChangeCodTurma} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Horario</Text>
      <TextInput value={turma.horario} onChangeText={onChangeHorario} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Ano</Text>
      <TextInput value={turma.ano.toString()} onChangeText={onChangeAno} keyboardType="numeric" style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Código Disciplina</Text>
      <TextInput value={turma.cod_disc} onChangeText={onChangeCodDisc} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Código Professor</Text>
      <TextInput value={turma.cod_prof} onChangeText={onChangeCodProf} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Button onPress={onPressSalvarTurma} title={carregando ? 'Carregando' : 'Salvar turma'} />
      <FlatList data={turmas} renderItem={renderizaTurmaFlatList} ItemSeparatorComponent={separador} keyExtractor={turma => turma.cod_turma} />
    </View>
  )
}