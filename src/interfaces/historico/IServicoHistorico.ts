import { IHistorico, IHistoricoExtendido } from "./IHistorico";
import { QueryBusca } from "./IHistoricoRepositorio";

export interface IServicoHistorico{ 
  criar(aluno: IHistorico): Promise<{ succeso: boolean, msg: string }>
  buscarTodosHistoricos(limite: number): Promise<IHistorico[]>
  verificaSeHistoricoExiste(cod_historico: string): Promise<boolean>
  buscarTodosHistoricosExtendido(limite: number): Promise<IHistoricoExtendido[]>
  buscar(queryBusca: QueryBusca): Promise<IHistorico[]>
}