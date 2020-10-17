import bcrypt, { hash } from 'bcrypt';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import users_view from '../views/users_view';
import * as Yup from 'yup';

export default {
  async index(request: Request, response: Response) {

    const usersRepository = getRepository(User);

    const users = await usersRepository.find();

    return response.json(users_view.renderMany(users));
  },

  async create(request: Request, response: Response) {

    const usersRepository = getRepository(User);

    const {
      name,
      email,
      password
    } = request.body;

    const senhaParaSalvar = bcrypt.hashSync(password, 10);

    const data = {
      name,
      email,
      password: senhaParaSalvar
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required()
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const user = usersRepository.create(data);

    await usersRepository.save(user);

    return response.status(201).json(users_view.render(user));
  },

  async loggin(request: Request, response: Response) {
    const {
      email,
      password
    } = request.body;

    const usersRepository = getRepository(User);
    const user = await usersRepository.findOneOrFail({ email });

    const match = bcrypt.compareSync(password, user.password);

    return response.status(200).json(match);
  }
}