import { WhereFilterOp } from "firebase/firestore";
import { IHistorico } from "./IHistorico";

export type QueryBusca = {
   primeiroCampo: string,
   operacao: WhereFilterOp,
   segundoCampo: any
}

export interface IHistoricoRepositorio{
  criar(historico: IHistorico): Promise<boolean>
  buscar(queryBusca: QueryBusca): Promise<IHistorico[]>
  buscarTodosHistoricos(limite?: number): Promise<IHistorico[]>
  alterar(cod_historico: string, historico: IHistorico): Promise<boolean>
  deletar(cod_historico: string): Promise<boolean>
}