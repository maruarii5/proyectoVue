<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Asignaturas"
            subtitulo="Administración de asignaturas"
            @buscar="filtrarAsignaturas"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="asignaturasFiltradas"
            idField="idAsignatura"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.idAsignatura ? 'Editar Asignatura' : 'Nueva Asignatura'"
        >

            <CrudInput
                v-model="registro.NombresMaterias"
                label="Nombre de la Asignatura"
                placeholder="Ej. Matemáticas"
            />

            <CrudInput
                v-model.number="registro.HorasTotales"
                label="Horas Totales"
                type="number"
                placeholder="Ej. 80"
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
            titulo="Eliminar Asignatura"
            mensaje="¿Deseas eliminar esta asignatura?"
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

    idAsignatura:null,

    NombresMaterias:"",

    HorasTotales:0

});

//=====================================
// Columnas
//=====================================

const columnas=[

    {

        key:"NombresMaterias",

        label:"Asignatura"

    },

    {

        key:"HorasTotales",

        label:"Horas Totales"

    }

];

//=====================================
// Buscar
//=====================================

const asignaturasFiltradas = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.NombresMaterias

            .toLowerCase()

            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarAsignaturas(texto){

    textoBuscar.value = texto;

}

//=====================================
// Cargar
//=====================================

async function cargarAsignaturas(){

    const response = await fetch(

        "http://localhost:3000/api/asignaturas",

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

        idAsignatura:null,

        NombresMaterias:"",

        HorasTotales:0

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

    if(

        registro.value.NombresMaterias.trim()==="" ||

        registro.value.HorasTotales<=0

    ){

        alert("Completa correctamente todos los campos.");

        return;

    }

    try{

        let url="http://localhost:3000/api/asignaturas";

        let metodo="POST";

        if(registro.value.idAsignatura){

            url+=`/${registro.value.idAsignatura}`;

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

        cargarAsignaturas();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value=item.idAsignatura;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://localhost:3000/api/asignaturas/${idEliminar.value}`,

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

        cargarAsignaturas();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(()=>{

    cargarAsignaturas();

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