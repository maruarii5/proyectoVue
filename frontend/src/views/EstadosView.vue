 <template>
  <div class="crud-container">
    <h2>Gestión de Estados</h2>
    
    <div class="form-card">
      <input 
        type="text" 
        v-model="estadoActual.Nombre" 
        placeholder="Nombre del Estado (Ej. San Luis Potosí)"
      >
      <button @click="guardarEstado" class="btn-guardar">
        {{ estadoActual.idEstado ? 'Actualizar' : 'Agregar' }}
      </button>
      <button v-if="estadoActual.idEstado" @click="cancelarEdicion" class="btn-cancelar">Cancelar</button>
    </div>

    <table class="dark-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre del Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="estado in estados" :key="estado.idEstado">
          <td>{{ estado.idEstado }}</td>
          <td>{{ estado.Nombre }}</td>
          <td class="acciones">
            <button @click="editarEstado(estado)" class="btn-editar">Editar</button>
            <button @click="eliminarEstado(estado.idEstado)" class="btn-borrar">Borrar</button>
          </td>
        </tr>
        <tr v-if="estados.length === 0">
          <td colspan="3" style="text-align: center;">No hay estados registrados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const estados = ref([]);
const estadoActual = ref({ idEstado: null, Nombre: '' });

const API_URL = 'http://localhost:3000/api/estados';

// 1. Cargar Estados (GET)
const cargarEstados = async () => {
  const res = await fetch(API_URL);
  estados.value = await res.json();
};

// 2. Guardar (POST o PUT)
const guardarEstado = async () => {
  if (!estadoActual.value.Nombre) return alert("Escribe un nombre, w.");

  const metodo = estadoActual.value.idEstado ? 'PUT' : 'POST';
  const url = estadoActual.value.idEstado ? `${API_URL}/${estadoActual.value.idEstado}` : API_URL;

  await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Nombre: estadoActual.value.Nombre })
  });

  estadoActual.value = { idEstado: null, Nombre: '' }; // Limpiar formulario
  cargarEstados(); // Recargar tabla
};

// 3. Preparar Edición
const editarEstado = (estado) => {
  estadoActual.value = { ...estado }; // Clonar los datos al formulario
};

const cancelarEdicion = () => {
  estadoActual.value = { idEstado: null, Nombre: '' };
};

// 4. Eliminar (DELETE)
const eliminarEstado = async (id) => {
  if (!confirm("¿Seguro que quieres borrar este estado?")) return;

  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  
  if (data.error) alert(data.error); // Por si tiene llave foránea
  else cargarEstados();
};

// Al abrir la página, cargamos los datos
onMounted(() => {
  cargarEstados();
});
</script>

<style scoped>
.crud-container { max-width: 800px; margin: 0 auto; color: #e0e0e0; }
h2 { margin-bottom: 20px; }

.form-card {
  background: #1e1e2f; padding: 20px; border-radius: 8px;
  display: flex; gap: 10px; margin-bottom: 20px; border: 1px solid #2a2a40;
}
input {
  flex: 1; padding: 10px; border-radius: 5px; border: 1px solid #33334d;
  background: #252538; color: white; outline: none;
}
button { padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
.btn-guardar { background: #6c63ff; color: white; }
.btn-cancelar { background: #555; color: white; }
.btn-editar { background: #f39c12; color: white; margin-right: 5px; }
.btn-borrar { background: #e74c3c; color: white; }

.dark-table { width: 100%; border-collapse: collapse; background: #1e1e2f; border-radius: 8px; overflow: hidden; }
.dark-table th, .dark-table td { padding: 15px; text-align: left; border-bottom: 1px solid #2a2a40; }
.dark-table th { background: #252538; }
.acciones { width: 160px; }
</style>