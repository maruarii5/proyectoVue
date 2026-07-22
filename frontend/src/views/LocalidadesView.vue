<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Catálogo de Localidades"
            subtitulo="Administración de localidades"
            @buscar="filtrarLocalidades"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="localidadesFiltradas"
            idField="idLocalidad"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="localidad.idLocalidad ? 'Editar Localidad' : 'Nueva Localidad'"
        >

            <CrudInput
                v-model="localidad.Nombre"
                label="Nombre"
                placeholder="Nombre de la localidad"
            />

            <CrudSelect
                v-model="localidad.idMunicipio"
                label="Municipio"
                :options="municipios"
                valueField="idMunicipio"
                textField="Nombre"
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
            titulo="Eliminar Localidad"
            mensaje="¿Deseas eliminar esta localidad?"
            @confirm="confirmarEliminar"
        />

    </div>

</template>


<script setup>

import { ref, computed, onMounted } from "vue";

import CrudToolbar from "../components/crud/CrudToolbar.vue";
import CrudTable from "../components/crud/CrudTable.vue";
import CrudModal from "../components/crud/CrudModal.vue";
import CrudButton from "../components/crud/CrudButton.vue";
import CrudInput from "../components/crud/CrudInput.vue";
import CrudSelect from "../components/crud/CrudSelect.vue";
import ConfirmDialog from "../components/crud/ConfirmDialog.vue";

//=====================================
// Variables
//=====================================

const localidades = ref([]);

const municipios = ref([]);

const textoBuscar = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const idEliminar = ref(null);

const localidad = ref({

    idLocalidad:null,

    Nombre:"",

    idMunicipio:null

});

//=====================================
// Columnas de la tabla
//=====================================

const columnas=[

    {

        key:"idLocalidad",

        label:"ID"

    },

    {

        key:"Nombre",

        label:"Localidad"

    },

    {

        key:"Municipio",

        label:"Municipio"

    },

    {

        key:"Estado",

        label:"Estado"

    }

];

//=====================================
// Localidades filtradas
//=====================================

const localidadesFiltradas = computed(()=>{

    if(!textoBuscar.value){

        return localidades.value;

    }

    const texto = textoBuscar.value.toLowerCase();

    return localidades.value.filter(item=>

        item.Nombre.toLowerCase().includes(texto) ||

        item.Municipio.toLowerCase().includes(texto) ||

        item.Estado.toLowerCase().includes(texto)

    );

});

//=====================================
// Buscar
//=====================================

function filtrarLocalidades(texto){

    textoBuscar.value=texto;

}

//=====================================
// Cargar localidades
//=====================================

async function cargarLocalidades(){

    try{

        const response=await fetch(

            "http://localhost:3000/api/localidades",

            {

                credentials:"include"

            }

        );

        if(!response.ok){

            throw new Error();

        }

        localidades.value=await response.json();

    }

    catch(error){

        console.error(error);

    }

}

//=====================================
// Cargar municipios
//=====================================

async function cargarMunicipios(){

    try{

        const response=await fetch(

            "http://localhost:3000/api/municipios",

            {

                credentials:"include"

            }

        );

        if(!response.ok){

            throw new Error();

        }

        municipios.value=await response.json();

    }

    catch(error){

        console.error(error);

    }

}

//=====================================
// Nuevo
//=====================================

function nuevoRegistro(){

    localidad.value={

        idLocalidad:null,

        Nombre:"",

        idMunicipio:null

    };

    mostrarModal.value=true;

}

//=====================================
// Editar
//=====================================

function editarRegistro(item){

    localidad.value={

        idLocalidad:item.idLocalidad,

        Nombre:item.Nombre,

        idMunicipio:item.idMunicipio

    };

    mostrarModal.value=true;

}

//=====================================
// Guardar
//=====================================

async function guardarRegistro(){

    if(localidad.value.Nombre.trim()===""){

        alert("Escribe el nombre de la localidad.");

        return;

    }

    if(!localidad.value.idMunicipio){

        alert("Selecciona un municipio.");

        return;

    }

    try{

        let url="http://localhost:3000/api/localidades";

        let metodo="POST";

        if(localidad.value.idLocalidad){

            url+=`/${localidad.value.idLocalidad}`;

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

                body:JSON.stringify({

                    Nombre:localidad.value.Nombre,

                    idMunicipio:localidad.value.idMunicipio

                })

            }

        );

        const data=await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        mostrarModal.value=false;

        cargarLocalidades();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value=item.idLocalidad;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://localhost:3000/api/localidades/${idEliminar.value}`,

            {

                method:"DELETE",

                credentials:"include"

            }

        );

        const data=await response.json();

        if(!response.ok){

            throw new Error(data.error);

        }

        cargarLocalidades();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(()=>{

    cargarLocalidades();

    cargarMunicipios();

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

</style>