import { WhereFilterOp } from "firebase/firestore";
import { IAluno } from "./IAluno";

export type QueryBusca = {
   primeiroCampo: string,
   operacao: WhereFilterOp,
   segundoCampo: any
}

export interface IAlunoRepositorio{
  criar(aluno: IAluno): Promise<boolean>
  buscar(queryBusca: QueryBusca): Promise<IAluno[]>
  buscarTodosAlunos(limite?: number): Promise<IAluno[]>
}