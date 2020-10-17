import { Router } from 'express';
import OrphanagesController from './controllers/OrphanagesController';
import multer from 'multer';
import UploadConfig from './config/upload';
import UsersController from './controllers/UsersController';

const routes = Router();

const upload = multer(UploadConfig);

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

routes.get('/users', UsersController.index);
routes.post('/users', UsersController.create);
routes.post('/users/login', UsersController.loggin);

export default routes;