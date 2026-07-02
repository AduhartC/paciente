import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UsuarioSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'enfermera', 'medico'], default: 'enfermera' }
}, { timestamps: true });

// Encriptar password antes de guardar
UsuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
export default Usuario;