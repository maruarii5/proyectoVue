<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Personal"
            subtitulo="Administración del personal"
            @buscar="filtrarPersonal"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="personalFiltrado"
            idField="idPersonal"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.idPersonal ? 'Editar Personal' : 'Nuevo Personal'"
        >

            <CrudSelect
                v-model="registro.idDatosP"
                label="Datos Personales"
                :options="listaDatos"
                optionLabel="Nombre"
                optionValue="idDatosP"
                placeholder="Seleccione una persona"
            />

            <CrudSelect
                v-model="registro.idTipo"
                label="Tipo de Personal"
                :options="listaTipos"
                optionLabel="Personal"
                optionValue="idTipo"
                placeholder="Seleccione un tipo"
            />

            <CrudInput
                v-model="registro.ClaveEmp"
                label="Clave del Empleado"
                placeholder="Ej. DOC001"
            />

            <CrudSelect
                v-model="registro.Status"
                label="Estatus"
                :options="estatus"
                optionLabel="nombre"
                optionValue="valor"
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
            titulo="Eliminar Personal"
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

//=====================================
// Variables
//=====================================

const registros = ref([]);

const listaDatos = ref([]);

const listaTipos = ref([]);

const textoBuscar = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const idEliminar = ref(null);

const registro = ref({

    idPersonal:null,

    idDatosP:null,

    idTipo:null,

    ClaveEmp:"",

    Status:1

});

//=====================================
// Catálogo de estatus
//=====================================

const estatus=[

    {

        valor:1,

        nombre:"Activo"

    },

    {

        valor:0,

        nombre:"Inactivo"

    }

];

//=====================================
// Columnas
//=====================================

const columnas=[

    {

        key:"Persona",

        label:"Persona"

    },

    {

        key:"Tipo",

        label:"Tipo"

    },

    {

        key:"ClaveEmp",

        label:"Clave"

    },

    {

        key:"StatusTexto",

        label:"Estatus"

    }

];
//=====================================
// Buscar
//=====================================

const personalFiltrado = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.Nombre
            .toLowerCase()
            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarPersonal(texto){

    textoBuscar.value=texto;

}

//=====================================
// Cargar Personal
//=====================================

async function cargarPersonal(){

    const response = await fetch(

        "http://proyectovue-production-73f7.up.railway.app/api/personal",

        {

            credentials:"include"

        }

    );

    const data = await response.json();

    registros.value = data.map(item => ({

        ...item,

        StatusTexto: item.Status == 1 ? "Activo" : "Inactivo"

    }));

}

//=====================================
// Cargar Personas
//=====================================

async function cargarDatos(){

    const response = await fetch(

        "http://proyectovue-production-73f7.up.railway.app/api/personal/personas",

        {

            credentials:"include"

        }

    );

    listaDatos.value = await response.json();

}

//=====================================
// Cargar Tipos
//=====================================

async function cargarTipos(){

    const response = await fetch(

        "http://proyectovue-production-73f7.up.railway.app/api/personal/tipos",

        {

            credentials:"include"

        }

    );

    listaTipos.value = await response.json();

}

//=====================================
// Nuevo
//=====================================

function nuevoRegistro(){

    registro.value={

        idPersonal:null,

        idDatosP:null,

        idTipo:null,

        ClaveEmp:"",

        Status:1

    };

    mostrarModal.value=true;

}

//=====================================
// Editar
//=====================================

function editarRegistro(item){

    registro.value={

        idPersonal:item.idPersonal,

        idDatosP:item.idDatosP,

        idTipo:item.idTipo,

        ClaveEmp:item.ClaveEmp,

        Status:item.Status

    };

    mostrarModal.value=true;

}

//=====================================
// Guardar
//=====================================

async function guardarRegistro(){

    if(

        !registro.value.idDatosP ||

        !registro.value.idTipo ||

        registro.value.ClaveEmp.trim()===""

    ){

        alert("Completa todos los campos.");

        return;

    }

    try{

        let url="http://proyectovue-production-73f7.up.railway.app/api/personal";

        let metodo="POST";

        if(registro.value.idPersonal){

            url+=`/${registro.value.idPersonal}`;

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

        cargarPersonal();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value=item.idPersonal;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://proyectovue-production-73f7.up.railway.app/api/personal/${idEliminar.value}`,

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

        cargarPersonal();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(async()=>{

    await cargarDatos();

    await cargarTipos();

    await cargarPersonal();

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