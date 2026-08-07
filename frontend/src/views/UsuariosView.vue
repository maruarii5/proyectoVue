<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Usuarios"
            subtitulo="Administración de usuarios"
            @buscar="filtrarUsuarios"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="usuariosFiltrados"
            idField="idUsuario"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.idUsuario ? 'Editar Usuario' : 'Nuevo Usuario'"
        >

            <CrudInput
                v-model="registro.Nombre"
                label="Nombre"
                placeholder="Nombre completo"
            />

            <CrudInput
                v-model="registro.Usuario"
                label="Usuario"
                placeholder="Nombre de usuario"
            />

            <CrudInput
                v-model="registro.Password"
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
            />

            <CrudSelect
                v-model="registro.idRol"
                label="Rol"
                :options="listaRoles"
                optionLabel="Nombre"
                optionValue="idRol"
                placeholder="Seleccione un rol"
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
            titulo="Eliminar Usuario"
            mensaje="¿Deseas eliminar este usuario?"
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

const listaRoles = ref([]);

const textoBuscar = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const idEliminar = ref(null);

const registro = ref({

    idUsuario:null,

    Nombre:"",

    Usuario:"",

    Password:"",

    idRol:null

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

        key:"Usuario",

        label:"Usuario"

    },

    {

        key:"Rol",

        label:"Rol"

    }

];

//=====================================
// Buscar
//=====================================

const usuariosFiltrados = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.Nombre

            .toLowerCase()

            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarUsuarios(texto){

    textoBuscar.value=texto;

}

//=====================================
// Cargar Usuarios
//=====================================

async function cargarUsuarios(){

    const response=await fetch(

        "http://proyectovue-production-73f7.up.railway.app/api/usuarios",

        {

            credentials:"include"

        }

    );

    registros.value=await response.json();

}

//=====================================
// Cargar Roles
//=====================================

async function cargarRoles(){

    const response=await fetch(

        "http://proyectovue-production-73f7.up.railway.app/api/usuarios/roles",

        {

            credentials:"include"

        }

    );

    listaRoles.value=await response.json();

}

//=====================================
// Nuevo
//=====================================

function nuevoRegistro(){

    registro.value={

        idUsuario:null,

        Nombre:"",

        Usuario:"",

        Password:"",

        idRol:null

    };

    mostrarModal.value=true;

}

//=====================================
// Editar
//=====================================

function editarRegistro(item){

    registro.value={

        idUsuario:item.idUsuario,

        Nombre:item.Nombre,

        Usuario:item.Usuario,

        Password:item.Password,

        idRol:item.idRol

    };

    mostrarModal.value=true;

}

//=====================================
// Guardar
//=====================================

async function guardarRegistro(){

    if(

        registro.value.Nombre.trim()==="" ||

        registro.value.Usuario.trim()==="" ||

        registro.value.Password.trim()==="" ||

        !registro.value.idRol

    ){

        alert("Completa todos los campos.");

        return;

    }

    try{

        let url="http://proyectovue-production-73f7.up.railway.app/api/usuarios";

        let metodo="POST";

        if(registro.value.idUsuario){

            url+=`/${registro.value.idUsuario}`;

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

        cargarUsuarios();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================
function abrirEliminar(item){

    console.log("ITEM COMPLETO:", item);

    idEliminar.value = item.idUsuario;

    console.log("ID:", idEliminar.value);

    mostrarEliminar.value = true;

}


async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://proyectovue-production-73f7.up.railway.app/api/usuarios/${idEliminar.value}`,

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

        cargarUsuarios();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(async()=>{

    await cargarRoles();

    await cargarUsuarios();

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