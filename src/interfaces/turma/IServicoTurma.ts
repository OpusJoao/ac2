import { ITurma } from "./ITurma";
import { QueryBusca } from "./ITurmaRepositorio";

export interface IServicoTurma{ 
  criar(aluno: ITurma): Promise<{ succeso: boolean, msg: string }>
  buscarTodasTurmas(limite: number): Promise<ITurma[]>
  verificaSeTurmaExiste(cod_turma: string): Promise<boolean>
  buscar(queryBusca: QueryBusca): Promise<ITurma[]>
}