import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import ServicoHistorico from '../../services/Historico/ServicoHistorico';
import HistoricoRepositorioFirebase from '../../repositories/HistoricoRepositorio';
import db from '../../database/firebase/db';
import { useEffect, useState } from 'react';
import { IHistorico, IHistoricoExtendido } from '../../interfaces/historico/IHistorico';
import TurmaRepositorioFirebase from '../../repositories/TurmaRepositorio';
import AlunoRepositorioFirebase from '../../repositories/AlunoRepositorioFirebase';
import ServicoTurma from '../../services/Turma/ServicoTurma';
import ServicoAluno from '../../services/Aluno/ServicoAluno';
import DisciplinaRepositorioFirebase from '../../repositories/DisciplinaRepositorio';
import ProfessorRepositorioFirebase from '../../repositories/ProfessorRepositorio';

export default function TelaHistorico(){
  const servicoHistorico = new ServicoHistorico(
    new HistoricoRepositorioFirebase(db),
    new ServicoTurma(new TurmaRepositorioFirebase(db), new DisciplinaRepositorioFirebase(db), new ProfessorRepositorioFirebase(db)),
    new ServicoAluno(new AlunoRepositorioFirebase(db))
    )
  const [historico, setHistorico] = useState<IHistorico>({
    cod_historico: "",
    cod_turma: "",
    frequencia: 0,
    matricula: "",
    nota: 0
  })

  const [historicos, setHistoricos] = useState<IHistoricoExtendido[]>([])

  const [carregando, setCarregando] = useState(false)

  function onChangeFrequencia(input: string) {
    const inputToInt = parseInt(input)
    setHistorico({ ...historico, frequencia: isNaN(inputToInt) ? 0 : inputToInt})
  }

  function onChangeCodTurma(input: string) {
    setHistorico({ ...historico, cod_turma: input })
  }

  function onChangeMatricula(input: string) {
    setHistorico({ ...historico, matricula: input })
  }
  function onChangeCodHistorico(input: string) {
    setHistorico({ ...historico, cod_historico: input })
  }
  function onChangeNota(input: string) {
    const inputToInt = parseInt(input)
    setHistorico({ ...historico, nota: isNaN(inputToInt) ? 0 : inputToInt })
  }

  async function onPressSalvarHistorico() {
    setCarregando(true)
    const historicoCriado = await servicoHistorico.criar(historico)
    alert(historicoCriado.msg)
    setCarregando(false)

    buscaTodasHistoricos().then(historicos => {
      if(historico){
        setTimeout(()=> setHistoricos(historicos), 1000)
      }
    })
  }

  function renderizaHistoricoFlatList({item}: {item:IHistoricoExtendido}) {
    return (
      <Text>[{item?.cod_historico}][{item?.aluno?.matricula} {item?.aluno?.nome}] cod_turma: {item?.turma.cod_turma} freq: {item?.frequencia}%  nota: {item?.nota}</Text>
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

  async function buscaTodasHistoricos(){
    try{
      const todosHistoricos = await servicoHistorico.buscarTodosHistoricosExtendido()
      return todosHistoricos
    }catch(e){
      console.error(e)
    }
  }

  useEffect(() => {
    buscaTodasHistoricos().then(historicos => {
      if(historico){
        setTimeout(()=> setHistoricos(historicos), 1000)
      }
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
      <Text>Código historico</Text>
      <TextInput value={historico.cod_historico} onChangeText={onChangeCodHistorico} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Código turma</Text>
      <TextInput value={historico.cod_turma} onChangeText={onChangeCodTurma} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Frequencia</Text>
      <TextInput value={historico.frequencia.toString()} onChangeText={onChangeFrequencia} keyboardType="numeric" style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Matricula Aluno</Text>
      <TextInput value={historico.matricula} onChangeText={onChangeMatricula} style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Text>Nota</Text>
      <TextInput value={historico.nota.toString()} onChangeText={onChangeNota} keyboardType="numeric" style={{ borderColor: "#666", borderWidth: 1, padding: 8 }} />
      <Button onPress={onPressSalvarHistorico} title={carregando ? 'Carregando' : 'Salvar historico'} />
      <FlatList data={historicos} renderItem={renderizaHistoricoFlatList} ItemSeparatorComponent={separador} keyExtractor={historico => historico.cod_historico} />
    </View>
  )
}