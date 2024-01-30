import { useRef, FormEvent, useState } from 'react';
import { api } from './services/api';
import placeholderImage from '/Logo_Coprel.png';
import { maskCpf, maskTelefone } from './components/Masks';

enum TipoFormulario {
  Cadastro,
  Login,
}

export default function App() {
  const [tipoFormulario, setTipoFormulario] = useState<TipoFormulario>(TipoFormulario.Cadastro);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  
  const nomeRef = useRef<HTMLInputElement | null>(null);
  const cpfRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const telefoneRef = useRef<HTMLInputElement | null>(null);
  const usuarioCadastroRef = useRef<HTMLInputElement | null>(null);
  const senhaCadastroRef = useRef<HTMLInputElement | null>(null);
  const confirmarSenhaRef = useRef<HTMLInputElement | null>(null);

 
  const usuarioLoginRef = useRef<HTMLInputElement | null>(null);
  const senhaLoginRef = useRef<HTMLInputElement | null>(null);

  async function lidarComEnvio(evento: FormEvent) {
    evento.preventDefault();

    if (tipoFormulario === TipoFormulario.Cadastro) {
      
      try {

        const response = await api.post('/customer-register', {
          nome: nomeRef.current?.value,
          email: emailRef.current?.value,
          CPF: cpfRef.current?.value,
          telefone: telefoneRef.current?.value,
          usuario: usuarioCadastroRef.current?.value,
          senha: senhaCadastroRef.current?.value,
          confirm_senha: confirmarSenhaRef.current?.value
        });

        console.log(response.data);
        alert('Usuário cadastrado com sucesso');
        
        
        setMensagemErro(null);
      } catch (erro: any) {
        console.error('Erro ao cadastrar usuário:', erro);

        if (erro.response && erro.response.data && erro.response.data.error) {
          setMensagemErro(erro.response.data.error);
        } else {
          
          setMensagemErro('Erro ao cadastrar usuário. Por favor, tente novamente.');
        }
      }
    } else {
      
      if (
        !usuarioLoginRef.current?.value ||
        !senhaLoginRef.current?.value
      ) {
        setMensagemErro('Por favor, preencha todos os campos.');
        setTimeout(() => setMensagemErro(null), 6000);
        return;
      }

      try {
        const response = await api.post('/customer-login', {
          usuario: usuarioLoginRef.current?.value,
          senha: senhaLoginRef.current?.value
        });

        console.log(response.data);
        alert('Usuário logado com sucesso');

    
        setMensagemErro(null);
      } catch (erro) {
        console.error('Erro ao tentar logar', erro);

       
        setMensagemErro('O usuário ou a senha são inválidos');
        setTimeout(() => setMensagemErro(null), 6000);
      }
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{backgroundImage: 'url("fundo.png")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <main className="my-9 w-full md:max-w-md bg-white rounded p-8 shadow-md text-center">
        <div className="flex items-center justify-center mb-8">
          {tipoFormulario === TipoFormulario.Cadastro ? (
            <>
              <h1 className="text-5xl font-extrabold text-violet-950 mb-4">Cadastro de Usuário</h1>
              <img src={placeholderImage} alt="placeholder" className="w-20 h-20" />
            </>
          ) : (
            <>
              <h1 className="text-5xl font-extrabold text-violet-950 mb-4">Login de Usuário</h1>
              <img src={placeholderImage} alt="placeholder" className="w-20 h-20" />
            </>
          )}
        </div>

        <form className="flex flex-col text-left" onSubmit={lidarComEnvio} id="formulario">
          {tipoFormulario === TipoFormulario.Cadastro ? (
            <>
              <label className="mb-2 font-medium text-gray-800">Nome Completo</label>
              <input
                type="text"
                id="username"
                placeholder="Insira seu nome Completo..."
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                ref={nomeRef}
              />

              <label className="mb-2 font-medium text-gray-800">CPF</label>
              <input
                type="text"
                id="cpf"
                placeholder="Insira seu CPF..."
                maxLength={14}
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                onChange={(evento) => {
                  const { value } = evento.target;
                  evento.target.value = maskCpf(value)
                }}
                ref={cpfRef}
              />

              <label className="mb-2 font-medium text-gray-800">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Insira seu Email..."
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                ref={emailRef}
              />

              <label className="mb-2 font-medium text-gray-800">Telefone</label>
              <input
                type="tel"
                id="telefone"
                placeholder="Insira seu Telefone..."
                maxLength={15}
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                onChange={(evento) => {
                  const { value } = evento.target;
                  evento.target.value = maskTelefone(value)
                }}
                ref={telefoneRef}
              />

              <label className="mb-2 font-medium text-gray-800">Usuário</label>
              <input
                type="text"
                id="usuario"
                placeholder="Insira seu Usuário..."
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                ref={usuarioCadastroRef}
              />

              <label className="mb-2 font-medium text-gray-800">Senha</label>
              <input
                type="password"
                id="senha"
                placeholder="Insira sua Senha..."
                minLength={6}
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                ref={senhaCadastroRef}
              />

              <label className="mb-2 font-medium text-gray-800">Confirmação de senha</label>
              <input
                type="password"
                id="confir_senha"
                placeholder="Confirme sua Senha..."
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                ref={confirmarSenhaRef}
              />
            </>
          ) : (
            <>
              <label className="mb-2 font-medium text-gray-800">Usuário</label>
              <input
                type="text"
                id="usuario"
                placeholder="Insira seu Usuário..."
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                ref={usuarioLoginRef}
              />

              <label className="mb-2 font-medium text-gray-800">Senha</label>
              <input
                type="password"
                id="senha"
                placeholder="Insira sua Senha..."
                minLength={6}
                className="w-full mb-3 p-3 rounded border focus:outline-none focus:border-purple-700"
                ref={senhaLoginRef}
              />
            </>
          )}

          {mensagemErro && (
            <p className="text-red-500 mb-2">{mensagemErro}</p>
          )}

          <input
            type="submit"
            value={tipoFormulario === TipoFormulario.Cadastro ? "Cadastrar" : "Entrar"}
            className="cursor-pointer w-32 p-3 bg-indigo-900 rounded-full font-semibold text-lg text-pink-600 hover:bg-blue-800 transition duration-300 mx-auto"
          />
        </form>

        <div className="mt-4 text-gray-800">
          {tipoFormulario === TipoFormulario.Cadastro ? (
            <p>Já possui uma conta? <button   onClick={() => setTipoFormulario(TipoFormulario.Login)} className="text-purple-700">Login</button></p>
          ) : (
            <p>Ainda não tem uma conta? <button  onClick={() => setTipoFormulario(TipoFormulario.Cadastro)} className="text-purple-700">Cadastre-se</button></p>
          )}
        </div>
      </main>
    </div>
  );
}
