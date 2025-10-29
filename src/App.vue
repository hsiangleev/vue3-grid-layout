<template>
    <div class='test'>
        <GridLayout v-model='layout'>
            <template #default='scope'>
                <GridLayout v-if='scope.row.isNested' v-model='layout' class='grid-nested' is-nested :pid='scope.row.id'>
                    <template #default='scope'>
                        <GridLayout v-if='scope.row.isNested' v-model='layout' class='grid-nested' is-nested :pid='scope.row.id'>
                            <template #default='scope'>
                                <div class='item'>
                                    <div>{{ scope.row.id }}</div>
                                    <div>{{ scope.row.x }}--{{ scope.row.y }}--{{ scope.row.w }}--{{ scope.row.h }}</div>
                                </div>
                            </template>
                        </GridLayout>
                        <div v-else class='item'>
                            <div>{{ scope.row.id }}</div>
                            <div>{{ scope.row.x }}--{{ scope.row.y }}--{{ scope.row.w }}--{{ scope.row.h }}</div>
                        </div>
                    </template>
                </GridLayout>
                <div v-else class='item'>
                    <div>{{ scope.row.id }}</div>
                    <div>{{ scope.row.x }}--{{ scope.row.y }}--{{ scope.row.w }}--{{ scope.row.h }}</div>
                </div>
            </template>
        </GridLayout>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GridLayout from './components/GridLayout.vue'
import type { IGridItem } from './components/useLayout'

const layout = ref<IGridItem[]>([
    { pid: '#', id: 'a', x: 0, y: 0, w: 3, h: 3 },
    { pid: '#', id: 'b', x: 3, y: 0, w: 3, h: 3 },
    { pid: '#', id: 'c', x: 6, y: 0, w: 6, h: 3 },
    { pid: '#', id: 'd', x: 4, y: 3, w: 6, h: 12, isNested: true },

    { pid: 'd', id: 'd-a', x: 0, y: 0, w: 4, h: 8, isNested: true },
    { pid: 'd-a', id: 'd-a-a', x: 0, y: 0, w: 2, h: 2 },
    { pid: 'd-a', id: 'd-a-b', x: 0, y: 2, w: 2, h: 2 },

    { pid: 'd', id: 'd-b', x: 0, y: 0, w: 2, h: 2 },

    { pid: '#', id: 'e', x: 0, y: 2, w: 2, h: 3 },
    { pid: '#', id: 'f', x: 6, y: 6, w: 4, h: 3 }
])
</script>

<style>
.item{
    width: 100%;
    height: 100%;
    outline: 1px dashed #f00;
    box-sizing: border-box;
}
</style>