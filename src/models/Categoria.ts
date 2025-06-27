import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export default class Categoria extends Model {
  public id!: number;
  public nome!: string;
  public tipo!: 'gasto' | 'ganho';
  public cor?: string;
  public icone?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Categoria.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('gasto', 'ganho'),
      allowNull: false,
    },
    cor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    icone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Categorias',
    timestamps: true,
  }
);
