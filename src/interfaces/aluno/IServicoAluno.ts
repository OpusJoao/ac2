import { IAluno } from "./IAluno";
import { QueryBusca } from "./IAlunoRepositorio";

export interface IServicoAluno{ 
  criar(aluno: IAluno): Promise<{ succeso: boolean, msg: string }>
  buscarTodosAlunos(limite: number): Promise<IAluno[]>
  verificaSeMatriculaJaEstaCadastrada(matricula: string): Promise<boolean>
  buscar(queryBusca: QueryBusca): Promise<IAluno[]>
}