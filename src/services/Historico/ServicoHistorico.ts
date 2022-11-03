import { IHistorico, IHistoricoExtendido } from "../../interfaces/historico/IHistorico";
import { IHistoricoRepositorio, QueryBusca } from "../../interfaces/historico/IHistoricoRepositorio";
import { IServicoHistorico } from "../../interfaces/historico/IServicoHistorico";
import { IServicoTurma } from "../../interfaces/turma/IServicoTurma";
import { IServicoAluno } from "../../interfaces/aluno/IServicoAluno";
export default class ServicoHistorico implements IServicoHistorico{
  
  constructor(
    private readonly historicoRepositorio: IHistoricoRepositorio,
    private readonly turmaServico: IServicoTurma,
    private readonly alunoServico: IServicoAluno
    ){}
  
  async criar(historico: IHistorico): Promise<{ succeso: boolean, msg: string } >{
    let historicoFoiCriado: boolean = false
    let mensagem: string = ""
    const historicoValido = true
    
    if(!historicoValido){
      mensagem = "Erro ao criar historico, historico inválida"
      this.mostrarMensagemErro(mensagem)

      return {
        succeso: historicoFoiCriado,
        msg: mensagem
      }
    }
    try{
      if(await this.verificaSeHistoricoExiste(historico.cod_historico)){
        mensagem = "Historico ja cadastrado"
        
        return {
          succeso: historicoFoiCriado,
          msg: mensagem
        }  
      }
      
      if(!await this.verificaHistoricoPorAlunoEMatricula(historico)){
        mensagem = "Historico ja cadastrado com mesmo aluno e turma"
        
        return {
          succeso: historicoFoiCriado,
          msg: mensagem
        }  
      }

      historicoFoiCriado = await this.historicoRepositorio.criar(historico)
    }catch(e: any){
      console.error("[ServicoHistorico.criar] Erro ao criar historico", e)
      historicoFoiCriado = false
      throw e
    }
    
    mensagem = "Historico criado com sucesso"
    console.log(`[ServicoHistorico.criar] ${mensagem}`)
    return {
      succeso: historicoFoiCriado,
      msg: mensagem
    }
  }

  async alterar(historico: IHistorico): Promise<{ succeso: boolean, msg: string } >{
    let historicoFoiCriado: boolean = false
    let mensagem: string = ""
    const historicoValido = true
    
    if(!historicoValido){
      mensagem = "Erro ao criar historico, historico inválida"
      this.mostrarMensagemErro(mensagem)

      return {
        succeso: historicoFoiCriado,
        msg: mensagem
      }
    }
    try{
      if(!await this.verificaSeHistoricoExiste(historico.cod_historico)){
        mensagem = "Historico não cadastrado"
        
        return {
          succeso: historicoFoiCriado,
          msg: mensagem
        }  
      }
      

      historicoFoiCriado = await this.historicoRepositorio.criar(historico)
    }catch(e: any){
      console.error("[ServicoHistorico.alterar] Erro ao alterar historico", e)
      historicoFoiCriado = false
      throw e
    }
    
    mensagem = "Historico Alterado com sucesso"
    console.log(`[ServicoHistorico.alterar] ${mensagem}`)
    return {
      succeso: historicoFoiCriado,
      msg: mensagem
    }
  }

  async verificaSeHistoricoExiste(cod_historico: string): Promise<boolean>{
    const opcoesParaBusca: QueryBusca = {primeiroCampo: "cod_historico", operacao: "==", segundoCampo: cod_historico}
    const historicosEncontrados = await this.historicoRepositorio.buscar(opcoesParaBusca)
    return historicosEncontrados.length > 0 
  }

  async buscarTodosHistoricos(limite: number = -1): Promise<IHistorico[]> {
    const todosHistoricos = await this.historicoRepositorio.buscarTodosHistoricos()
    return todosHistoricos
  }

  async buscarTodosHistoricosExtendido(limite: number = -1): Promise<IHistoricoExtendido[]> {
      let todosHistoricos = await this.historicoRepositorio.buscarTodosHistoricos()
      let todosHistoricosExtendido:IHistoricoExtendido[] = []

      todosHistoricos.map(async (historico) => { 
        const aluno = await this.alunoServico.buscar(
          { primeiroCampo: "matricula", operacao: "==", segundoCampo: historico.matricula }
        )

        if(aluno.length == 0 ) {
          throw {message: "Aluno não encontrado", matricula: historico.matricula}
        }

        const turma = await this.turmaServico.buscar(
          { primeiroCampo: "cod_turma", operacao: "==", segundoCampo: historico.cod_turma }
        )

        if(turma.length == 0 ) {
          throw {message: "Turma não encontrada", cod_turma: historico.cod_turma}
        }

        todosHistoricosExtendido.push({
          ...historico,
          aluno: aluno[0],
          turma: turma[0]
        }) 
      })
      
      return todosHistoricosExtendido
  }

  async buscar(queryBusca: QueryBusca): Promise<IHistorico[]>{
    const todosHistoricos = await this.historicoRepositorio.buscar(queryBusca)
    return todosHistoricos
  }

  async deletar(cod_historico: string): Promise<boolean>{
    const foiDeletado = await this.historicoRepositorio.deletar(cod_historico)
    return foiDeletado
  }

  mostrarMensagemErro(mensagem: string): void{
    console.error(`[ServicoHistorico.criar] ${mensagem}`)
  }

  async verificaHistoricoPorAlunoEMatricula(historico: IHistorico): Promise<boolean>{
    const historicoEncontrado = await this.buscar({primeiroCampo: "matricula", operacao: "==", segundoCampo: historico?.matricula})
    
    return historicoEncontrado[0]?.cod_turma != historico?.cod_turma
  }
  
}