import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/authService';
import { User } from '../models/User';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ 
            where: { 
                email: email,
                deletedAt: null
            }
        });

        if (!user) return res.status(401).json({ message: 'Credenciais inválidas ou usuário desativado.' });

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) return res.status(401).json({ message: 'Credenciais inválidas.' });

        if (password !== user.password) return res.status(401).json({ message: 'Credenciais inválidas.' });

        const token = generateToken({ id: user.id, email: user.email });

        return res.status(200).json({
            message: 'Login bem-sucedido.',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};