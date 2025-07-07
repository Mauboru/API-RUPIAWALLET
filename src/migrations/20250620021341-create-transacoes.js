'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transacoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo: {
        type: Sequelize.ENUM('ENTRADA', 'SAIDA'),
        allowNull: false
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      data: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categorias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      formaPagamento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transacoes');
  }
};
