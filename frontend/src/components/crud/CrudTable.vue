<template>

    <table class="tabla">

        <thead>

            <tr>

                <th
                    v-for="columna in columns"
                    :key="columna.key"
                >
                    {{ columna.label }}
                </th>

                <th v-if="mostrarAcciones" class="acciones-columna">
                    Acciones
                </th>

            </tr>

        </thead>

        <tbody>

            <tr
                v-for="fila in rows"
                :key="fila[idField]"
            >

                <td
                    v-for="columna in columns"
                    :key="columna.key"
                >
                    {{ fila[columna.key] }}
                </td>

                <td
                    v-if="mostrarAcciones"
                    class="acciones"
                >

                    <CrudButton
                        color="warning"
                        @click="$emit('edit', fila)"
                    >
                        Editar
                    </CrudButton>

                    <CrudButton
                        color="danger"
                        @click="$emit('delete', fila)"
                    >
                        Eliminar
                    </CrudButton>

                </td>

            </tr>

            <tr v-if="rows.length === 0">

                <td
                    :colspan="columns.length + (mostrarAcciones ? 1 : 0)"
                    class="vacio"
                >
                    No existen registros.
                </td>

            </tr>

        </tbody>

    </table>

</template>

<script setup>

import CrudButton from "./CrudButton.vue";

defineProps({

    columns: {
        type: Array,
        required: true
    },

    rows: {
        type: Array,
        required: true
    },

    idField: {
        type: String,
        default: "id"
    },

    mostrarAcciones: {
        type: Boolean,
        default: true
    }

});

defineEmits([
    "edit",
    "delete"
]);

</script>

<style scoped>

.tabla{

    width:100%;
    border-collapse:collapse;
    background:white;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 5px 15px rgba(0,0,0,.15);

}

.tabla th{

    background:#1f2937;
    color:white;

}

.tabla th,
.tabla td{

    padding:14px;
    border-bottom:1px solid #e5e7eb;
    text-align:left;

}

.tabla tbody tr:hover{

    background:#f9fafb;

}

.acciones-columna{

    width:220px;
    text-align:center;

}

.acciones{

    display:flex;
    gap:8px;
    justify-content:center;
    align-items:center;

}

.vacio{

    text-align:center;
    color:#888;
    padding:30px;

}

</style>