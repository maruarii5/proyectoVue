<template>
  <div class="contenedor">
    <CrudToolbar
      titulo="Datos Personales"
      subtitulo="Administración de datos personales"
      @buscar="filtrarDatos"
      @nuevo="nuevoRegistro"
    />

    <CrudTable
      :columns="columnas"
      :rows="datosFiltrados"
      idField="idDatosP"
      @edit="editarRegistro"
      @delete="abrirEliminar"
    />

    <CrudModal
      v-model="mostrarModal"
      :titulo="dato.idDatosP ? 'Editar Datos Personales' : 'Nuevo Registro'"
    >
      <CrudInput
        v-model="dato.Nombre"
        label="Nombre"
        placeholder="Nombre completo"
      />

      <CrudInput
        v-model="dato.FechaNacimiento"
        label="Fecha de Nacimiento"
        type="date"
      />

      <CrudInput
        v-model="dato.Curp"
        label="CURP"
      />

      <CrudInput
        v-model="dato.Email"
        label="Correo Electrónico"
        type="email"
      />

      <CrudInput
        v-model="dato.Telefono"
        label="Teléfono"
      />

      <CrudInput
        v-model="dato.Calle"
        label="Calle"
      />

      <CrudInput
        v-model="dato.NumE"
        label="Número Exterior"
        type="number"
      />

      <CrudInput
        v-model="dato.NumI"
        label="Número Interior"
        type="number"
      />

      <CrudInput
        v-model="dato.CP"
        label="Código Postal"
        type="number"
      />

      <CrudSelect
        v-model="dato.idGenero"
        label="Género"
        :options="listaGeneros"
        optionLabel="Genero"
        optionValue="idGenero"
        placeholder="Seleccione un género"
      />

      <CrudSelect
        v-model="dato.idEstado"
        label="Estado"
        :options="listaEstados"
        optionLabel="Nombre"
        optionValue="idEstado"
        placeholder="Seleccione un estado"
      />

      <CrudSelect
        v-model="dato.idMunicipio"
        label="Municipio"
        :options="listaMunicipios"
        optionLabel="Nombre"
        optionValue="idMunicipio"
        placeholder="Seleccione un municipio"
      />

      <CrudSelect
        v-model="dato.idLocalidad"
        label="Localidad"
        :options="listaLocalidades"
        optionLabel="Nombre"
        optionValue="idLocalidad"
        placeholder="Seleccione una localidad"
      />

      <template #footer>
        <CrudButton color="success" @click="guardarRegistro">
          Guardar
        </CrudButton>
        <CrudButton color="secondary" @click="mostrarModal = false">
          Cancelar
        </CrudButton>
      </template>
    </CrudModal>

    <ConfirmDialog
      v-model="mostrarEliminar"
      titulo="Eliminar Registro"
      mensaje="¿Deseas eliminar este registro?"
      @confirmar="confirmarEliminar"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import CrudToolbar from "../components/crud/CrudToolbar.vue";
import CrudTable from "../components/crud/CrudTable.vue";
import CrudModal from "../components/crud/CrudModal.vue";
import CrudInput from "../components/crud/CrudInput.vue";
import CrudSelect from "../components/crud/CrudSelect.vue";
import CrudButton from "../components/crud/CrudButton.vue";
import ConfirmDialog from "../components/crud/ConfirmDialog.vue";

// Variables
const registros = ref([]);
const listaEstados = ref([]);
const listaMunicipios = ref([]);
const listaLocalidades = ref([]);
const listaGeneros = ref([]);

const textoBuscar = ref("");
const mostrarModal = ref(false);
const mostrarEliminar = ref(false);
const idEliminar = ref(null);

const dato = ref({
  idDatosP: null,
  Nombre: "",
  FechaNacimiento: "",
  Curp: "",
  Email: "",
  Telefono: "",
  Calle: "",
  NumE: null,
  NumI: null,
  CP: null,
  idEstado: null,
  idMunicipio: null,
  idLocalidad: null,
  idGenero: null
});

// Columnas
const columnas = [
  { key: "Nombre", label: "Nombre" },
  { key: "Curp", label: "CURP" },
  { key: "Genero", label: "Género" },
  { key: "Estado", label: "Estado" },
  { key: "Municipio", label: "Municipio" },
  { key: "Localidad", label: "Localidad" }
];

