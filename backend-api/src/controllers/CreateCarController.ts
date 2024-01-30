import { Request, Response } from "express";
import { CreateCarService } from "../services/CreateCarService";

class CreateCarController {
    async handle(request: Request, response: Response){
        const { modelo, marca, n_marchas, preco } = request.body as {
            modelo: string, marca: string, n_marchas: string, preco: string
        };

        if (!modelo || !marca || !n_marchas || !preco){
            return response.status(400).json({ error: "Preencha todos os campos"});
        };

        const carservice = new CreateCarService();
        const result = await carservice.execute({ modelo, marca, n_marchas, preco});

        if(result.error){
            return response.status(400).json({ error: result.error });
        }

        response.json(result.car)
    }
}

export { CreateCarController };