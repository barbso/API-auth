import express from 'express';
import { routes } from './routes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';  


const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
const swaggerDocument = YAML.load('./src/swagger.yaml'); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


routes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});