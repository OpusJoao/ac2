import { ActivityIndicator, Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import ServicoTurma from '../../services/Turma/ServicoTurma';
import TurmaRepositorioFirebase from '../../repositories/TurmaRepositorio';
import { db } from '../../database/firebase/db';
import { useContext, useEffect, useState } from 'react';
import { ITurma, ITurmaExtendida } from '../../interfaces/turma/ITurma';
import DisciplinaRepositorioFirebase from '../../repositories/DisciplinaRepositorio';
import ProfessorRepositorioFirebase from '../../repositories/ProfessorRepositorio';
import ServicoHistorico from '../../services/Historico/ServicoHistorico';
import HistoricoRepositorioFirebase from '../../repositories/HistoricoRepositorio';
import ServicoAluno from '../../services/Aluno/ServicoAluno';
import AlunoRepositorioFirebase from '../../repositories/AlunoRepositorioFirebase';
import { IHistorico } from '../../interfaces/historico/IHistorico';
import { IAluno } from '../../interfaces/aluno/IAluno';
import ContextoFundo from '../../context/contextoFundo';

export default function TelaVisualizarTurmaMaisInformacoes(props: any){
  const {fundo, setFundo} = useContext(ContextoFundo)

  const servicoTurma = new ServicoTurma(
    new TurmaRepositorioFirebase(db),
    new DisciplinaRepositorioFirebase(db),
    new ProfessorRepositorioFirebase(db))

  const servicoAluno = new ServicoAluno(new AlunoRepositorioFirebase(db))
  const servicoHistorico = new ServicoHistorico(
    new HistoricoRepositorioFirebase(db),
    servicoTurma,
    servicoAluno
  )

  const [carregando, setCarregando] = useState(false)

  const [alunos, setAlunos] = useState<IAluno[]>([])

  const [temTimeout, setTemTimeout] = useState(false)


  function renderizaAlunosFlatList({item}: {item:IAluno}) {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around', 
        alignItems: 'center',  
        backgroundColor: '#ededed',
        margin: 8,
        padding: 16}}>
        <Image
            style={{ width: 100, height: 100 }}
            source={{
              uri: item.foto,
            }}
            defaultSource={{
              uri: "https://cdn-icons-png.flaticon.com/512/892/892781.png?w=360",
            }}
          />

        <Button title={item.nome} onPress={()=> props.navigation.navigate('VisualizarAluno', {aluno: item})}/>

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

  async function buscaHistoricoPorTurma(cod_turma: string){
    const historicosEncontrados = await servicoHistorico.buscar({
      primeiroCampo: 'cod_turma',
      operacao: '==',
      segundoCampo: cod_turma
    })
  return historicosEncontrados
  }

  async function buscaAlunoPorHistorico(): Promise<IAluno[]>{  
    return new Promise(async (resolve, reject) => {
      let todosAlunos: IAluno[] = []
      setTimeout(()=>reject('timeout'), 10 * 1000)
      
      const historicos = await buscaHistoricoPorTurma(props?.route?.params?.turma?.cod_turma)
      if(historicos.length == 0 ) reject('semHistorico')
      historicos.map(async (historico) => {
        let alunoEncontrado = await servicoAluno.buscar({
          primeiroCampo: 'matricula',
          operacao: '==',
          segundoCampo: historico.matricula
        });
        if (alunoEncontrado.length) {
          todosAlunos.push({
            cidade: alunoEncontrado[0].cidade,
            endereco: alunoEncontrado[0].endereco,
            foto: alunoEncontrado[0].foto,
            matricula: alunoEncontrado[0].matricula,
            nome: alunoEncontrado[0].nome
          });
        }
      })

        resolve(todosAlunos)
    })

  }

  function aoClicarEmTenteNovamente(){
    props.navigation.replace('VisualizarTurmaMaisInformacoes', {turma: props.route.params.turma})
  }

  useEffect(() => {
    setCarregando(true)
    buscaAlunoPorHistorico().then(alunos => {
      setTimeout(() => {
        setAlunos(alunos)
        setCarregando(false)
      }, 1000);
    }).catch(error=>{
      setCarregando(false)
      if(error == 'semHistorico'){
        alert('Turma n??o possui historico!')
        return
      }
      setTemTimeout(true) 
    })
  }, [])

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
      backgroundColor: `${fundo}`,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {carregando && <ActivityIndicator size={'large'}/>}
      <SafeAreaView>
        {!carregando && <FlatList numColumns={3} data={alunos} renderItem={renderizaAlunosFlatList} ItemSeparatorComponent={separador} keyExtractor={aluno => aluno.matricula} />}
        {temTimeout && <View>
            <Text>Tempo de 10 segundos  expirado!</Text>
            <Button onPress={aoClicarEmTenteNovamente} title='Tentar novamente'/>
          </View>}
      </SafeAreaView>
    </View>
  )
}