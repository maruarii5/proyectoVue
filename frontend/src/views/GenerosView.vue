<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Catálogo de Géneros"
            subtitulo="Administración de géneros"
            @buscar="filtrarGeneros"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="generosFiltrados"
            idField="idGenero"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="genero.idGenero ? 'Editar Género' : 'Nuevo Género'"
        >

            <CrudInput
                v-model="genero.Genero"
                label="Género"
                placeholder="Nombre del género"
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
            titulo="Eliminar Género"
            mensaje="¿Deseas eliminar este género?"
            @confirm="confirmarEliminar"
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

const generos = ref([]);

const textoBuscar = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const idEliminar = ref(null);

const genero = ref({

    idGenero:null,

    Genero:""

});

//=====================================
// Columnas
//=====================================

const columnas = [

    {

        key:"idGenero",

        label:"ID"

    },

    {

        key:"Genero",

        label:"Género"

    }

];

//=====================================
// Búsqueda
//=====================================

const generosFiltrados = computed(()=>{

    if(!textoBuscar.value){

        return generos.value;

    }

    return generos.value.filter(item=>

        item.Genero

            .toLowerCase()

            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarGeneros(texto){

    textoBuscar.value = texto;

}

//=====================================
// Obtener registros
//=====================================

async function cargarGeneros(){

    try{

        const response = await fetch(

            "http://localhost:3000/api/generos",

            {

                credentials:"include"

            }

        );

        if(!response.ok){

            throw new Error();

        }

        generos.value = await response.json();

    }

    catch(error){

        console.error(error);

    }

}

//=====================================
// Nuevo
//=====================================

function nuevoRegistro(){

    genero.value = {

        idGenero:null,

        Genero:""

    };

    mostrarModal.value = true;

}

//=====================================
// Editar
//=====================================

function editarRegistro(item){

    genero.value = {

        ...item

    };

    mostrarModal.value = true;

}

//=====================================
// Guardar
//=====================================

async function guardarRegistro(){

    if(genero.value.Genero.trim()===""){

        alert("Escribe el nombre del género.");

        return;

    }

    try{

        let url = "http://localhost:3000/api/generos";

        let metodo = "POST";

        if(genero.value.idGenero){

            url += `/${genero.value.idGenero}`;

            metodo = "PUT";

        }

        const response = await fetch(

            url,

            {

                method:metodo,

                credentials:"include",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    Genero:genero.value.Genero

                })

            }

        );

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        mostrarModal.value = false;

        cargarGeneros();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value = item.idGenero;

    mostrarEliminar.value = true;

}

async function confirmarEliminar(){

    try{

        const response = await fetch(

            `http://localhost:3000/api/generos/${idEliminar.value}`,

            {

                method:"DELETE",

                credentials:"include"

            }

        );

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        cargarGeneros();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(()=>{

    cargarGeneros();

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