import { IAluno } from "./IAluno";

export interface IAlunoRepositorio{
  criar(aluno: IAluno): boolean
}