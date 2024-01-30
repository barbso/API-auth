import { Request, Response } from "express"; 
import { CreateCustomerService } from '../services/CreateCustomerService';

class CreateCustomerController {
    async handle(request: Request, response: Response) {
        const { nome, email, CPF, telefone, usuario, senha, confirm_senha } = request.body as {
            nome: string, email: string, CPF: string, telefone: string, usuario: string, senha: string, confirm_senha: string
        };

        if (!nome || !email || !CPF || !telefone || !usuario || !senha || !confirm_senha) {
            return response.status(400).json({ error: "Preencha todos os campos" });
        }

        const customerService = new CreateCustomerService();
        const result = await customerService.execute({ nome, email, CPF, telefone, usuario, senha, confirm_senha });

        if (result.error) {
            return response.status(400).json({ error: result.error });
        }

        response.json(result.customer);
    }
}

export { CreateCustomerController };