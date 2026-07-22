<template>

    <div
        v-if="modelValue"
        class="overlay"
    >

        <div class="dialogo">

            <div class="titulo">

                <h2>

                    Confirmar eliminación

                </h2>

            </div>

            <div class="contenido">

                <p>

                    {{ mensaje }}

                </p>

            </div>

            <div class="botones">

                <CrudButton
                    color="danger"
                    @click="$emit('confirmar')"
                >

                    Eliminar

                </CrudButton>

                <CrudButton
                    color="secondary"
                    @click="$emit('update:modelValue', false)"
                >

                    Cancelar

                </CrudButton>

            </div>

        </div>

    </div>

</template>

<script setup>

import CrudButton from "./CrudButton.vue";

defineProps({

    modelValue:{

        type:Boolean,

        default:false

    },

    mensaje:{

        type:String,

        default:"¿Deseas eliminar este registro?"

    }

});

defineEmits([

    "update:modelValue",

    "confirmar"

]);

</script>

<style scoped>

.overlay{

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.45);

    display:flex;

    justify-content:center;

    align-items:center;

    z-index:9999;

}

.dialogo{

    width:420px;

    background:white;

    border-radius:12px;

    overflow:hidden;

    box-shadow:0 15px 35px rgba(0,0,0,.25);

}

.titulo{

    background:#dc2626;

    color:white;

    padding:18px;

}

.contenido{

    padding:30px;

    font-size:16px;

    color:#374151;

}

.botones{

    display:flex;

    justify-content:flex-end;

    gap:10px;

    padding:20px;

    border-top:1px solid #e5e7eb;

}

</style>