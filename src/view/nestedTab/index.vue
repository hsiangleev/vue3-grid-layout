<template>
    <GridLayout
        v-model='layout' 
        @nested-change='(from:any, to:any) => nestedChange(from, to)'
    >
        <template #default='scope'>
            <Tab
                v-if='scope.row.isNested'
                v-model='layout'
                v-model:current='scope.row'
                @nested-change='nestedChange'
            >
                <template #default='scope2'>
                    <div class='item'>{{ scope2.row.id }}</div>
                </template>
            </Tab>
            <div v-else class='item'>{{ scope.row.id }}</div>
        </template>
    </GridLayout>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import GridLayout from '@/components/GridNested/GridLayout.vue'
import type { IGridItem } from '@/components/GridNested/useLayout'
import Tab from './tab.vue'

const layout = ref<IGridItem[]>([
    { pid: '#', id: 'a', x: 0, y: 0, w: 3, h: 3 },
    { pid: '#', id: 'b', x: 3, y: 0, w: 3, h: 3 },
    { pid: '#', id: 'c', x: 6, y: 0, w: 6, h: 3 },
    { pid: '#', id: 'd', x: 0, y: 3, w: 6, h: 12, isNested: true, groupList: [{ id: 'd-g', title: '测试' }] },

    { pid: '#', id: 'g', x: 6, y: 3, w: 6, h: 12, isNested: true, groupList: [{ id: 'g-g', title: '测试' }] },
    
    { pid: '#', id: 'e', x: 0, y: 15, w: 2, h: 3 },
    { pid: '#', id: 'f', x: 6, y: 15, w: 4, h: 3 }
])

const nestedChange = (from: IGridItem, to: IGridItem) => {
    from.groupPId = to?.groupActiveId
}
</script>
<style scoped>
.item{
    width: 100%;
    height: 100%;
    border: 1px dashed #f00;
    box-sizing: border-box;
}
</style>