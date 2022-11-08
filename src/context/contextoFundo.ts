import { string } from "joi";
import { createContext } from "react";

const ContextoFundo = createContext({fundo: string, setFundo: (cor: string) => {}})

export default ContextoFundo