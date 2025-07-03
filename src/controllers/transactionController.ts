import { Request, Response } from 'express';
import Transacao from '../models/Transacao';
import { Op } from 'sequelize';
import { startOfMonth, endOfMonth } from 'date-fns';
import Categoria from '../models/Categoria';

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
    const { month } = req.params; // ex: "2025-07"
    const [anoStr, mesStr] = month.split('-');
    const ano = Number(anoStr);
    const mes = Number(mesStr);

    if (isNaN(mes) || mes < 1 || mes > 12) return res.status(400).json({ message: 'Mês inválido.' });
    if (isNaN(ano) || ano < 1970) return res.status(400).json({ message: 'Ano inválido.' });

    const inicio = startOfMonth(new Date(ano, mes - 1));
    const fim = endOfMonth(inicio);

    const transactions = await Transacao.findAll({
      where: {
        data: {
          [Op.between]: [inicio, fim]
        }
      },
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nome', 'tipo']
      }],
      order: [['data', 'DESC']]
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => { 
  try {
    const { id } = req.params;
		const transaction = await Transacao.findOne({ where: { id: id } });
		return res.status(200).json(transaction);
	} catch (error) {
		console.error('Erro ao buscar transacao:', error);
		return res.status(500).json({ message: 'Erro interno do servidor.' });
	}
}

export const updateTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const transaction = await Transacao.findOne({ where: { id: id }});
    if (!transaction) return res.status(404).json({ message: 'Transação não encontrada.' });

    Object.assign(transaction, updateData);
    await transaction.save();

    return res.json({ message: 'Transação atualizada com sucesso.', transaction });
  } catch (error) {
    console.error('Erro ao atualizar transacao:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transacao = await Transacao.findOne({ where: { id } });

    if (!transacao) {
      return res.status(404).json({ message: "Transação não encontrada." });
    }

    await transacao.destroy();

    return res.status(200).json({ message: "Transação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    return res.status(500).json({ message: "Erro interno ao excluir transação." });
  }
};