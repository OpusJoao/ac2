import { addDoc, collection, doc, Firestore, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { IAluno } from "../interfaces/aluno/IAluno";
import { IAlunoRepositorio, QueryBusca } from "../interfaces/aluno/IAlunoRepositorio";

export default class AlunoRepositorioFirebase implements IAlunoRepositorio{
  
  constructor(private readonly db: Firestore){}
  
  async criar(aluno: IAluno): Promise<boolean> {
    try{
      const alunoCriado = await setDoc(doc(this.db, 'Aluno',aluno.matricula), aluno)
      return true
    }catch(e: any){
      console.error(`[AlunoRepositorioFirebase.criar] Erro ao criar aluno`, aluno, e)
      throw e
    }
  }

  async buscar(queryBusca: QueryBusca): Promise<IAluno[]> {
    const alunosAchados: IAluno[] = []
    const queryParaBuscar = query(collection(this.db, 'Aluno'), where(queryBusca.primeiroCampo, queryBusca.operacao, queryBusca.segundoCampo))
    const dados = await getDocs(queryParaBuscar)
    dados.forEach(documento => {
      const dadosDoDocumento = documento.data()
      alunosAchados.push({
        cidade: dadosDoDocumento?.cidade,
        endereco: dadosDoDocumento?.endereco,
        foto: dadosDoDocumento?.foto,
        matricula: dadosDoDocumento?.matricula,
        nome: dadosDoDocumento?.nome
      })
    })

    return alunosAchados
  }
  
async buscarTodosAlunos(limite: number = -1): Promise<IAluno[]>{
  let alunosAchados: IAluno[] = []
  const documentos = limite > -1 ? 
    await getDocs(query(collection(this.db, 'Aluno'), limit(limite))) :
    await getDocs(collection(this.db, 'Aluno'))

  documentos.forEach(documento => {
    const dadosDoDocumento = documento.data()
      alunosAchados.push({
        cidade: dadosDoDocumento?.cidade,
        endereco: dadosDoDocumento?.endereco,
        foto: dadosDoDocumento?.foto,
        matricula: dadosDoDocumento?.matricula,
        nome: dadosDoDocumento?.nome
      })
  })

  return alunosAchados
}

}