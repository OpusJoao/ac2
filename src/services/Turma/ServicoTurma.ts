import { ITurma, ITurmaExtendida } from "../../interfaces/turma/ITurma";
import { ITurmaRepositorio, QueryBusca } from "../../interfaces/turma/ITurmaRepositorio";
import { IServicoTurma } from "../../interfaces/turma/IServicoTurma";
import { IDisciplinaRepositorio } from "../../interfaces/disciplina/IDisciplinaRepositorio";
import { IProfessorRepositorio } from "../../interfaces/professor/IProfessorRepositorio";
export default class ServicoTurma implements IServicoTurma{
  
  constructor(
    private readonly turmaRepositorio: ITurmaRepositorio,
    private readonly disciplinaRepositorio: IDisciplinaRepositorio,
    private readonly professorRepositorio: IProfessorRepositorio
    ){}
  async criar(turma: ITurma): Promise<{ succeso: boolean, msg: string } >{
    let turmaFoiCriado: boolean = false
    let mensagem: string = ""
    const turmaValido = true
    
    if(!turmaValido){
      mensagem = "Erro ao criar turma, turma inválida"
      console.error(`[ServicoTurma.criar] ${mensagem}`)

      return {
        succeso: turmaFoiCriado,
        msg: mensagem
      }
    }
    try{
      if(await this.verificaSeTurmaExiste(turma.cod_turma)){
        mensagem = "Turma ja cadastrada"
        console.error(`[ServicoTurma.criar] ${mensagem}`)
        return {
          succeso: turmaFoiCriado,
          msg: mensagem
        }  
      }
      turmaFoiCriado = await this.turmaRepositorio.criar(turma)
    }catch(e: any){
      console.error("[ServicoTurma.criar] Erro ao criar turma", e)
      turmaFoiCriado = false
      throw e
    }
    
    mensagem = "Turma criado com sucesso"
    console.log(`[ServicoTurma.criar] ${mensagem}`)
    return {
      succeso: turmaFoiCriado,
      msg: mensagem
    }
  }

  async verificaSeTurmaExiste(cod_turma: string): Promise<boolean>{
    const opcoesParaBusca: QueryBusca = {primeiroCampo: "cod_turma", operacao: "==", segundoCampo: cod_turma}
    const turmasEncontradas = await this.turmaRepositorio.buscar(opcoesParaBusca)
    return turmasEncontradas.length > 0 
  }

  async buscarTodasTurmas(limite: number = -1): Promise<ITurma[]> {
    const todasTurmas = await this.turmaRepositorio.buscarTodasTurmas()
    return todasTurmas
  }

  async buscar(queryBusca: QueryBusca): Promise<ITurma[]>{
    const todasTurmas = await this.turmaRepositorio.buscar(queryBusca)
    return todasTurmas
  }
  
  async buscarTodasTurmasExtendido(limite: number = -1): Promise<ITurmaExtendida[]> {
    
    return new Promise(async (resolve, reject) => {
      let todasTurmas = await this.turmaRepositorio.buscarTodasTurmas()
      
      let todasTurmasExtendido:ITurmaExtendida[] = []

      todasTurmas.map(async (turma) => { 
        
        const professor = await this.professorRepositorio.buscar(
          { primeiroCampo: "cod_prof", operacao: "==", segundoCampo: turma.cod_prof }
        )

        if(professor.length == 0 ) reject({message: "Professor não encontrado", cod_prof: turma.cod_prof})

        const disciplina = await this.disciplinaRepositorio.buscar(
          { primeiroCampo: "cod_disc", operacao: "==", segundoCampo: turma.cod_disc }
        )

        if(disciplina.length == 0 ) reject({message: "disciplina não encontrada", cod_disc: turma.cod_disc})

        todasTurmasExtendido.push({
          ...turma,
          professor: professor[0],
          disciplina: disciplina[0]
        }) 
      })
      resolve(todasTurmasExtendido)
      
    })
    
  }

  
}