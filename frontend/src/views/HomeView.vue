<template>
  <div class="home">
    <h1>Panel de Administración Escolar</h1>
    <p>Selecciona una sección para gestionar los registros:</p>
    
    <div class="menu-grid">
      <router-link to="/alumnos" class="card">
        <h3>CRUD Alumnos</h3>
        <p>Gestionar inscripciones y datos de alumnos.</p>
      </router-link>

      <router-link to="/profesores" class="card">
        <h3>CRUD Profesores</h3>
        <p>Control de docentes y asignaciones.</p>
      </router-link>

      <router-link to="/materias" class="card">
        <h3>CRUD Materias</h3>
        <p>Administración del plan de estudios.</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home { text-align: center; padding: 40px; font-family: sans-serif; }
.menu-grid { display: flex; gap: 20px; justify-content: center; margin-top: 30px; }
.card {
  text-decoration: none; color: #2c3e50; border: 1px solid #ddd;
  padding: 20px; border-radius: 8px; width: 200px; transition: 0.3s;
  background: #fdfdfd; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.card:hover { transform: translateY(-5px); border-color: #42b883; }
h3 { color: #42b883; margin-bottom: 10px; }
</style>