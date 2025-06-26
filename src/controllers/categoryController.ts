import { Request, Response } from 'express';
import Categoria from '../models/Categoria';

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']]});
    return res.status(200).json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
