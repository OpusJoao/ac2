import { IDisciplina } from "../disciplina/IDisciplina"
import { IProfessor } from "../professor/IProfessor"

export interface ITurma{
  cod_turma: string,
  cod_disc: string,
  cod_prof: string,
  ano: number,
  horario: string
}

export interface ITurmaExtendida extends ITurma{
  professor: IProfessor,
  disciplina: IDisciplina
}