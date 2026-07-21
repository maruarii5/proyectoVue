<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h2>

    <form @submit.prevent="handleSubmit">
            <!-- Nombre (solo aparece al registrarse) -->
      <div v-if="!isLogin">

        <label for="nombre">Nombre:</label>

        <input
          type="text"
          id="nombre"
          v-model="nombre"
          placeholder="Escribe tu nombre completo"
        >

      </div>

      <!-- Usuario -->
      <div>

        <label for="usuario">Usuario:</label>

        <input
          type="text"
          id="usuario"
          v-model="usuario"
          placeholder="Escribe tu usuario"
        >

      </div>

      <!-- Campo de Contraseña -->
      <div>
        <label for="password">Contraseña:</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="Mínimo 8 caracteres"
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
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

// Variables reactivas
const isLogin = ref(true); // Empieza en modo Login
// Nombre completo (solo se usa al registrarse)
const nombre = ref("");

// Nombre de usuario para iniciar sesión
const usuario = ref("");

// Contraseña
const password = ref("");

// Mensaje de error
const errorMessage = ref('');

// Acceso al almacén de autenticación
const authStore = useAuthStore();

// Permite cambiar de página
const router = useRouter();

// Cambiar entre Login y Registro
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = ''; // Limpiamos errores al cambiar
  nombre.value = "";
  usuario.value = "";
  password.value = "";
};

// Validaciones y envío de datos
const handleSubmit = async () => {
  errorMessage.value = ''; // Reiniciar errores

  // Si falta el usuario o la contraseña
  if (!usuario.value || !password.value) {
    errorMessage.value = "¡Ey! No dejes campos vacíos.";
    return;
  }

  // Si estamos registrando un usuario, verificamos el nombre.
  if (!isLogin.value && !nombre.value) {
    errorMessage.value = "Debes escribir tu nombre.";
    return;
  }

  // La contraseña debe tener al menos 8 caracteres
  if (password.value.length < 8) {
    errorMessage.value = "La contraseña debe tener mínimo 8 caracteres.";
    return;
  }

  // 2. Si todo está bien, mandamos la info al Backend
  try {
    const endpoint = isLogin.value
      ? "http://localhost:3000/api/auth/login"
      : "http://localhost:3000/api/auth/register";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        nombre: nombre.value,
        usuario: usuario.value,
        password: password.value,
        idRol: 2
      })
    });

    const data = await response.json();

    // Si el servidor respondió con un error
    if (!response.ok) {
      throw new Error(data.message);
    }

    if (isLogin.value) {
      const respuesta = await fetch(
        "http://localhost:3000/api/auth/me",
        {
          method: "GET",
          credentials: "include"
        }
      );

      const usuarioAutenticado = await respuesta.json();
      // Guarda el usuario autenticado en Pinia
      authStore.setUsuario(usuarioAutenticado.usuario);

      // Redirige al Dashboard
      router.push("/dashboard");
    } else {
      alert("Usuario registrado correctamente.");
    }


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