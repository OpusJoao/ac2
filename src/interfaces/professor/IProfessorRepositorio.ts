import { WhereFilterOp } from "firebase/firestore";
import { IProfessor } from "./IProfessor";

export type QueryBusca = {
   primeiroCampo: string,
   operacao: WhereFilterOp,
   segundoCampo: any
}

export interface IProfessorRepositorio{
  criar(professor: IProfessor): Promise<boolean>
  buscar(queryBusca: QueryBusca): Promise<IProfessor[]>
  buscarTodosProfessores(limite?: number): Promise<IProfessor[]>
}