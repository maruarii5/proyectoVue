<template>

    <div class="toolbar">

        <div class="toolbar-left">

            <div>

                <h1 class="titulo">

                    {{ titulo }}

                </h1>

                <p
                    v-if="subtitulo"
                    class="subtitulo"
                >

                    {{ subtitulo }}

                </p>

            </div>

        </div>

        <div class="toolbar-right">

            <input
                v-if="mostrarBuscar"
                v-model="textoBusqueda"
                class="buscar"
                type="text"
                placeholder="Buscar..."
                @input="buscar"
            >

            <CrudButton
                v-if="mostrarNuevo"
                color="primary"
                @click="$emit('nuevo')"
            >

                + Nuevo

            </CrudButton>

            <!-- Botones adicionales -->
            <slot></slot>

        </div>

    </div>

</template>

<script setup>

import { ref } from "vue";
import CrudButton from "./CrudButton.vue";

//=========================
// Props
//=========================

const props = defineProps({

    titulo:{

        type:String,

        required:true

    },

    subtitulo:{

        type:String,

        default:""

    },

    mostrarBuscar:{

        type:Boolean,

        default:true

    },

    mostrarNuevo:{

        type:Boolean,

        default:true

    }

});

//=========================
// Eventos
//=========================

const emit = defineEmits([

    "buscar",

    "nuevo"

]);

//=========================

const textoBusqueda = ref("");

function buscar(){

    emit(

        "buscar",

        textoBusqueda.value

    );

}

</script>

<style scoped>

.toolbar{

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:20px;

    margin-bottom:25px;

    flex-wrap:wrap;

}

.toolbar-left{

    display:flex;

    align-items:center;

}

.titulo{

    margin:0;

    font-size:30px;

    color:#1f2937;

}

.subtitulo{

    margin-top:4px;

    color:#6b7280;

    font-size:14px;

}

.toolbar-right{

    display:flex;

    align-items:center;

    gap:12px;

    flex-wrap:wrap;

}

.buscar{

    width:280px;

    padding:10px 14px;

    border:1px solid #d1d5db;

    border-radius:8px;

    outline:none;

    transition:.25s;

    font-size:15px;

}

.buscar:focus{

    border-color:#2563eb;

    box-shadow:0 0 0 3px rgba(37,99,235,.15);

}

@media(max-width:768px){

    .toolbar{

        flex-direction:column;

        align-items:stretch;

    }

    .toolbar-right{

        width:100%;

        flex-direction:column;

        align-items:stretch;

    }

    .buscar{

        width:100%;

    }

}

</style>