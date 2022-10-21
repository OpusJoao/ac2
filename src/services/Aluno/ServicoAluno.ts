import { collection, getDocs } from "firebase/firestore";
import { IAluno } from "../../interfaces/aluno/IAluno";
import { IAlunoRepositorio, QueryBusca } from "../../interfaces/aluno/IAlunoRepositorio";
import { IServicoAluno } from "../../interfaces/aluno/IServicoAluno";
import ValidaAluno from "./ValidaAluno";
export default class ServicoAluno implements IServicoAluno{
  
  constructor(private readonly alunoRepositorio: IAlunoRepositorio){}
  async criar(aluno: IAluno): Promise<{ succeso: boolean, msg: string } >{
    let alunoFoiCriado: boolean = false
    let mensagem: string = ""
    const alunoValido = ValidaAluno.VerificaAlunoValido(aluno)
    
    if(!alunoValido){
      mensagem = "Erro ao criar aluno, aluno inválido"
      console.error(`[ServicoAluno.criar] ${mensagem}`)

      return {
        succeso: alunoFoiCriado,
        msg: mensagem
      }
    }
    try{
      if(await this.verificaSeMatriculaJaEstaCadastrada(aluno.matricula)){
        mensagem = "Matricula ja cadastrada"
        console.error(`[ServicoAluno.criar] ${mensagem}`)
        return {
          succeso: alunoFoiCriado,
          msg: mensagem
        }  
      }
      alunoFoiCriado = await this.alunoRepositorio.criar(aluno)
    }catch(e: any){
      console.error("[ServicoAluno.criar] Erro ao criar aluno", e)
      alunoFoiCriado = false
      throw e
    }
    
    mensagem = "Aluno criado com sucesso"
    console.log(`[ServicoAluno.criar] ${mensagem}`)
    return {
      succeso: alunoFoiCriado,
      msg: mensagem
    }
  }

  async verificaSeMatriculaJaEstaCadastrada(matricula: string): Promise<boolean>{
    const opcoesParaBusca: QueryBusca = {primeiroCampo: "matricula", operacao: "==", segundoCampo: matricula}
    const alunosEncontrados = await this.alunoRepositorio.buscar(opcoesParaBusca)
    return alunosEncontrados.length > 0 
  }

  async buscarTodosAlunos(limite: number = -1): Promise<IAluno[]> {
    const todosAlunos = await this.alunoRepositorio.buscarTodosAlunos()
    return todosAlunos
  }

  async buscar(queryBusca: QueryBusca): Promise<IAluno[]>{
    const alunosEncontrados = await this.alunoRepositorio.buscar(queryBusca)
    return alunosEncontrados
  }
  
}