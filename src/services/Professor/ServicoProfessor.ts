import { IProfessor } from "../../interfaces/professor/IProfessor";
import { IProfessorRepositorio, QueryBusca } from "../../interfaces/professor/IProfessorRepositorio";
import { IServicoProfessor } from "../../interfaces/professor/IServicoProfessor";
export default class ServicoProfessor implements IServicoProfessor{
  
  constructor(private readonly professorRepositorio: IProfessorRepositorio){}
  async criar(professor: IProfessor): Promise<{ succeso: boolean, msg: string } >{
    let professorFoiCriado: boolean = false
    let mensagem: string = ""
    const professorValido = true
    
    if(!professorValido){
      mensagem = "Erro ao criar professor, professor inválida"
      console.error(`[ServicoProfessor.criar] ${mensagem}`)

      return {
        succeso: professorFoiCriado,
        msg: mensagem
      }
    }
    try{
      if(await this.verificaSeProfessorExiste(professor.cod_prof)){
        mensagem = "Professor ja cadastrada"
        console.error(`[ServicoProfessor.criar] ${mensagem}`)
        return {
          succeso: professorFoiCriado,
          msg: mensagem
        }  
      }
      professorFoiCriado = await this.professorRepositorio.criar(professor)
    }catch(e: any){
      console.error("[ServicoProfessor.criar] Erro ao criar professor", e)
      professorFoiCriado = false
      throw e
    }
    
    mensagem = "Professor criado com sucesso"
    console.log(`[ServicoProfessor.criar] ${mensagem}`)
    return {
      succeso: professorFoiCriado,
      msg: mensagem
    }
  }

  async verificaSeProfessorExiste(cod_prof: string): Promise<boolean>{
    const opcoesParaBusca: QueryBusca = {primeiroCampo: "cod_prof", operacao: "==", segundoCampo: cod_prof}
    const professorsEncontradas = await this.professorRepositorio.buscar(opcoesParaBusca)
    return professorsEncontradas.length > 0 
  }

  async buscarTodosProfessores(limite: number = -1): Promise<IProfessor[]> {
    const todasProfessors = await this.professorRepositorio.buscarTodosProfessores()
    return todasProfessors
  }
}