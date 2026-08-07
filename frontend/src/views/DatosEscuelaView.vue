<template>

    <div class="contenedor">

        <CrudToolbar
            titulo="Datos de la Escuela"
            subtitulo="Administración de escuelas"
            @buscar="filtrarEscuelas"
            @nuevo="nuevoRegistro"
        />

        <CrudTable
            :columns="columnas"
            :rows="escuelasFiltradas"
            idField="CCT"
            @edit="editarRegistro"
            @delete="abrirEliminar"
        />

        <CrudModal
            v-model="mostrarModal"
            :titulo="registro.CCT ? 'Editar Escuela' : 'Nueva Escuela'"
        >

            <CrudInput
                v-model="registro.CCT"
                label="CCT"
                placeholder="Clave del Centro de Trabajo"
                :disabled="registroEditando"
            />

            <CrudInput
                v-model="registro.Nombre"
                label="Nombre"
                placeholder="Nombre de la escuela"
            />

            <CrudInput
                v-model="registro.Telefono"
                label="Teléfono"
            />

            <CrudInput
                v-model="registro.Email"
                label="Correo electrónico"
                type="email"
            />

            <CrudInput
                v-model="registro.Calle"
                label="Calle"
            />

            <CrudInput
                v-model.number="registro.NumE"
                label="Número Exterior"
                type="number"
            />

            <CrudInput
                v-model.number="registro.NumI"
                label="Número Interior"
                type="number"
            />

            <CrudInput
                v-model.number="registro.CP"
                label="Código Postal"
                type="number"
            />

            <CrudSelect
                v-model="registro.idEstado"
                label="Estado"
                :options="listaEstados"
                optionLabel="Nombre"
                optionValue="idEstado"
            />

            <CrudSelect
                v-model="registro.idMunicipio"
                label="Municipio"
                :options="listaMunicipios"
                optionLabel="Nombre"
                optionValue="idMunicipio"
            />

            <CrudSelect
                v-model="registro.idLocalidad"
                label="Localidad"
                :options="listaLocalidades"
                optionLabel="Nombre"
                optionValue="idLocalidad"
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
            titulo="Eliminar Escuela"
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

const listaEstados = ref([]);

const listaMunicipios = ref([]);

const listaLocalidades = ref([]);

const textoBuscar = ref("");

const mostrarModal = ref(false);

const mostrarEliminar = ref(false);

const cctEliminar = ref(null);

const registro = ref({

    CCT:"",

    Nombre:"",

    Telefono:"",

    Email:"",

    Calle:"",

    NumE:null,

    NumI:null,

    CP:null,

    idEstado:null,

    idMunicipio:null,

    idLocalidad:null

});

//=====================================
// Columnas
//=====================================

const columnas=[

    {

        key:"CCT",

        label:"CCT"

    },

    {

        key:"Nombre",

        label:"Escuela"

    },

    {

        key:"Estado",

        label:"Estado"

    },

    {

        key:"Municipio",

        label:"Municipio"

    },

    {

        key:"Localidad",

        label:"Localidad"

    }

];

//=====================================
// Saber si estamos editando
//=====================================

const registroEditando = ref(false);

//=====================================
// Buscar
//=====================================

const escuelasFiltradas = computed(()=>{

    if(!textoBuscar.value){

        return registros.value;

    }

    return registros.value.filter(item=>

        item.Nombre

            .toLowerCase()

            .includes(textoBuscar.value.toLowerCase())

    );

});

function filtrarEscuelas(texto){

    textoBuscar.value=texto;

}

//=====================================
// Cargar escuelas
//=====================================

async function cargarEscuelas(){

    const response=await fetch(

        "http://localhost:3000/api/datosescuela",

        {

            credentials:"include"

        }

    );

    registros.value=await response.json();

}

//=====================================
// Cargar estados
//=====================================

async function cargarEstados(){

    const response=await fetch(

        "http://localhost:3000/api/datosescuela/estados",

        {

            credentials:"include"

        }

    );

    listaEstados.value=await response.json();

}

//=====================================
// Cargar municipios
//=====================================

async function cargarMunicipios(){

    const response=await fetch(

        "http://localhost:3000/api/datosescuela/municipios",

        {

            credentials:"include"

        }

    );

    listaMunicipios.value=await response.json();

}

//=====================================
// Cargar localidades
//=====================================

async function cargarLocalidades(){

    const response=await fetch(

        "http://localhost:3000/api/datosescuela/localidades",

        {

            credentials:"include"

        }

    );

    listaLocalidades.value=await response.json();

}

//=====================================
// Nuevo
//=====================================
function nuevoRegistro(){

    registroEditando.value = false;

    registro.value={

        CCT:"",

        Nombre:"",

        Telefono:"",

        Email:"",

        Calle:"",

        NumE:null,

        NumI:null,

        CP:null,

        idEstado:null,

        idMunicipio:null,

        idLocalidad:null

    };

    mostrarModal.value=true;

}

//=====================================
// Editar
//=====================================

function editarRegistro(item){

    registroEditando.value = true;

    registro.value={

        CCT:item.CCT,

        Nombre:item.Nombre,

        Telefono:item.Telefono,

        Email:item.Email,

        Calle:item.Calle,

        NumE:item.NumE,

        NumI:item.NumI,

        CP:item.CP,

        idEstado:item.idEstado,

        idMunicipio:item.idMunicipio,

        idLocalidad:item.idLocalidad

    };

    mostrarModal.value=true;

}

//=====================================
// Guardar
//=====================================

async function guardarRegistro(){

    if(

        registro.value.CCT.trim()==="" ||

        registro.value.Nombre.trim()===""

    ){

        alert("CCT y Nombre son obligatorios.");

        return;

    }

    try{

        let url="http://localhost:3000/api/datosescuela";

        let metodo="POST";

        if(registroEditando.value){

            url+=`/${registro.value.CCT}`;

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

        cargarEscuelas();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Eliminar
//=====================================

function abrirEliminar(item){

    cctEliminar.value=item.CCT;

    mostrarEliminar.value=true;

}

async function confirmarEliminar(){

    try{

        const response=await fetch(

            `http://localhost:3000/api/datosescuela/${cctEliminar.value}`,

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

        cargarEscuelas();

    }

    catch(error){

        alert(error.message);

    }

}

//=====================================
// Inicio
//=====================================

onMounted(async()=>{

    await cargarEstados();

    await cargarMunicipios();

    await cargarLocalidades();

    await cargarEscuelas();

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