<template>

    <button
        :class="[
            'crud-button',
            color
        ]"
        :type="type"
        @click="$emit('click')"
    >

        <slot></slot>

    </button>

</template>

<script setup>

// ================================
// Props
// ================================

defineProps({

    color:{

        type:String,

        default:"primary"

    },

    type:{

        type:String,

        default:"button"

    }

});

// ================================
// Eventos
// ================================

defineEmits([

    "click"

]);

</script>

<style scoped>

.crud-button{

    border:none;

    border-radius:8px;

    padding:10px 18px;

    cursor:pointer;

    color:white;

    font-weight:bold;

    font-size:14px;

    transition:.25s;

}

/*=============================
  Colores
=============================*/

.primary{

    background:#2563eb;

}

.primary:hover{

    background:#1d4ed8;

}

.success{

    background:#16a34a;

}

.success:hover{

    background:#15803d;

}

.warning{

    background:#f59e0b;

}

.warning:hover{

    background:#d97706;

}

.danger{

    background:#dc2626;

}

.danger:hover{

    background:#b91c1c;

}

.secondary{

    background:#6b7280;

}

.secondary:hover{

    background:#4b5563;

}

.dark{

    background:#1f2937;

}

.dark:hover{

    background:#111827;

}

</style>
