<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Intendencia"
            subtitulo="Administración del personal de intendencia"
            @buscar="filtrarEmpleados"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="empleadosFiltrados"
            idField="idEmpleado"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.idEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'"
        >

            <CrudInput
                v-model="registro.Nombre"
                label="Nombre"
                placeholder="Nombre del empleado"
            />

            <CrudInput
                v-model="registro.Telefono"
                label="Teléfono"
                placeholder="Teléfono"
            />

            <CrudInput
                v-model="registro.Area"
                label="Área"
                placeholder="Ej. Limpieza, Jardinería, Mantenimiento"
            />

            <CrudInput
                v-model="registro.Turno"
                label="Turno"
                placeholder="Matutino, Vespertino o Nocturno"
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
            titulo="Eliminar Empleado"
            mensaje="¿Deseas eliminar este empleado?"
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

    idEmpleado:null,

    Nombre:"",

    Telefono:"",

    Area:"",

    Turno:""

});

//=====================================
// Columnas
//=====================================

const columnas=[

    {

        key:"Nombre",

        label:"Nombre"

    },

    {

        key:"Telefono",

        label:"Teléfono"

    },

    {

        key:"Area",

        label:"Área"

    },

    {

        key:"Turno",

        label:"Turno"

    }

];

//=====================================
// Buscar
//=====================================

const empleadosFiltrados = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.Nombre

            .toLowerCase()

            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarEmpleados(texto){

    textoBuscar.value = texto;

}

//=====================================
// Cargar empleados
//=====================================

async function cargarEmpleados(){

    const response = await fetch(

        "http://proyectovue-production-73f7.up.railway.app/api/intendencia",

        {

            credentials:"include"

        }

    );

    registros.value = await response.json();

}

//=====================================
// Nuevo
//=====================================

function nuevoRegistro(){

    registro.value={

        idEmpleado:null,

        Nombre:"",

        Telefono:"",

        Area:"",

        Turno:""

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

    if(registro.value.Nombre.trim()===""){

        alert("El nombre es obligatorio.");

        return;

    }

    try{

        let url="http://proyectovue-production-73f7.up.railway.app/api/intendencia";

        let metodo="POST";

        if(registro.value.idEmpleado){

            url+=`/${registro.value.idEmpleado}`;

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

        cargarEmpleados();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value=item.idEmpleado;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://proyectovue-production-73f7.up.railway.app/api/intendencia/${idEliminar.value}`,

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

        cargarEmpleados();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(()=>{

    cargarEmpleados();

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