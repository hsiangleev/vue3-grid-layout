<template>
    <GridLayout v-model='layout' :margin='[3, 3]'>
        <template #default='scope'>
            <div class='item'>{{ scope.row.id }}</div>
        </template>
    </GridLayout>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import GridLayout from '@/components/GridNested/GridLayout.vue'
import type { IGridItem } from '@/components/GridNested/useLayout'

const layout = ref<IGridItem[]>([
    { id: 'a', x: 0, y: 0, w: 3, h: 3 },
    { id: 'b', x: 3, y: 0, w: 3, h: 3 },
    { id: 'c', x: 6, y: 0, w: 6, h: 3 },
    { id: 'd', x: 4, y: 3, w: 6, h: 12 },

    { id: 'd-a', x: 0, y: 3, w: 4, h: 8 },
    { id: 'd-a-a', x: 0, y: 0, w: 2, h: 2 },
    { id: 'd-a-b', x: 0, y: 2, w: 2, h: 2 },

    { id: 'd-b', x: 0, y: 0, w: 2, h: 2 },

    { id: 'e', x: 0, y: 2, w: 2, h: 3 },
    { id: 'f', x: 6, y: 6, w: 4, h: 3 }
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