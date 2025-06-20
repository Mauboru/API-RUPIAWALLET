import { Request, Response } from 'express';
import Transacao from '../models/Transacao';

export const newTransaction = async (req: Request, res: Response) => {
  try {
    const {
      tipo,
      descricao,
      valor,
      data,
      categoriaId,
      formaPagamento,
      recorrente,
      observacoes
    } = req.body;

    const transacao = await Transacao.create({
      tipo,
      descricao,
      valor,
      data,
      categoriaId,
      formaPagamento,
      recorrente,
      observacoes
    });

    return res.status(201).json({ message: "Novo registro feito com sucesso!", id: transacao.id });
  } catch (error) {
    console.error('Erro ao registrar transação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getTransactions = async (req: Request, res: Response) => { 
    try {
    const transactions = await Transacao.findAll();
    return res.status(200).json(transactions);
    } catch (error) {
    console.error('Erro ao buscar transacoes:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}