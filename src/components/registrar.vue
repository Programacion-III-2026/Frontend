<template>
  <div class="registro-container">
    <!-- Decorative user icons in background -->
    <div class="user-icon user-icon-1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    <div class="user-icon user-icon-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
    
    <div class="registro-card">
      <h2>Registro de Usuario</h2>
      <form @submit.prevent="registrarUsuario">
        <div class="form-row">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              v-model="usuario.nombre" 
              required
              placeholder="Ingrese su nombre completo"
            />
          </div>

          <div class="form-group">
            <label for="correo">Correo:</label>
            <input 
              type="email" 
              id="correo" 
              v-model="usuario.correo" 
              required
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="contraseña">Contraseña:</label>
            <input 
              type="password" 
              id="contraseña" 
              v-model="usuario.contraseña" 
              required
              placeholder="Ingrese su contraseña"
            />
          </div>

          <div class="form-group">
            <label for="rol">Rol:</label>
            <select 
              id="rol" 
              v-model="usuario.rol" 
              required
            >
              <option value="" disabled>Seleccione un rol</option>
              <option value="tecnico">Tecnico</option>
              <option value="admin">Admin</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>
        </div>

        <button type="submit" class="btn-submit">Registrar</button>
      </form>

      <div v-if="mensaje" class="mensaje" :class="{ 'error': esError }">
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Registrar',
  data() {
    return {
      usuario: {
        nombre: '',
        correo: '',
        contraseña: '',
        rol: ''
      },
      mensaje: '',
      esError: false
    }
  },
  methods: {
    registrarUsuario() {
      // Validación básica
      if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.contraseña || !this.usuario.rol) {
        this.mostrarMensaje('Por favor complete todos los campos', true);
        return;
      }

      // Aquí puedes agregar la lógica para enviar los datos al backend
      console.log('Usuario a registrar:', this.usuario);
      
      // Simulación de registro exitoso
      this.mostrarMensaje('Usuario registrado exitosamente', false);
      
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        this.limpiarFormulario();
      }, 2000);
    },
    mostrarMensaje(texto, error) {
      this.mensaje = texto;
      this.esError = error;
      setTimeout(() => {
        this.mensaje = '';
      }, 3000);
    },
    limpiarFormulario() {
      this.usuario = {
        nombre: '',
        correo: '',
        contraseña: '',
        rol: ''
      };
    }
  }
}
</script>
<style>
  body, html {
    margin: 0;
    padding: 0;
  }
</style>

<style scoped>
  
.registro-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #a1c4fd 50%, #c2e9fb 75%, #fbc2eb 100%);
  background-attachment: fixed;
  margin: 0%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

/* User Icons Decoration */
.user-icon {
  position: absolute;
  opacity: 0.15;
  color: #ffffff;
  animation: float 6s ease-in-out infinite;
}

.user-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.user-icon-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 8%;
  animation-delay: 0s;
}

.user-icon-2 {
  width: 100px;
  height: 100px;
  top: 70%;
  left: 12%;
  animation-delay: 1s;
}

.user-icon-3 {
  width: 90px;
  height: 90px;
  top: 15%;
  right: 10%;
  animation-delay: 2s;
}

.user-icon-4 {
  width: 70px;
  height: 70px;
  top: 65%;
  right: 15%;
  animation-delay: 3s;
}

.user-icon-5 {
  width: 85px;
  height: 85px;
  top: 40%;
  left: 5%;
  animation-delay: 4s;
}

.user-icon-6 {
  width: 95px;
  height: 95px;
  top: 45%;
  right: 8%;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-20px) rotate(3deg);
  }
}

.registro-card {
  position: relative;
  z-index: 10;
  background: linear-gradient(138deg, #ffffff 0%, #ffeef8 25%, #e0f4ff 50%, #fff5e6 75%, #f0f0ff 100%);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 900px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
  background-color: white;
  color: black;
}

input:focus,
select:focus {
  outline: none;
  border-color: #a8edea;
  color: black;
}

select {
  cursor: pointer;
  background-color: rgb(233, 236, 230);
  color:black
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(168, 237, 234, 0.5);
}

.btn-submit:active {
  transform: translateY(0);
}

.mensaje {
  margin-top: 20px;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.mensaje.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .registro-card {
    max-width: 700px;
    padding: 35px;
  }

  .form-row {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .registro-container {
    padding: 15px;
    min-height: 100vh;
  }

  .registro-card {
    padding: 30px 25px;
    max-width: 100%;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 25px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-group {
    margin-bottom: 18px;
    width: 100%;
  }

  label {
    font-size: 13px;
  }

  input,
  select {
    padding: 10px;
    font-size: 13px;
    width: 100%;
  }

  .btn-submit {
    padding: 12px;
    font-size: 15px;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .registro-container {
    padding: 10px;
  }

  .registro-card {
    padding: 25px 20px;
    border-radius: 8px;
  }

  h2 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    padding: 10px;
    font-size: 12px;
  }

  .btn-submit {
    padding: 11px;
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .mensaje {
    padding: 10px;
    font-size: 13px;
    margin-top: 15px;
  }
}

@media (max-width: 360px) {
  .registro-card {
    padding: 20px 15px;
  }

  h2 {
    font-size: 20px;
  }

  input,
  select {
    padding: 9px;
    font-size: 11px;
  }

  .btn-submit {
    padding: 10px;
    font-size: 13px;
  }

  .form-group {
    margin-bottom: 12px;
  }
}

/* Orientación horizontal en móviles */
@media (max-height: 600px) and (orientation: landscape) {
  .registro-container {
    min-height: auto;
    padding: 15px 20px;
  }

  .registro-card {
    margin: 15px auto;
    padding: 20px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .form-group {
    margin-bottom: 12px;
  }
}
</style>
