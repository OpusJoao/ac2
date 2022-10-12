import { IAluno } from "./IAluno";

export interface IServicoAluno{ 
  criar(aluno: IAluno): boolean
}