import { Request, Response } from 'express';
import Transacao from '../models/Transacao';
import { Op } from 'sequelize';
import { startOfMonth, endOfMonth } from 'date-fns';

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
		const transactions = await Transacao.findAll({ order: [['data', 'DESC']] });
		return res.status(200).json(transactions);
	} catch (error) {
		console.error('Erro ao buscar transacoes:', error);
		return res.status(500).json({ message: 'Erro interno do servidor.' });
	}
}

export const getTransactionsByMonth = async (req: Request, res: Response) => { 
  try {
    const { month } = req.params;
    const mes = Number(month);

    if (isNaN(mes) || mes < 1 || mes > 12) return res.status(400).json({ message: 'Mês inválido.' });

    const now = new Date();
    const anoAtual = now.getFullYear();

    const inicio = startOfMonth(new Date(anoAtual, mes - 1));
    const fim = endOfMonth(inicio);

    const transactions = await Transacao.findAll({
      where: {
        data: {
          [Op.between]: [inicio, fim]
        }
      },
      order: [['data', 'DESC']]
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}