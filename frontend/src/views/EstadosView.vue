<template>

    <div class="contenedor">

        <!-- Barra superior -->
        <CrudToolbar
            titulo="Catálogo de Estados"
            @nuevo="nuevoEstado"
            @buscar="filtrarEstados"
        />

        <!-- Tabla -->
        <CrudTable
            :columns="columnas"
            :rows="estadosFiltrados"
            idField="idEstado"
            @edit="editarEstado"
            @delete="abrirEliminar"
        />

        <!-- Modal -->
        <CrudModal
            v-model="mostrarModal"
            :titulo="estado.idEstado ? 'Editar Estado' : 'Nuevo Estado'"
        >

            <CrudInput
                label="Nombre del Estado"
                placeholder="Escribe el nombre..."
                v-model="estado.Nombre"
            />

            <template #footer>

                <CrudButton
                    color="success"
                    @click="guardarEstado"
                >

                    Guardar

                </CrudButton>

                <CrudButton
                    color="secondary"
                    @click="mostrarModal = false"
                >

                    Cancelar

                </CrudButton>

            </template>

        </CrudModal>

        <!-- Confirmación -->
        <ConfirmDialog
            v-model="mostrarEliminar"
            mensaje="¿Deseas eliminar este estado?"
            @confirmar="confirmarEliminar"
        />

    </div>

</template>
<script setup>

import { ref, computed, onMounted } from "vue";

import api from "../services/api";

import CrudToolbar from "../components/crud/CrudToolbar.vue";
import CrudTable from "../components/crud/CrudTable.vue";
import CrudModal from "../components/crud/CrudModal.vue";
import CrudButton from "../components/crud/CrudButton.vue";
import CrudInput from "../components/crud/CrudInput.vue";
import CrudSelect from "../components/crud/CrudSelect.vue";
import ConfirmDialog from "../components/crud/ConfirmDialog.vue";
// =============================
// Variables
// =============================

const estados = ref([]);

const textoBusqueda = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const idEliminar = ref(null);

const estado = ref({

    idEstado: null,

    Nombre: ""

});

// =============================
// Columnas de la tabla
// =============================

const columnas = [

    {
        key: "idEstado",
        label: "ID"
    },

    {
        key: "Nombre",
        label: "Nombre"
    }

];

// =============================
// Filtro
// =============================

const estadosFiltrados = computed(() => {

    if (!textoBusqueda.value.trim()) {

        return estados.value;

    }

    return estados.value.filter(item =>

        item.Nombre
            .toLowerCase()
            .includes(textoBusqueda.value.toLowerCase())

    );

});

// =============================
// Buscar
// =============================

function filtrarEstados(texto) {

    textoBusqueda.value = texto;

}

// =============================
// Obtener Estados
// =============================

async function cargarEstados() {

    try {

        estados.value = await api.get("/estados");

    }

    catch (error) {

        alert(error.message);

    }

}

// =============================
// Nuevo
// =============================

function nuevoEstado() {

    estado.value = {

        idEstado: null,

        Nombre: ""

    };

    mostrarModal.value = true;

}

// =============================
// Editar
// =============================

function editarEstado(item) {

    estado.value = {

        ...item

    };

    mostrarModal.value = true;

}

// =============================
// Guardar
// =============================

async function guardarEstado() {

    if (!estado.value.Nombre.trim()) {

        alert("Escribe un nombre.");

        return;

    }

    try {

        if (estado.value.idEstado) {

            await api.put(

                `/estados/${estado.value.idEstado}`,

                {

                    Nombre: estado.value.Nombre

                }

            );

        }

        else {

            await api.post(

                "/estados",

                {

                    Nombre: estado.value.Nombre

                }

            );

        }

        mostrarModal.value = false;

        await cargarEstados();

    }

    catch (error) {

        alert(error.message);

    }

}

// =============================
// Eliminar
// =============================

function abrirEliminar(item) {

    idEliminar.value = item.idEstado;

    mostrarEliminar.value = true;

}

async function confirmarEliminar() {

    try {

        await api.delete(

            `/estados/${idEliminar.value}`

        );

        mostrarEliminar.value = false;

        await cargarEstados();

    }

    catch (error) {

        mostrarEliminar.value = false;

        alert(error.message);

    }

}

// =============================
// Inicio
// =============================

onMounted(() => {

    cargarEstados();

});

</script>

<style scoped>

.contenedor{

    padding:30px;

    max-width:1200px;

    margin:auto;

}

</style>