import { IDisciplina } from "../../interfaces/disciplina/IDisciplina";
import { IDisciplinaRepositorio, QueryBusca } from "../../interfaces/disciplina/IDisciplinaRepositorio";
import { IServicoDisciplina } from "../../interfaces/disciplina/IServicoDisciplina";
export default class ServicoDisciplina implements IServicoDisciplina{
  
  constructor(private readonly disciplinaRepositorio: IDisciplinaRepositorio){}

  async criar(disciplina: IDisciplina): Promise<{ succeso: boolean, msg: string } >{
    let disciplinaFoiCriado: boolean = false
    let mensagem: string = ""
    const disciplinaValido = true
    
    if(!disciplinaValido){
      mensagem = "Erro ao criar disciplina, disciplina inválida"
      console.error(`[ServicoDisciplina.criar] ${mensagem}`)

      return {
        succeso: disciplinaFoiCriado,
        msg: mensagem
      }
    }
    try{
      if(await this.verificarCodigoJaCadastrado(disciplina.cod_disc)){
        mensagem = "Disciplina ja cadastrada"
        console.error(`[ServicoDisciplina.criar] ${mensagem}`)
        return {
          succeso: disciplinaFoiCriado,
          msg: mensagem
        }  
      }
      disciplinaFoiCriado = await this.disciplinaRepositorio.criar(disciplina)
    }catch(e: any){
      console.error("[ServicoDisciplina.criar] Erro ao criar disciplina", e)
      disciplinaFoiCriado = false
      throw e
    }
    
    mensagem = "Disciplina criado com sucesso"
    console.log(`[ServicoDisciplina.criar] ${mensagem}`)
    return {
      succeso: disciplinaFoiCriado,
      msg: mensagem
    }
  }

  async verificarCodigoJaCadastrado(cod_disc: string): Promise<boolean>{
    const opcoesParaBusca: QueryBusca = {primeiroCampo: "cod_disc", operacao: "==", segundoCampo: cod_disc}
    const disciplinasEncontradas = await this.disciplinaRepositorio.buscar(opcoesParaBusca)
    return disciplinasEncontradas.length > 0 
  }

  async buscarTodasDisciplinas(limite: number = -1): Promise<IDisciplina[]> {
    const todasDisciplinas = await this.disciplinaRepositorio.buscarTodasDisciplinas()
    return todasDisciplinas
  }
  
}