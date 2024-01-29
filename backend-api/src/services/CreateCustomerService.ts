import { hash } from "bcryptjs";
import prismaClient from "../prisma";
import { validatorCpf } from "../components/VerificationCPF";


interface CreateCustomerProps {
    nome: string;
    email: string;
    CPF: string;
    telefone: string;
    usuario: string;
    senha: string;
    confirm_senha: string;
}

class CreateCustomerService {
    async execute({ nome, email, CPF, telefone, usuario, senha, confirm_senha }: CreateCustomerProps) {
        const existingCustomerByEmail = await prismaClient.customer.findFirst({
            where: {
                email,
            },
        });

        if (existingCustomerByEmail) {
            return { error: "Já existe um cliente com este email" };
        }

        if(!/\S+@\S+\.\S+/.test(email)){
            return {error: "O email informado é invalido"};
        }

        const cpf = await CPF.replace(/\s|\.|\-/g,"");
        const existingCustomerByCPF = await prismaClient.customer.findFirst({
            where: {
                CPF:cpf,
            },
        });

        if(!validatorCpf(cpf)){
            return { error: "O CPF informado é invalido" };
          }


        if (existingCustomerByCPF) {
            return { error: "Já existe um cliente com este CPF" };
        }

        const existingCustomerByUser = await prismaClient.customer.findFirst({
            where: {
                usuario,
            },
        });

        if (existingCustomerByUser) {
            return { error: "Já existe um cliente com este usuário" };
        }
        
        if (senha !== confirm_senha ) {
            return {error: "As senha não coincidem"};
          }

        const senhahash = await hash(senha,10);

        const telefoneClean = await telefone.replace(/\s|\.|\-|\(|\)/g,"");
        
        if(telefoneClean.length !== 11){
            return { error: "O telefone deve conter 11 digitos" };
          }

          if (!/^[a-zA-Z ]+$/.test(nome)) {
            return {error: "O nome não pode conter números"};
          }

        const customer = await prismaClient.customer.create({
            data: {
                nome,
                email,
                CPF: cpf,
                telefone: telefoneClean,
                usuario,
                senha: senhahash,
                confirm_senha:senhahash
            },
        });

        return { customer };
    }
}

export { CreateCustomerService };
