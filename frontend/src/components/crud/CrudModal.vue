<template>

    <div
        v-if="modelValue"
        class="overlay"
        @click.self="cerrar"
    >

        <div class="modal">

            <div class="header">

                <h2>

                    {{ titulo }}

                </h2>

                <button
                    class="cerrar"
                    @click="cerrar"
                >

                    ✕

                </button>

            </div>

            <div class="contenido">

                <slot></slot>

            </div>

            <div class="footer">

                <slot name="footer"></slot>

            </div>

        </div>

    </div>

</template>

<script setup>

//============================
// Props
//============================

const props = defineProps({

    modelValue:{

        type:Boolean,

        default:false

    },

    titulo:{

        type:String,

        default:""

    }

});

//============================
// Eventos
//============================

const emit = defineEmits([

    "update:modelValue"

]);

//============================

function cerrar(){

    emit(

        "update:modelValue",

        false

    );

}

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

.modal{

    width:500px;

    background:white;

    border-radius:10px;

    overflow:hidden;

    box-shadow:0 15px 40px rgba(0,0,0,.25);

}

.header{

    background:#1f2937;

    color:white;

    padding:15px 20px;

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.cerrar{

    background:none;

    border:none;

    color:white;

    font-size:22px;

    cursor:pointer;

}

.contenido{

    padding:25px;

}

.footer{

    padding:20px;

    display:flex;

    justify-content:flex-end;

    gap:10px;

    border-top:1px solid #e5e7eb;

}

</style>