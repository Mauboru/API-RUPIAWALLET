import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';
import bcrypt from 'bcrypt';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public static isPasswordValid(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Users',
    timestamps: true,
    paranoid: true,
  }
);
