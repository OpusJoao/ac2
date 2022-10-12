import { IAluno } from "../../interfaces/aluno/IAluno";
import { IAlunoRepositorio } from "../../interfaces/aluno/IAlunoRepositorio";
import { IServicoAluno } from "../../interfaces/aluno/IServicoAluno";

export default class ServicoAluno implements IServicoAluno{
  
  constructor(private readonly alunoRepositorio: IAlunoRepositorio){}
  criar(aluno: IAluno): boolean {
    let alunoFoiCriado: boolean = false
    
    this.alunoRepositorio.criar(aluno)
    .then(response => {
      alunoFoiCriado = response && !!response?.id
    })
    .catch((e: any) => {
      console.log("[ServicoAluno.criar] Erro ao criar aluno", e)
      alunoFoiCriado = false
    })

    return alunoFoiCriado
  }
  
}