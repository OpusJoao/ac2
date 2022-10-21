import { IDisciplina } from "./IDisciplina";

export interface IServicoDisciplina{ 
  criar(disciplina: IDisciplina): Promise<{ succeso: boolean, msg: string }>
  buscarTodasDisciplinas(limite: number): Promise<IDisciplina[]>
  verificarCodigoJaCadastrado(cod_disc: string): Promise<boolean>
}