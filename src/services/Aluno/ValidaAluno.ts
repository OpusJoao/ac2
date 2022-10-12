import { IAluno } from "../../interfaces/aluno/IAluno";

export default class ValidaAluno{
  static VerificaAlunoValido(aluno: IAluno){
    return aluno &&
     aluno.cidade !== "" &&
     aluno.endereco !== "" &&
     aluno.foto !== "" &&
     aluno.matricula !== "" &&
     aluno.matricula !== ""
  }
}