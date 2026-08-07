<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Alumnos"
            subtitulo="Administración de alumnos"
            @buscar="filtrarAlumnos"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="alumnosFiltrados"
            idField="Matricula"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.Matricula ? 'Editar Alumno' : 'Nuevo Alumno'"
        >

            <CrudInput
                v-model="registro.Matricula"
                label="Matrícula"
                placeholder="Ej. 20260001"
                :disabled="registroEditando"
            />

            <CrudSelect
                v-model="registro.idDatosP"
                label="Alumno"
                :options="listaPersonas"
                optionLabel="Nombre"
                optionValue="idDatosP"
                placeholder="Seleccione un alumno"
            />

            <CrudSelect
                v-model="registro.idCarrera"
                label="Carrera"
                :options="listaCarreras"
                optionLabel="NombreCarreras"
                optionValue="idCarrera"
                placeholder="Seleccione una carrera"
            />

            <CrudSelect
                v-model="registro.Status"
                label="Estado"
                :options="[
                    { id:'A', nombre:'Activo' },
                    { id:'B', nombre:'Baja' }
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
            titulo="Eliminar Alumno"
            mensaje="¿Deseas eliminar este alumno?"
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

const listaPersonas = ref([]);

const listaCarreras = ref([]);

const textoBuscar = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const idEliminar = ref(null);

const registro = ref({

    Matricula:"",

    idCarrera:null,

    idDatosP:null,

    Status:"A"

});

//=====================================
// Columnas
//=====================================

const columnas=[

    {

        key:"Matricula",

        label:"Matrícula"

    },

    {

        key:"Alumno",

        label:"Alumno"

    },

    {

        key:"Carrera",

        label:"Carrera"

    },

    {

        key:"Status",

        label:"Estado"

    }

];

//=====================================
// Saber si estamos editando
//=====================================

const registroEditando = ref(false);

//=====================================
// Buscar
//=====================================

const alumnosFiltrados = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.Alumno

            .toLowerCase()

            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarAlumnos(texto){

    textoBuscar.value=texto;

}

//=====================================
// Cargar alumnos
//=====================================

async function cargarAlumnos(){

    const response=await fetch(

        "http://localhost:3000/api/alumnos",

        {

            credentials:"include"

        }

    );

    registros.value=await response.json();

    registros.value=registros.value.map(item=>({

        ...item,

        Status:item.Status==="A"

            ? "Activo"

            : "Baja"

    }));

}

//=====================================
// Personas
//=====================================

async function cargarPersonas(){

    const response=await fetch(

        "http://localhost:3000/api/alumnos/personas",

        {

            credentials:"include"

        }

    );

    listaPersonas.value=await response.json();

}

//=====================================
// Carreras
//=====================================

async function cargarCarreras(){

    const response=await fetch(

        "http://localhost:3000/api/alumnos/carreras",

        {

            credentials:"include"

        }

    );

    listaCarreras.value=await response.json();

}

//=====================================
// Nuevo
//=====================================

function nuevoRegistro(){

    registroEditando.value=false;

    registro.value={

        Matricula:"",

        idCarrera:null,

        idDatosP:null,

        Status:"A"

    };

    mostrarModal.value=true;

}

//=====================================
// Editar
//=====================================

function editarRegistro(item){
    registroEditando.value=true;

    registro.value={

        Matricula:item.Matricula,

        idCarrera:item.idCarrera,

        idDatosP:item.idDatosP,

        Status:item.Status==="Activo"

            ? "A"

            : "B"

    };

    mostrarModal.value=true;

}

//=====================================
// Guardar
//=====================================

async function guardarRegistro(){

    if(

        registro.value.Matricula.trim()==="" ||

        !registro.value.idDatosP ||

        !registro.value.idCarrera

    ){

        alert("Completa todos los campos.");

        return;

    }

    try{

        let url="http://localhost:3000/api/alumnos";

        let metodo="POST";

        if(registroEditando.value){

            url+=`/${registro.value.Matricula}`;

            metodo="PUT";

        }

        console.log("REGISTRO A ENVIAR:", registro.value);

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

        cargarAlumnos();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value=item.Matricula;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://localhost:3000/api/alumnos/${idEliminar.value}`,

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

        cargarAlumnos();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(async()=>{

    await cargarPersonas();

    await cargarCarreras();

    await cargarAlumnos();

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