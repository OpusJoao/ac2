import { WhereFilterOp } from "firebase/firestore";
import { ITurma } from "./ITurma";

export type QueryBusca = {
   primeiroCampo: string,
   operacao: WhereFilterOp,
   segundoCampo: any
}

export interface ITurmaRepositorio{
  criar(professor: ITurma): Promise<boolean>
  buscar(queryBusca: QueryBusca): Promise<ITurma[]>
  buscarTodasTurmas(limite?: number): Promise<ITurma[]>
}