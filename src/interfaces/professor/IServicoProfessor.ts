import { IProfessor } from "./IProfessor";

export interface IServicoProfessor{ 
  criar(aluno: IProfessor): Promise<{ succeso: boolean, msg: string }>
  buscarTodosProfessores(limite: number): Promise<IProfessor[]>
  verificaSeProfessorExiste(cod_prof: string): Promise<boolean>
}