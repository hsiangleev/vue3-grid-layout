<template>
    <div class='test'>
        <GridLayout v-model='layout'>
            <template #default='scope'>
                <div class='grid-nested-repeat'>
                    <GridLayout v-model='layout' :is-nested='true' :pid='scope.row.id'>
                        <template #default='scope2'>
                            <div class='item'>{{ scope2.row.id }}</div>
                        </template>
                    </GridLayout>
                </div>
            </template>
        </GridLayout>
        <!-- <GridNested v-model='layout'>
            <template #default='scope'>
                <div v-if='scope.row.isNested'>
                    <div>nexted--{{ scope.row.id }}</div>
                </div>
                <div v-else class='item'>
                    <div>{{ scope.row.id }}</div>
                    <div>{{ scope.row.x }}--{{ scope.row.y }}--{{ scope.row.w }}--{{ scope.row.h }}</div>
                </div>
            </template>
        </GridNested> -->
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GridLayout from '@/components/GridNested/GridLayout.vue'
// import GridNested from '@/components/GridNested/GridNested.vue'
import type { IGridItem } from '@/components/GridNested/useLayout'

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

<style scoped>
.item{
    width: 100%;
    height: 100%;
    border: 1px dashed #f00;
    box-sizing: border-box;
}
</style>