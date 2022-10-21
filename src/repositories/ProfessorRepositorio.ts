import { addDoc, collection, doc, Firestore, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { IProfessor } from "../interfaces/professor/IProfessor";
import { IProfessorRepositorio, QueryBusca } from "../interfaces/professor/IProfessorRepositorio";

export default class ProfessorRepositorioFirebase implements IProfessorRepositorio{
  
  constructor(private readonly db: Firestore){}
  
  async criar(professor: IProfessor): Promise<boolean> {
    try{
      await setDoc(doc(this.db, 'Professor',professor.cod_prof), professor)
      return true
    }catch(e: any){
      console.error(`[ProfessorRepositorioFirebase.criar] Erro ao criar professor`, professor, e)
      throw e
    }
  }

  async buscar(queryBusca: QueryBusca): Promise<IProfessor[]> {
    const professorsAchadas: IProfessor[] = []
    const queryParaBuscar = query(collection(this.db, 'Professor'), where(queryBusca.primeiroCampo, queryBusca.operacao, queryBusca.segundoCampo))
    const dados = await getDocs(queryParaBuscar)
    dados.forEach(documento => {
      const dadosDoDocumento = documento.data()
      professorsAchadas.push({
        cod_prof: dadosDoDocumento?.cod_prof,
        nome: dadosDoDocumento?.nome,
        endereco: dadosDoDocumento?.endereco,
        cidade: dadosDoDocumento?.cidade,
      })
    })

    return professorsAchadas
  }
  
async buscarTodosProfessores(limite: number = -1): Promise<IProfessor[]>{
  let professorsAchadas: IProfessor[] = []
  const documentos = limite > -1 ? 
    await getDocs(query(collection(this.db, 'Professor'), limit(limite))) :
    await getDocs(collection(this.db, 'Professor'))

  documentos.forEach(documento => {
    const dadosDoDocumento = documento.data()
      professorsAchadas.push({
        cod_prof: dadosDoDocumento?.cod_prof,
        nome: dadosDoDocumento?.nome,
        endereco: dadosDoDocumento?.endereco,
        cidade: dadosDoDocumento?.cidade,
      })
  })

  return professorsAchadas
}

}