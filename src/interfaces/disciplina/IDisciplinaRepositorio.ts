import { WhereFilterOp } from "firebase/firestore";
import { IDisciplina } from "./IDisciplina";

export type QueryBusca = {
   primeiroCampo: string,
   operacao: WhereFilterOp,
   segundoCampo: any
}

export interface IDisciplinaRepositorio{
  criar(aluno: IDisciplina): Promise<boolean>
  buscar(queryBusca: QueryBusca): Promise<IDisciplina[]>
  buscarTodasDisciplinas(limite?: number): Promise<IDisciplina[]>
}