// Buscar
const datosFiltrados = computed(() => {
  if (!textoBuscar.value) return registros.value;
  return registros.value.filter(item =>
    (item.Nombre || "")
      .toLowerCase()
      .includes(textoBuscar.value.toLowerCase())
  );
});

function filtrarDatos(texto) {
  textoBuscar.value = texto;
}

// Cargar registros
async function cargarDatos() {
  try {
    const response = await fetch("https://proyectovue-production-73f7.up.railway.app/api/datospersonales", {
      credentials: "include"
    });
    registros.value = await response.json();
  } catch (error) {
    console.error("Error al cargar registros:", error);
  }
}

// Cargar catálogos con manejo de excepciones
async function cargarEstados() {
  try {
    const response = await fetch("https://proyectovue-production-73f7.up.railway.app/api/datospersonales/estados", { credentials: "include" });
    listaEstados.value = await response.json();
  } catch (e) { console.error("Error cargando estados", e); }
}

async function cargarMunicipios() {
  try {
    const response = await fetch("https://proyectovue-production-73f7.up.railway.app/api/datospersonales/municipios", { credentials: "include" });
    listaMunicipios.value = await response.json();
  } catch (e) { console.error("Error cargando municipios", e); }
}

async function cargarLocalidades() {
  try {
    const response = await fetch("https://proyectovue-production-73f7.up.railway.app/api/datospersonales/localidades", { credentials: "include" });
    listaLocalidades.value = await response.json();
  } catch (e) { console.error("Error cargando localidades", e); }
}

async function cargarGeneros() {
  try {
    const response = await fetch("https://proyectovue-production-73f7.up.railway.app/api/datospersonales/generos", { credentials: "include" });
    listaGeneros.value = await response.json();
  } catch (e) { console.error("Error cargando géneros", e); }
}

// Validación de CURP
async function validarCURP() {

    const curp = dato.value.Curp?.trim().toUpperCase();

    if (!curp) {

        alert("La CURP es obligatoria.");

        return false;

    }

    // Formato oficial de CURP
    const regexCURP = /^[A-Z]{4}\d{6}[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;

    if (!regexCURP.test(curp)) {

        alert("La CURP no tiene un formato válido.");

        return false;

    }

    return true;

}

// Acciones modal
function nuevoRegistro() {
  dato.value = {
    idDatosP: null,
    Nombre: "",
    FechaNacimiento: "",
    Curp: "",
    Email: "",
    Telefono: "",
    Calle: "",
    NumE: null,
    NumI: null,
    CP: null,
    idEstado: null,
    idMunicipio: null,
    idLocalidad: null,
    idGenero: null
  };
  mostrarModal.value = true;
}

function editarRegistro(item) {
  dato.value = { ...item };
  mostrarModal.value = true;
}

async function guardarRegistro() {
  if (!dato.value.Nombre || !dato.value.Curp) {
    alert("Ingresa al menos el Nombre y la CURP.");
    return;
  }

  // ✅ CORREGIDO: Se añade 'await'
  const esCurpValida = await validarCURP();
  if (!esCurpValida) {
    alert("La CURP no existe o no tiene un formato válido.");
    return;
  }

  try {
    let url = "https://proyectovue-production-73f7.up.railway.app/api/datospersonales";
    let metodo = "POST";

    if (dato.value.idDatosP) {
      url += `/${dato.value.idDatosP}`;
      metodo = "PUT";
    }

    const response = await fetch(url, {
      method: metodo,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dato.value)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al guardar");

    mostrarModal.value = false;
    cargarDatos();
  } catch (error) {
    alert(error.message);
  }
}

// Eliminar
function abrirEliminar(item) {
  idEliminar.value = item.idDatosP;
  mostrarEliminar.value = true;
}

async function confirmarEliminar() {
  try {
    const response = await fetch(`https://proyectovue-production-73f7.up.railway.app/api/datospersonales/${idEliminar.value}`, {
      method: "DELETE",
      credentials: "include"
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al eliminar");

    mostrarEliminar.value = false;
    cargarDatos();
  } catch (error) {
    alert(error.message);
  }
}

onMounted(async () => {
  await Promise.all([
    cargarEstados(),
    cargarMunicipios(),
    cargarLocalidades(),
    cargarGeneros(),
    cargarDatos()
  ]);
});
</script>

<style scoped>
.contenedor {
  padding: 30px;
}
:deep(.crud-input),
:deep(.crud-select) {
  margin-bottom: 18px;
}
@media (max-width: 768px) {
  .contenedor {
    padding: 15px;
  }
}
</style>