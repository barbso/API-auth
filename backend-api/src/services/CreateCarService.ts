import prismaClient from "../prisma";



interface CarsInterface {
    modelo:     string;
    marca:      string;
    n_marchas:  string;
    preco:      string;
}

    class CreateCarService {
        async execute({modelo, marca, n_marchas, preco}: CarsInterface) {
            
            const existinCarBymodelo = await prismaClient.car.findFirst({
                where: {
                    modelo,
                },
            })
            
            if (existinCarBymodelo) {
                return { error: "Esse modelo já está cadastrado no banco"}
            }


            const car = await prismaClient.car.create({
                data: {
                    modelo,
                    marca,
                    n_marchas,
                    preco
                },
            });

            return { car };
           
        }
    }

    export { CreateCarService };