import { addDoc, collection, doc, Firestore, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { IDisciplina } from "../interfaces/disciplina/IDisciplina";
import { IDisciplinaRepositorio, QueryBusca } from "../interfaces/disciplina/IDisciplinaRepositorio";

export default class DisciplinaRepositorioFirebase implements IDisciplinaRepositorio{
  
  constructor(private readonly db: Firestore){}
  
  async criar(disciplina: IDisciplina): Promise<boolean> {
    try{
      await setDoc(doc(this.db, 'Disciplina',disciplina.cod_disc), disciplina)
      return true
    }catch(e: any){
      console.error(`[DisciplinaRepositorioFirebase.criar] Erro ao criar disciplina`, disciplina, e)
      throw e
    }
  }

  async buscar(queryBusca: QueryBusca): Promise<IDisciplina[]> {
    const disciplinasAchadas: IDisciplina[] = []
    const queryParaBuscar = query(collection(this.db, 'Disciplina'), where(queryBusca.primeiroCampo, queryBusca.operacao, queryBusca.segundoCampo))
    const dados = await getDocs(queryParaBuscar)
    dados.forEach(documento => {
      const dadosDoDocumento = documento.data()
      disciplinasAchadas.push({
       cod_disc: dadosDoDocumento?.cod_disc,
       carga_hor: dadosDoDocumento?.carga_hor,
       nome_disc: dadosDoDocumento?.nome_disc
      })
    })

    return disciplinasAchadas
  }
  
async buscarTodasDisciplinas(limite: number = -1): Promise<IDisciplina[]>{
  let disciplinasAchadas: IDisciplina[] = []
  const documentos = limite > -1 ? 
    await getDocs(query(collection(this.db, 'Disciplina'), limit(limite))) :
    await getDocs(collection(this.db, 'Disciplina'))

  documentos.forEach(documento => {
    const dadosDoDocumento = documento.data()
      disciplinasAchadas.push({
        cod_disc: dadosDoDocumento?.cod_disc,
        carga_hor: dadosDoDocumento?.carga_hor,
        nome_disc: dadosDoDocumento?.nome_disc
       })
  })

  return disciplinasAchadas
}

}