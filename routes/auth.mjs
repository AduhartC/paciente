import express from 'express';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.mjs';

const router = express.Router();

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const user = await Usuario.findOne({ usuario });

        if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

        const valido = await bcrypt.compare(password, user.password);
        if (!valido) return res.status(401).json({ message: "Contraseña incorrecta" });

        res.json({ 
            ok: true, 
            usuario: user.usuario,
            rol: user.rol
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREAR USUARIO (solo usar una vez para el admin)
router.post('/registro', async (req, res) => {
    try {
        const { usuario, password, rol } = req.body;
        const nuevo = new Usuario({ usuario, password, rol });
        await nuevo.save();
        res.status(201).json({ message: "Usuario creado" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;