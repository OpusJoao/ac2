import { addDoc, collection, doc, Firestore, getDocs, setDoc } from "firebase/firestore";
import { IAluno } from "../interfaces/aluno/IAluno";
import { IAlunoRepositorio } from "../interfaces/aluno/IAlunoRepositorio";

export default class AlunoRepositorioFirebase implements IAlunoRepositorio{
  
  constructor(private readonly db: Firestore){}
  
  async criar(aluno: IAluno): Promise<{id: string}> {
    try{
      const alunoCriado = await addDoc(collection(this.db, 'Aluno'), aluno)
      return {
        id: alunoCriado.id
      }
    }catch(e: any){
      console.error(`[AlunoRepositorioFirebase.criar] Erro ao criar aluno`, aluno, e)
      throw e
    }
  }
  
}