import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ServicoHistorico from '../../services/Historico/ServicoHistorico';
import HistoricoRepositorioFirebase from '../../repositories/HistoricoRepositorio';
import { db } from '../../database/firebase/db';
import { useContext, useEffect, useState } from 'react';
import { IHistorico, IHistoricoExtendido } from '../../interfaces/historico/IHistorico';
import TurmaRepositorioFirebase from '../../repositories/TurmaRepositorio';
import AlunoRepositorioFirebase from '../../repositories/AlunoRepositorioFirebase';
import ServicoTurma from '../../services/Turma/ServicoTurma';
import ServicoAluno from '../../services/Aluno/ServicoAluno';
import DisciplinaRepositorioFirebase from '../../repositories/DisciplinaRepositorio';
import ProfessorRepositorioFirebase from '../../repositories/ProfessorRepositorio';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ConfirmProvider, useConfirm } from 'react-native-confirm-dialog';
import ContextoFundo from '../../context/contextoFundo';
export default function TelaHistorico(){
  const {fundo, setFundo} = useContext(ContextoFundo)

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

  const [historicos, setHistoricos] = useState<IHistoricoExtendido[] | undefined >([])

  const [carregando, setCarregando] = useState(false)

  const [editando, setEditando] = useState(false)

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
    let historicoCriado
    setCarregando(true)
    if(editando){
      setEditando(false)

      historicoCriado = await servicoHistorico.alterar(historico)
    }else{
      historicoCriado = await servicoHistorico.criar(historico)
    }

    alert(historicoCriado.msg)
    limparStateHistorico()
    buscaTodasHistoricos().then(historicos => {
      if(historico){
        setTimeout(()=> setHistoricos(historicos), 1000)
      }
    })
  setCarregando(false)
  }

  function renderizaHistoricoFlatList({item}: {item:IHistoricoExtendido}) {
    
    return (
      <View style={{display: 'flex', flexDirection: 'row', maxWidth: '400', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={{maxWidth: '350', marginRight: 8}}>[{item?.cod_historico}][{item?.aluno?.matricula} {item?.aluno?.nome}] cod_turma: {item?.turma.cod_turma} freq: {item?.frequencia}%  nota: {item?.nota}</Text>
        <TouchableOpacity  onPress={()=>{aoClicarEditar(item)}}><Icon name="edit" size={24} color="#5074eb" /></TouchableOpacity> 
        <DeleteButton historico={item}></DeleteButton>
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

  async function buscaTodasHistoricos(){
    try{
      const todosHistoricos = await servicoHistorico.buscarTodosHistoricosExtendido()
      return todosHistoricos
    }catch(e){
      console.error(e)
    }
  }

  async function buscaHistoricoPorCodigo(cod_historico = ''){
    try{
      const historico = await servicoHistorico.buscar({ primeiroCampo: 'cod_historico', operacao: '==', segundoCampo: cod_historico })
      return historico
    }catch(e){
      console.error(e)
    }
  }

  async function deletarHistorico(cod_historico: string){
    try{
      const historicoFoiDeletado = await servicoHistorico.deletar(cod_historico)
      return historicoFoiDeletado
    }catch(e){
      console.error(e)
    }
  }

  function retornaTituloDoBotaoSalvar(){
    let title = 'SALVAR HISTORICO'
    if(carregando){
      title = 'Carregando'
    }

    if(editando){
      title = 'Alterar historico'
    }

    return title
  }

  async function aoClicarEditar(historico: IHistoricoExtendido){
    setEditando(true)
    const historicoEncontrado = await buscaHistoricoPorCodigo(historico.cod_historico)
    if(historicoEncontrado){
      setHistorico({
        cod_historico: historicoEncontrado[0].cod_historico,
        cod_turma: historicoEncontrado[0].cod_turma,
        frequencia: historicoEncontrado[0].frequencia,
        matricula: historicoEncontrado[0].matricula,
        nota: historicoEncontrado[0].nota,
      })
    }
  }

  async function aoClicarDeletar(historico: IHistoricoExtendido){
    setCarregando(true)
    const historicoDeletado = await deletarHistorico(historico.cod_historico)
    if(historicoDeletado){
      limparStateHistorico()
      populaHistorico()
    }
    setCarregando(false)
    
  }

  function limparStateHistorico(){
    setHistorico({
      cod_historico: '',
      cod_turma: '',
      frequencia: 0,
      matricula: '',
      nota: 0
    })
  }

  function DeleteButton ({historico}:{historico: IHistoricoExtendido}) {
    const confirm = useConfirm()
    const handlePress = () => {
      confirm({
      title: 'Deseja deletar o historico de cód: ' + historico.cod_historico,
      onConfirm: ()=>{
        aoClicarDeletar(historico)
      }
      })
    }
    
    return <Button onPress={ handlePress } title='Deletar' />
  }

  function populaHistorico(){
    buscaTodasHistoricos().then(historicos => {
      if(historico){
        setTimeout(()=> setHistoricos(historicos), 1000)
      }
    })
  }

  useEffect(() => {
    populaHistorico()
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
    <ConfirmProvider>
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
      <Button onPress={onPressSalvarHistorico} title={retornaTituloDoBotaoSalvar()} />
      <FlatList data={historicos} renderItem={renderizaHistoricoFlatList} ItemSeparatorComponent={separador} keyExtractor={historico => historico.cod_historico} />
    </View>
    </ConfirmProvider>
    
  )
}