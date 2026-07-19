<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api/alumnos'
const alumnos = ref([])
const nombre = ref('')
const matricula = ref('')
const idEdicion = ref(null)

// Obtener datos de SQLite (Read)
const obtenerAlumnos = async () => {
  const res = await fetch(API_URL)
  alumnos.value = await res.json()
}

// Crear o Actualizar registro (Create / Update)
const guardar = async () => {
  const datos = { nombre: nombre.value, matricula: matricula.value }
  
  if (idEdicion.value) {
    // Actualizar
    await fetch(`${API_URL}/${idEdicion.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    idEdicion.value = null
  } else {
    // Crear
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
  }
  
  nombre.value = ''
  matricula.value = ''
  obtenerAlumnos()
}

// Preparar formulario para editar
const seleccionarEditar = (alumno) => {
  nombre.value = alumno.nombre
  matricula.value = alumno.matricula
  idEdicion.value = alumno.id
}

// Eliminar registro (Delete)
const eliminar = async (id) => {
  if (confirm('¿Seguro que deseas eliminar este alumno?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    obtenerAlumnos()
  }
}

// Cargar los alumnos al abrir la página
onMounted(obtenerAlumnos)
</script>

<template>
  <div class="crud-container">
    <router-link to="/" class="btn-back">← Volver al Inicio</router-link>
    <h2>Gestión de Alumnos (Base de Datos)</h2>

    <form @submit.prevent="guardar" class="form">
      <input v-model="nombre" placeholder="Nombre completo" required />
      <input v-model="matricula" placeholder="Matrícula" required />
      <button type="submit">{{ idEdicion ? 'Actualizar' : 'Registrar' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Matrícula</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="al in alumnos" :key="al.id">
          <td>{{ al.id }}</td>
          <td>{{ al.nombre }}</td>
          <td>{{ al.matricula }}</td>
          <td>
            <button @click="seleccionarEditar(al)" class="btn-edit">Editar</button>
            <button @click="eliminar(al.id)" class="btn-delete">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.crud-container { max-width: 700px; margin: 30px auto; font-family: sans-serif; }
.btn-back { display: inline-block; margin-bottom: 20px; color: #42b883; text-decoration: none; }
.form { display: flex; gap: 10px; margin-bottom: 20px; }
input { padding: 8px; flex: 1; border: 1px solid #ccc; border-radius: 4px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
th { background-color: #f4f4f4; }
button { padding: 6px 12px; cursor: pointer; border: none; border-radius: 4px; }
.form button { background: #42b883; color: white; }
.btn-edit { background: #35495e; color: white; margin-right: 5px; }
.btn-delete { background: #e74c3c; color: white; }
</style>