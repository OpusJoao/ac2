import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import ServicoAluno from "../../services/Aluno/ServicoAluno";
import AlunoRepositorioFirebase from "../../repositories/AlunoRepositorioFirebase";
import db from "../../database/firebase/db";
import { useEffect, useState } from "react";
import { IAluno } from "../../interfaces/aluno/IAluno";

export default function TelaMenu() {
  const servicoAluno = new ServicoAluno(new AlunoRepositorioFirebase(db));
  const [aluno, setAluno] = useState<IAluno>({
    matricula: "",
    nome: "",
    endereco: "",
    cidade: "",
    foto: "",
  });

  const [alunos, setAlunos] = useState<IAluno[]>([]);

  const [carregando, setCarregando] = useState(false);

  function onChangeNomeAluno(input: string) {
    setAluno({ ...aluno, nome: input });
  }

  function onChangeMatriculaAluno(input: string) {
    setAluno({ ...aluno, matricula: input });
  }

  function onChangeEnderecoAluno(input: string) {
    setAluno({ ...aluno, endereco: input });
  }

  function onChangeCidadeAluno(input: string) {
    setAluno({ ...aluno, cidade: input });
  }

  function onChangeFotoAluno(input: string) {
    setAluno({ ...aluno, foto: input });
  }

  async function onPressSalvarAluno() {
    setCarregando(true);
    const alunoCriado = await servicoAluno.criar(aluno);
    alert(alunoCriado.msg);
    setCarregando(false);

    buscaTodosAlunos().then((alunos) => {
      return setAlunos(alunos);
    });
  }

  function renderizaAlunoFlatList({ item }: any) {
    return (
      <Text>
        [{item.matricula}] {item.nome} - {item.endereco}, {item.cidade}
      </Text>
    );
  }

  function separador() {
    return (
      <View
        style={{
          margin: 4,
          height: 1,
          width: "100%",
          backgroundColor: "purple",
        }}
      />
    );
  }

  async function buscaTodosAlunos() {
    const todosAlunos = await servicoAluno.buscarTodosAlunos();
    return todosAlunos;
  }

  useEffect(() => {
    buscaTodosAlunos().then((alunos) => {
      return setAlunos(alunos);
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      marginBottom: "5%",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => window.alert("teste")}>
        <Text>Home</Text>
      </Pressable>
      <Button title="Aluno" />
      <Button title="Professor" />
      <Button title="Disciplina" />
      <Button title="Turma" />
      <Button title="Historico" />
    </View>
  );
}
