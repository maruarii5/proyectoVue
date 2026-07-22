<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Catálogo de Municipios"
            @nuevo="nuevoMunicipio"
            @buscar="filtrarMunicipios"
        />

        <CrudTable
            :columns="columnas"
            :rows="municipiosFiltrados"
            idField="idMunicipio"
            @edit="editarMunicipio"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="municipio.idMunicipio ? 'Editar Municipio' : 'Nuevo Municipio'"
        >

            <CrudInput
                label="Nombre del Municipio"
                placeholder="Escribe el nombre..."
                v-model="municipio.Nombre"
            />

            <CrudSelect
                label="Estado"
                v-model="municipio.idEstado"
                :options="estados"
                valueField="idEstado"
                textField="Nombre"
            />

            <template #footer>

                <CrudButton
                    color="success"
                    @click="guardarMunicipio"
                >
                    Guardar
                </CrudButton>

                <CrudButton
                    color="secondary"
                    @click="mostrarModal=false"
                >
                    Cancelar
                </CrudButton>

            </template>

        </CrudModal>

        <ConfirmDialog
            v-model="mostrarEliminar"
            mensaje="¿Deseas eliminar este municipio?"
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

//========================
// Variables
//========================

const municipios = ref([]);

const estados = ref([]);

const textoBusqueda = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const idEliminar = ref(null);

const municipio = ref({

    idMunicipio: null,

    Nombre: "",

    idEstado: ""

});

//========================
// Columnas
//========================

const columnas = [

    {
        key: "idMunicipio",
        label: "ID"
    },

    {
        key: "Nombre",
        label: "Municipio"
    },

    {
        key: "Estado",
        label: "Estado"
    }

];

//========================
// Filtro
//========================

const municipiosFiltrados = computed(() => {

    if (!textoBusqueda.value.trim()) {

        return municipios.value;

    }

    return municipios.value.filter(item =>

        item.Nombre
            .toLowerCase()
            .includes(textoBusqueda.value.toLowerCase())

        ||

        item.Estado
            .toLowerCase()
            .includes(textoBusqueda.value.toLowerCase())

    );

});

//========================
// Buscar
//========================

function filtrarMunicipios(texto){

    textoBusqueda.value = texto;

}

//========================
// Cargar Municipios
//========================

async function cargarMunicipios(){

    try{

        municipios.value = await api.get("/municipios");

    }

    catch(error){

        alert(error.message);

    }

}

//========================
// Cargar Estados
//========================

async function cargarEstados(){

    try{

        estados.value = await api.get("/estados");

    }

    catch(error){

        alert(error.message);

    }

}

//========================
// Nuevo
//========================

function nuevoMunicipio(){

    municipio.value = {

        idMunicipio:null,

        Nombre:"",

        idEstado:""

    };

    mostrarModal.value = true;

}

//========================
// Editar
//========================

function editarMunicipio(item){

    municipio.value = {

        idMunicipio:item.idMunicipio,

        Nombre:item.Nombre,

        idEstado:item.idEstado

    };

    mostrarModal.value = true;

}

//========================
// Guardar
//========================

async function guardarMunicipio(){

    if(!municipio.value.Nombre.trim()){

        alert("Escribe el nombre.");

        return;

    }

    if(!municipio.value.idEstado){

        alert("Selecciona un estado.");

        return;

    }

    try{

        if(municipio.value.idMunicipio){

            await api.put(

                `/municipios/${municipio.value.idMunicipio}`,

                {

                    Nombre: municipio.value.Nombre,

                    idEstado: municipio.value.idEstado

                }

            );

        }

        else{

            await api.post(

                "/municipios",

                {

                    Nombre: municipio.value.Nombre,

                    idEstado: municipio.value.idEstado

                }

            );

        }

        mostrarModal.value = false;

        await cargarMunicipios();

    }

    catch(error){

        alert(error.message);

    }

}

//========================
// Eliminar
//========================

function abrirEliminar(item){

    idEliminar.value = item.idMunicipio;

    mostrarEliminar.value = true;

}

async function confirmarEliminar(){

    try{

        await api.delete(

            `/municipios/${idEliminar.value}`

        );

        mostrarEliminar.value = false;

        await cargarMunicipios();

    }

    catch(error){

        mostrarEliminar.value = false;

        alert(error.message);

    }

}

//========================
// Inicio
//========================

onMounted(async()=>{

    await cargarEstados();

    await cargarMunicipios();

});

</script>

<style scoped>

.contenedor{

    padding:30px;

    max-width:1200px;

    margin:auto;

}

</style>