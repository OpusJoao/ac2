import { IAluno } from "../aluno/IAluno"
import { ITurma } from "../turma/ITurma"

export interface IHistorico{
  cod_historico: string,
  matricula: string,
  cod_turma: string,
  frequencia: number,
  nota: number
}

export interface IHistoricoExtendido extends IHistorico{
  aluno: IAluno
  turma: ITurma
}