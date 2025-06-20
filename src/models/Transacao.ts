import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export class Transacao extends Model {
  public id!: number;
  public tipo!: 'gasto' | 'ganho';
  public descricao!: string;
  public valor!: number;
  public data!: Date;
  public categoriaId!: number;
  public formaPagamento!: string;
  public recorrente!: boolean;
  public observacoes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transacao.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('gasto', 'ganho'),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    categoriaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    formaPagamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recorrente: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Transacoes',
    timestamps: true,
  }
);
