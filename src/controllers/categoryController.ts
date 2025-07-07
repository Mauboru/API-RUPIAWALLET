import { Request, Response } from 'express';
import Categoria from '../models/Categoria';
import { submitImage } from '../services/imageServices';

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll({ order: [['nome', 'ASC']]});
    return res.status(200).json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const newCategory = async (req: Request, res: Response) => {
  try {
    const { nome, tipo, cor, icone } = req.body;

    if (!nome || !tipo) return res.status(401).json({ message: "Os campos 'nome' e 'tipo' são obrigatórios!" });

    const corDefault = cor ?? '#4287f5';
    let iconeFinal = 'https://png.pngtree.com/png-vector/20191130/ourmid/pngtree-document-setting-icon-png-image_2052164.jpg';

    console.log(1);

    if (icone) {
      const result = submitImage(icone, nome);
      if (result.success && result.fileName) {
        iconeFinal = `/uploads/icone/${result.fileName}`; 
      }
    }

    console.log(2);

    const category = await Categoria.create({ nome, tipo, cor: corDefault, icone: iconeFinal });

    return res.status(201).json({ message: "Nova categoria criada com sucesso! ", categoria: category });
  } catch (error) {
    console.error("Erro ao criar nova categoria", error);
    return res.status(500).json({ message: "Erro iterno do servidor" })
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, tipo, cor, icone } = req.body;
    
    const categoria = await Categoria.findOne({ where: { id: id }});
    if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada.' });

    const updateData: any = {};
    if (nome) updateData.nome = nome;
    if (tipo) updateData.tipo = tipo;
    if (cor) updateData.cor = cor;
    
    if (icone && icone.startsWith('data:image')) {
      const result = submitImage(icone, nome || id);
      if (result.success && result.fileName) {
        updateData.icone = `/uploads/icone/${result.fileName}`;
      }
    }
    
    Object.assign(categoria, updateData);
    await categoria.save();

    return res.json({ message: 'Categoria atualizada com sucesso.', categoria });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findOne({ where: { id } });
    if (!categoria) return res.status(404).json({ message: "Categoria não encontrada." });

    await categoria.destroy();

    return res.status(200).json({ message: "Categoria excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return res.status(500).json({ message: "Erro interno ao excluir categoria." });
  }
};