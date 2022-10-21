import { addDoc, collection, doc, Firestore, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { IHistorico } from "../interfaces/historico/IHistorico";
import { IHistoricoRepositorio, QueryBusca } from "../interfaces/historico/IHistoricoRepositorio";

export default class HistoricoRepositorioFirebase implements IHistoricoRepositorio{
  
  constructor(private readonly db: Firestore){}
  
  async criar(historico: IHistorico): Promise<boolean> {
    try{
      await setDoc(doc(this.db, 'Historico',historico.cod_historico), historico)
      return true
    }catch(e: any){
      console.error(`[HistoricoRepositorioFirebase.criar] Erro ao criar historico`, historico, e)
      throw e
    }
  }

  async buscar(queryBusca: QueryBusca): Promise<IHistorico[]> {
    const historicosAchadas: IHistorico[] = []
    const queryParaBuscar = query(collection(this.db, 'Historico'), where(queryBusca.primeiroCampo, queryBusca.operacao, queryBusca.segundoCampo))
    const dados = await getDocs(queryParaBuscar)
    dados.forEach(documento => {
      const dadosDoDocumento = documento.data()
      historicosAchadas.push({
        cod_historico: dadosDoDocumento?.cod_historico,
        cod_turma: dadosDoDocumento?.cod_turma,
        frequencia: dadosDoDocumento?.frequencia,
        matricula: dadosDoDocumento?.matricula,
        nota: dadosDoDocumento?.nota,
      })
    })

    return historicosAchadas
  }
  
async buscarTodosHistoricos(limite: number = -1): Promise<IHistorico[]>{
  let historicosAchadas: IHistorico[] = []
  const documentos = limite > -1 ? 
    await getDocs(query(collection(this.db, 'Historico'), limit(limite))) :
    await getDocs(collection(this.db, 'Historico'))

  documentos.forEach(documento => {
    const dadosDoDocumento = documento.data()
      historicosAchadas.push({
        cod_historico: dadosDoDocumento?.cod_historico,
        cod_turma: dadosDoDocumento?.cod_turma,
        frequencia: dadosDoDocumento?.frequencia,
        matricula: dadosDoDocumento?.matricula,
        nota: dadosDoDocumento?.nota,
      })
  })

  return historicosAchadas
}

}