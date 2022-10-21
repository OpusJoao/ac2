import { addDoc, collection, doc, Firestore, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { ITurma } from "../interfaces/turma/ITurma";
import { ITurmaRepositorio, QueryBusca } from "../interfaces/turma/ITurmaRepositorio";

export default class TurmaRepositorioFirebase implements ITurmaRepositorio{
  
  constructor(private readonly db: Firestore){}
  
  async criar(turma: ITurma): Promise<boolean> {
    try{
      await setDoc(doc(this.db, 'Turma',turma.cod_turma), turma)
      return true
    }catch(e: any){
      console.error(`[TurmaRepositorioFirebase.criar] Erro ao criar turma`, turma, e)
      throw e
    }
  }

  async buscar(queryBusca: QueryBusca): Promise<ITurma[]> {
    const turmasAchadas: ITurma[] = []
    const queryParaBuscar = query(collection(this.db, 'Turma'), where(queryBusca.primeiroCampo, queryBusca.operacao, queryBusca.segundoCampo))
    const dados = await getDocs(queryParaBuscar)
    dados.forEach(documento => {
      const dadosDoDocumento = documento.data()
      turmasAchadas.push({
        ano: dadosDoDocumento?.ano,
        cod_disc: dadosDoDocumento?.cod_disc,
        cod_prof: dadosDoDocumento?.cod_prof,
        cod_turma: dadosDoDocumento?.cod_turma,
        horario: dadosDoDocumento?.horario,

      })
    })

    return turmasAchadas
  }
  
async buscarTodasTurmas(limite: number = -1): Promise<ITurma[]>{
  let turmasAchadas: ITurma[] = []
  const documentos = limite > -1 ? 
    await getDocs(query(collection(this.db, 'Turma'), limit(limite))) :
    await getDocs(collection(this.db, 'Turma'))

  documentos.forEach(documento => {
    const dadosDoDocumento = documento.data()
      turmasAchadas.push({
        ano: dadosDoDocumento?.ano,
        cod_disc: dadosDoDocumento?.cod_disc,
        cod_prof: dadosDoDocumento?.cod_prof,
        cod_turma: dadosDoDocumento?.cod_turma,
        horario: dadosDoDocumento?.horario,

      })
  })

  return turmasAchadas
}

}