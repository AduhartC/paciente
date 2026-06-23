import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
  rut: { type: String, required: true, unique: true, index: true },
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  proximoExamen: { type: Date, required: true }, 
  requiereExamen: { type: Boolean, default: false } 
}, { timestamps: true });

// Middleware automático: Antes de guardar, calcula si el examen está vencido
pacienteSchema.pre('save', function(next) {
  const hoy = new Date();
  this.requiereExamen = this.proximoExamen <= hoy;
  next();
});

export default mongoose.model('Paciente', pacienteSchema);
