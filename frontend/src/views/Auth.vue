<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Campo de Correo -->
      <div>
        <label for="email">Correo:</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="tu@correo.com"
        >
      </div>

      <!-- Campo de Contraseña -->
      <div>
        <label for="password">Contraseña:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="Mínimo 6 caracteres"
        >
      </div>

      <!-- Mensaje de Error (si algo sale mal) -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <!-- Botón de Enviar -->
      <button type="submit">
        {{ isLogin ? 'Entrar' : 'Registrarme' }}
      </button>
    </form>

    <!-- Botón para cambiar entre Login y Registro -->
    <p class="toggle-text">
      {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
      <span @click="toggleMode" class="toggle-link">
        {{ isLogin ? 'Regístrate acá' : 'Inicia sesión acá' }}
      </span>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Variables reactivas
const isLogin = ref(true); // Empieza en modo Login
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Cambiar entre Login y Registro
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = ''; // Limpiamos errores al cambiar
  email.value = '';
  password.value = '';
};

// Validaciones y envío de datos
const handleSubmit = async () => {
  errorMessage.value = ''; // Reiniciar errores

  // 1. Validaciones acá bien hechas en el frontend
  if (!email.value || !password.value) {
    errorMessage.value = '¡Ey! No dejes campos vacíos.';
    return;
  }
  
  if (!email.value.includes('@')) {
    errorMessage.value = 'Pon un correo válido.';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  // 2. Si todo está bien, mandamos la info al Backend
  try {
    const endpoint = isLogin.value ? 'http://localhost:3000/login' : 'http://localhost:3000/register';
    
    // Aquí hacemos la petición a tu backend
    /* 
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el servidor');
    }

    console.log("¡Todo chido!", data);
    // Aquí guardarías el token (localStorage) y rediriges al usuario
    */
   
    console.log(`Simulando envío a: ${endpoint}`, { email: email.value, password: password.value });
    alert(isLogin.value ? '¡Sesión iniciada con éxito!' : '¡Cuenta creada con éxito!');

  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
/* Un poco de estilo básico para que no se vea feo */
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
.error {
  color: red;
  font-weight: bold;
}
.toggle-text {
  margin-top: 15px;
}
.toggle-link {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>