import { Express, Request, Response } from 'express';
import { CreateCustomerController } from './controllers/CreateCustomerController';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { ensureAuthenticated } from './middleware/ensureAuthenticated';
import { CreateCarController } from './controllers/CreateCarController';
import { string } from 'zod';

const accessTokenSecret = 'your_access_token_secret';
const refreshTokenSecret = 'your_refresh_token_secret';

const prisma = new PrismaClient();

export function routes(app: Express) {

// Rotas dos Customers

  app.get('/customer-autenticate', ensureAuthenticated, (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/customer-register', async (req: Request, res: Response) => {
    await new CreateCustomerController().handle(req, res);
  });

  app.post('/customer-login', async (req: Request, res: Response) => {
    const { usuario, senha } = req.body as { usuario: string; senha: string };

    if (!usuario || !senha) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    try {
      const customer = await prisma.customer.findFirst({
        where: { usuario: usuario },
      });

      if (!customer) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      const isValidPassword = await compare(senha, customer.senha);

      if (isValidPassword) {
        const accessToken = jwt.sign({ userId: customer.id }, accessTokenSecret, {
          subject: customer.id,
          expiresIn: '6d', // mudar depois!!!!!!!
        });

        let existingRefreshToken = await prisma.refreshToken.findFirst({
          where: { userId: customer.id },
        });

        if (existingRefreshToken) {
          await prisma.refreshToken.update({
            where: {
              id: existingRefreshToken.id,
            },
            data: {
              token: jwt.sign({}, refreshTokenSecret, { expiresIn: '7d' }),
            },
          });


          const refreshToken = jwt.sign({}, refreshTokenSecret, {
            expiresIn: '7d',
          });

          return res.json({ accessToken, refreshToken });
        } else {
          const refreshToken = jwt.sign({}, refreshTokenSecret, {
            expiresIn: '7d',
          });

          await prisma.refreshToken.create({
            data: {
              userId: customer.id,
              token: refreshToken,
            },
          });


          return res.json({ accessToken, refreshToken });
        }
      } else {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }
  });

  app.post('/refresh-token', async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body as { refreshToken: string };

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token não fornecido.' });
      }

      let existingRefreshToken = await prisma.refreshToken.findFirst({
        where: { token: refreshToken },
      });

      if (!existingRefreshToken) {
        return res.status(403).json({ error: 'Refresh token inválido.' });
      }

      const newAccessToken = jwt.sign({ userId: existingRefreshToken.userId }, accessTokenSecret, { expiresIn: '20s' });
      const newRefreshToken = jwt.sign({}, refreshTokenSecret, { expiresIn: '7d' });

      await prisma.refreshToken.update({
        where: {
          id: existingRefreshToken.id,
        },
        data: {
          token: newRefreshToken as string,
        },
      });


      return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error('Erro ao renovar o token:', error);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }
  });

  // Rotas do CRUD sobre carros

  app.get('/cars-colsultLALL', ensureAuthenticated, async (req: Request, res: Response) => {
    const list = await prisma.car.findMany()
    res.json(list)
  });

  app.post('/cars-register',  ensureAuthenticated, async (req: Request, res: Response) => {
    await new CreateCarController().handle(req, res);
  });

  app.delete('/cars-delete/:id', ensureAuthenticated, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {

      const existingCar = await prisma.car.findUnique({
        where: { id: id },
      });

      if (!existingCar) {
        return res.status(404).json({ error: 'Carro não encontrado.' });
      }


      await prisma.car.delete({
        where: { id: id },
      });

      res.json({ message: 'Carro excluído com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir carro:', error);
      res.status(500).json({ error: 'Erro no servidor ao excluir carro.' });
    }
  });

  app.put('/cars-upadate/:id', ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { modelo,marca,n_marchas,preco} = req.body;
  
      let car = await prisma.car.findUnique({
        where: { id: id },
      });
      if(!car){
        return res.status(404).json({ error: 'Não foi possivel encontrar esse carro' });
      }

      car = await prisma.car.update({
        where: { id: id }, data: { modelo, marca, n_marchas, preco }
      });

      return res.json(car)
    }catch (error){
      res.json({ error })
    }
    
  });

}

export { accessTokenSecret };