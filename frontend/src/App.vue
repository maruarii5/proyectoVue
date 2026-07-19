<template>
  <header v-if="$route.name !== 'login'" class="navbar">
    <button class="hamburger-btn" @click="menuAbierto = !menuAbierto">☰</button>
    <div class="brand">Sistema Escolar</div>
  </header>

  <aside v-if="$route.name !== 'login'" :class="['sidebar', { 'abierto': menuAbierto }]">
    <nav class="menu-links">
      <RouterLink to="/dashboard" @click="menuAbierto = false">Inicio</RouterLink>
      <RouterLink to="/estados" @click="menuAbierto = false">Tabla Estados</RouterLink>
      </nav>
  </aside>

  <main :class="['contenido-principal', { 'con-sidebar': menuAbierto && $route.name !== 'login' }]">
    <RouterView />
  </main>
</template>

<script setup>
import { ref } from 'vue';
const menuAbierto = ref(false); // Controla si el menú está abierto o cerrado
</script>

<style>
/* Reseteo general */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background-color: #121212; color: #e0e0e0; font-family: Arial, sans-serif; }

/* Navbar Superior */
.navbar {
  background: #1e1e2f;
  padding: 15px 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #2a2a40;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}
.hamburger-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}
.brand { font-size: 1.2rem; font-weight: bold; }

/* Sidebar (Menú Lateral) */
.sidebar {
  position: fixed;
  top: 56px; /* Altura de la navbar */
  left: -250px; /* Oculto por defecto */
  width: 250px;
  height: calc(100vh - 56px);
  background-color: #1e1e2f;
  border-right: 1px solid #2a2a40;
  transition: left 0.3s ease;
  z-index: 900;
  padding-top: 20px;
}
.sidebar.abierto { left: 0; } /* Clase que lo muestra */

.menu-links { display: flex; flex-direction: column; }
.menu-links a {
  color: #a0a0b0;
  text-decoration: none;
  padding: 15px 20px;
  border-bottom: 1px solid #2a2a40;
  transition: background 0.2s;
}
.menu-links a:hover, .menu-links a.router-link-active {
  background-color: #252538;
  color: #6c63ff;
  font-weight: bold;
}

/* Espacio para que el contenido no quede debajo de la navbar */
.contenido-principal {
  padding: 80px 20px 20px 20px;
  transition: margin-left 0.3s ease;
}
/* Empuja el contenido si estás en PC y el menú se abre */
@media (min-width: 768px) {
  .contenido-principal.con-sidebar { margin-left: 250px; }
}
</style>