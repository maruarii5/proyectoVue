<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Carreras"
            subtitulo="Administración de carreras"
            @buscar="filtrarCarreras"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="carrerasFiltradas"
            idField="idCarrera"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.idCarrera ? 'Editar Carrera' : 'Nueva Carrera'"
        >

            <CrudInput
                v-model="registro.NombreCarreras"
                label="Nombre de la Carrera"
                placeholder="Ingresa el nombre de la carrera"
            />

            <CrudSelect
                v-model="registro.Estatus"
                label="Estado"
                :options="[
                    { id:1, nombre:'Activo' },
                    { id:0, nombre:'Inactivo' }
                ]"
                optionLabel="nombre"
                optionValue="id"
                placeholder="Seleccione un estado"
            />

            <template #footer>

                <CrudButton
                    color="success"
                    @click="guardarRegistro"
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
            titulo="Eliminar Carrera"
            mensaje="¿Deseas eliminar esta carrera?"
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

//=====================================
// Variables
//=====================================

const registros = ref([]);

const textoBuscar = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const idEliminar = ref(null);

const registro = ref({

    idCarrera:null,

    NombreCarreras:"",

    Estatus:1

});

//=====================================
// Columnas
//=====================================

const columnas=[

    {

        key:"NombreCarreras",

        label:"Carrera"

    },

    {

        key:"Estatus",

        label:"Estado"

    }

];

//=====================================
// Buscar
//=====================================

const carrerasFiltradas = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.NombreCarreras

            .toLowerCase()

            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarCarreras(texto){

    textoBuscar.value = texto;

}

//=====================================
// Cargar Carreras
//=====================================

async function cargarCarreras(){

    const response = await fetch(

        "http://localhost:3000/api/carreras",

        {

            credentials:"include"

        }

    );

    registros.value = await response.json();

    registros.value = registros.value.map(item=>({

        ...item,

        Estatus:item.Estatus===1 ? "Activo" : "Inactivo"

    }));

}

//=====================================
// Nuevo
//=====================================

function nuevoRegistro(){

    registro.value={

        idCarrera:null,

        NombreCarreras:"",

        Estatus:1

    };

    mostrarModal.value=true;

}

//=====================================
// Editar
//=====================================

function editarRegistro(item){

    registro.value={

        idCarrera:item.idCarrera,

        NombreCarreras:item.NombreCarreras,

        Estatus:item.Estatus==="Activo" ? 1 : 0

    };

    mostrarModal.value=true;

}

//=====================================
// Guardar
//=====================================

async function guardarRegistro(){

    if(registro.value.NombreCarreras.trim()===""){

        alert("Escribe el nombre de la carrera.");

        return;

    }

    try{

        let url="http://localhost:3000/api/carreras";

        let metodo="POST";

        if(registro.value.idCarrera){

            url+=`/${registro.value.idCarrera}`;

            metodo="PUT";

        }

        const response=await fetch(

            url,

            {

                method:metodo,

                credentials:"include",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(registro.value)

            }

        );

        const data=await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        mostrarModal.value=false;

        cargarCarreras();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value=item.idCarrera;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://localhost:3000/api/carreras/${idEliminar.value}`,

            {

                method:"DELETE",

                credentials:"include"

            }

        );

        const data=await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        mostrarEliminar.value=false;

        cargarCarreras();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(()=>{

    cargarCarreras();

});

</script>

<style scoped>

.contenedor{

    padding:30px;

}

:deep(.crud-input){

    margin-bottom:18px;

}

:deep(.crud-select){

    margin-bottom:18px;

}

@media(max-width:768px){

    .contenedor{

        padding:15px;

    }

}

</style>