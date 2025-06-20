import Categoria from './Categoria';
import Transacao from './Transacao';

// Uma Categoria tem muitas Transacoes
Categoria.hasMany(Transacao, {
  foreignKey: 'categoriaId',
  as: 'transacoes'
});

// Uma Transacao pertence a uma Categoria
Transacao.belongsTo(Categoria, {
  foreignKey: 'categoriaId',
  as: 'categoria'
});
