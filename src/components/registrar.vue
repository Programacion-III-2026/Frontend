<template>
  <div class="registro-container">
    <div class="registro-card">
      <h2>Registro de Usuario</h2>
      <form @submit.prevent="registrarUsuario">
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
            <option value="user">Tecnico</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Cliente</option>
          </select>
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

<style scoped>
.registro-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.registro-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
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
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
}

select {
  cursor: pointer;
  background-color: white;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
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
</style>
