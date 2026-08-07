<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Roles"
            subtitulo="Administración de roles"
            @buscar="filtrarRoles"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="rolesFiltrados"
            idField="idRol"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.idRol ? 'Editar Rol' : 'Nuevo Rol'"
        >

            <CrudInput
                v-model="registro.Nombre"
                label="Nombre del Rol"
                placeholder="Ej. Administrador"
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
            titulo="Eliminar Rol"
            mensaje="¿Deseas eliminar este rol?"
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

    idRol:null,

    Nombre:""

});

//=====================================
// Columnas
//=====================================

const columnas=[

    {

        key:"Nombre",

        label:"Rol"

    }

];

//=====================================
// Buscar
//=====================================

const rolesFiltrados = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.Nombre

            .toLowerCase()

            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarRoles(texto){

    textoBuscar.value = texto;

}

//=====================================
// Cargar Roles
//=====================================

async function cargarRoles(){

    const response = await fetch(

        "http://proyectovue-production-73f7.up.railway.app/api/roles",

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

        idRol:null,

        Nombre:""

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

        alert("Escribe el nombre del rol.");

        return;

    }

    try{

        let url="http://proyectovue-production-73f7.up.railway.app/api/roles";

        let metodo="POST";

        if(registro.value.idRol){

            url+=`/${registro.value.idRol}`;

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

        cargarRoles();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    idEliminar.value=item.idRol;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://proyectovue-production-73f7.up.railway.app/api/roles/${idEliminar.value}`,

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

        cargarRoles();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(()=>{

    cargarRoles();

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