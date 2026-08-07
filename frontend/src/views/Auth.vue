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
      ? "https://proyectovue-production-73f7.up.railway.app/api/auth/login"
      : "https://proyectovue-production-73f7.up.railway.app/api/auth/register";

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
        "https://proyectovue-production-73f7.up.railway.app/api/auth/me",
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

/* Fondo del formulario */
form{

    width:420px;

    margin:50px auto;

    padding:35px;

    background:#ffffff;

    border-radius:18px;

    box-shadow:0 15px 35px rgba(0,0,0,.12);

    display:flex;

    flex-direction:column;

    gap:20px;

    animation:aparecer .5s ease;

}

/* Cada grupo */
form div{

    display:flex;

    flex-direction:column;

}

/* Etiquetas */

label{

    margin-bottom:8px;

    font-size:15px;

    font-weight:600;

    color:#374151;

}

/* Cajas de texto */

input{

    padding:14px 16px;

    border:1px solid #d1d5db;

    border-radius:10px;

    font-size:15px;

    transition:.25s;

    outline:none;

    background:#f9fafb;

}

input:focus{

    border-color:#2563eb;

    background:white;

    box-shadow:0 0 0 4px rgba(37,99,235,.15);

}

/* Placeholders */

input::placeholder{

    color:#9ca3af;

}

/* Botón */

button{

    margin-top:10px;

    padding:14px;

    border:none;

    border-radius:10px;

    background:linear-gradient(135deg,#2563eb,#1d4ed8);

    color:white;

    font-size:16px;

    font-weight:bold;

    cursor:pointer;

    transition:.25s;

}

button:hover{

    transform:translateY(-2px);

    box-shadow:0 10px 20px rgba(37,99,235,.30);

}

button:active{

    transform:scale(.98);

}

/* Error */

.error{

    background:#fee2e2;

    color:#b91c1c;

    border-left:5px solid #dc2626;

    padding:12px;

    border-radius:8px;

    font-size:14px;

}

/* Texto inferior */

.toggle-text{

    margin-top:25px;

    text-align:center;

    color:#6b7280;

    font-size:15px;

}

/* Link */

.toggle-link{

    color:#2563eb;

    font-weight:bold;

    cursor:pointer;

    transition:.25s;

}

.toggle-link:hover{

    color:#1d4ed8;

    text-decoration:underline;

}

/* Animación */

@keyframes aparecer{

    from{

        opacity:0;

        transform:translateY(20px);

    }

    to{

        opacity:1;

        transform:translateY(0);

    }

}

/* Responsive */

@media(max-width:500px){

    form{

        width:90%;

        padding:25px;

    }

}

</style>