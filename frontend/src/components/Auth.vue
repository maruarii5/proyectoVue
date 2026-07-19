<template>
  <div class="dark-container">
    <div class="auth-card">
      <div class="card-header">
        <h2>{{ isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta' }}</h2>
        <p class="subtitle">
          {{ isLogin ? 'Ingresa tus credenciales para continuar' : 'Regístrate para acceder al sistema' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        
        <div class="input-group" v-if="!isLogin">
          <label for="nombre">Nombre Completo</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="nombre" 
            placeholder="Ej. Juan Pérez"
          >
        </div>

        <div class="input-group">
          <label for="usuario">Usuario (Correo Electrónico)</label>
          <input 
            type="email" 
            id="usuario" 
            v-model="usuario" 
            placeholder="tu@correo.com"
          >
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Mínimo 8 caracteres"
          >
        </div>

        <div v-if="errorMessage" class="message error-msg">{{ errorMessage }}</div>
        <div v-if="successMessage" class="message success-msg">{{ successMessage }}</div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarme') }}
        </button>
      </form>

      <div class="toggle-container">
        <p>
          {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
          <span @click="toggleMode" class="toggle-link">
            {{ isLogin ? 'Regístrate acá' : 'Inicia sesión acá' }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();

const isLogin = ref(true);
const isLoading = ref(false);
const nombre = ref('');
const usuario = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = '';
  successMessage.value = '';
  nombre.value = '';
  usuario.value = '';
  password.value = '';
};

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!isLogin.value && !nombre.value) {
    errorMessage.value = 'El nombre es obligatorio.';
    return;
  }
  if (!usuario.value || !password.value) {
    errorMessage.value = 'Completa todos los campos.';
    return;
  }
  if (password.value.length < 8) {
    errorMessage.value = 'La contraseña debe tener mínimo 8 caracteres.';
    return;
  }

  isLoading.value = true;
  try {
    const endpoint = isLogin.value ? 'http://localhost:3000/login' : 'http://localhost:3000/register';
    
    const payload = isLogin.value 
      ? { usuario: usuario.value, password: password.value }
      : { nombre: nombre.value, usuario: usuario.value, password: password.value, idRol: 2 };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ocurrió un error en el servidor.');
    }

    if (isLogin.value) {
      successMessage.value = '¡Conectado con éxito! Redirigiendo...';
      localStorage.setItem('usuarioLogueado', JSON.stringify(data.user));
      
      setTimeout(() => {
        router.push('/dashboard'); 
      }, 1000);
    } else {
      successMessage.value = '¡Cuenta creada con éxito! Ahora inicia sesión.';
      setTimeout(() => {
        toggleMode(); 
      }, 2000);
    }

  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.dark-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #121212; 
  color: #e0e0e0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.auth-card {
  background-color: #1e1e2f; 
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
  border: 1px solid #2a2a40;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.card-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #ffffff;
}

.subtitle {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #a0a0b0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: bold;
  color: #b0b0c0;
}

.input-group input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #33334d;
  background-color: #252538;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.input-group input:focus {
  border-color: #6c63ff; 
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
}

.btn-primary {
  margin-top: 10px;
  padding: 12px;
  background-color: #6c63ff; 
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #574bfa;
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-primary:disabled {
  background-color: #4a4a68;
  cursor: not-allowed;
}

.message {
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.error-msg {
  background-color: rgba(255, 76, 76, 0.1);
  color: #ff4c4c;
  border: 1px solid #ff4c4c;
}

.success-msg {
  background-color: rgba(76, 255, 114, 0.1);
  color: #4cff72;
  border: 1px solid #4cff72;
}

.toggle-container {
  margin-top: 25px;
  text-align: center;
  font-size: 0.9rem;
  color: #a0a0b0;
}

.toggle-link {
  color: #6c63ff;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
  transition: color 0.3s;
}

.toggle-link:hover {
  color: #8b85ff;
  text-decoration: underline;
}
</style>