<template>
    <div class="test">
        <GridLayout v-model='layout'>
            <template #default="scope">
                <GridLayout v-if="scope.row.isNested" class="grid-nested" v-model='layout' is-nested :pid="scope.row.id" :level="2">
                    <template #default="scope">
                        <GridLayout v-if="scope.row.isNested" class="grid-nested" v-model='layout' is-nested :pid="scope.row.id" :level="3">
                            <template #default="scope">
                                <div class="item">
                                    {{ scope.row.id }}
                                </div>
                            </template>
                        </GridLayout>
                        <div class="item" v-else>
                            {{ scope.row.id }}
                        </div>
                    </template>
                </GridLayout>
                <div class="item" v-else>
                    {{ scope.row.id }}
                </div>
            </template>
        </GridLayout>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GridLayout from './components/GridLayout.vue'
import type { IGridItem } from './components/useLayout';

const layout = ref<IGridItem[]>([
    { pid: '#', id: 'a', x: 0, y: 0, w: 3, h: 3,},
    { pid: '#', id: 'b', x: 3, y: 0, w: 3, h: 3 },
    { pid: '#', id: 'c', x: 6, y: 0, w: 6, h: 3 },
    { pid: '#', id: 'd', x: 4, y: 3, w: 6, h: 12, isNested: true },

    { pid: 'd', id: 'd-a', x: 0, y: 0, w: 4, h: 8, isNested: true},
    { pid: 'd-a', id: 'd-a-a', x: 0, y: 0, w: 2, h: 2 },
    { pid: 'd-a', id: 'd-a-b', x: 0, y: 2, w: 2, h: 2 },

    { pid: 'd', id: 'd-b', x: 0, y: 0, w: 2, h: 2 },

    { pid: '#', id: 'e', x: 0, y: 2, w: 2, h: 3 },
    { pid: '#', id: 'f', x: 6, y: 6, w: 4, h: 3 }
])
</script>

<style>
.test {
    padding: 10px;
    width: 800px;
    height: 600px;
    outline: 1px solid #00f;
}
.item{
    width: 100%;
    height: 100%;
    outline: 1px dashed #f00;
    box-sizing: border-box;
}
.grid-nested{
    outline: 1px dashed #0f0;
    box-sizing: border-box;
}
</style>