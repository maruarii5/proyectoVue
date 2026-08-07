<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Tipo de Personal"
            subtitulo="Administración de tipos de personal"
            @buscar="filtrarTipos"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="tiposFiltrados"
            idField="idTipo"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.idTipo ? 'Editar Tipo de Personal' : 'Nuevo Tipo de Personal'"
        >

            <CrudInput
                v-model="registro.Personal"
                label="Tipo de Personal"
                placeholder="Ej. Docente"
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
            titulo="Eliminar Tipo de Personal"
            mensaje="¿Deseas eliminar este tipo de personal?"
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

    idTipo:null,

    Personal:""

});

//=====================================
// Columnas
//=====================================

const columnas=[

    {

        key:"Personal",

        label:"Tipo de Personal"

    }

];

//=====================================
// Buscar
//=====================================

const tiposFiltrados = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.Personal
            .toLowerCase()
            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarTipos(texto){

    textoBuscar.value=texto;

}

//=====================================
// Cargar
//=====================================

async function cargarTipos(){

    const response=await fetch(

        "http://localhost:3000/api/tipopersonal",

        {

            credentials:"include"

        }

    );

    registros.value=await response.json();

}

//=====================================
// Nuevo
//=====================================

function nuevoRegistro(){

    registro.value={

        idTipo:null,

        Personal:""

    };

    mostrarModal.value=true;

}

//=====================================
// Editar
//=====================================

function editarRegistro(item){

    registro.value={

        ...item

    };

    mostrarModal.value=true;

}

//=====================================
// Guardar
//=====================================

async function guardarRegistro(){

    if(registro.value.Personal.trim()===""){

        alert("Escribe el tipo de personal.");

        return;

    }

    try{

        let url="http://localhost:3000/api/tipopersonal";

        let metodo="POST";

        if(registro.value.idTipo){

            url+=`/${registro.value.idTipo}`;

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

        cargarTipos();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value=item.idTipo;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://localhost:3000/api/tipopersonal/${idEliminar.value}`,

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

        cargarTipos();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(()=>{

    cargarTipos();

});

</script>

<style scoped>

.contenedor{

    padding:30px;

}

:deep(.crud-input){

    margin-bottom:18px;

}

@media(max-width:768px){

    .contenedor{

        padding:15px;

    }

}

</style>