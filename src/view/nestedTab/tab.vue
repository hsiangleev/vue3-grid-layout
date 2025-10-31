<template>
    <el-tabs
        ref='tabRef'
        v-model='current.groupActiveId'
        addable
        class='nested-tabs-flex border'
        @tab-add='tabAdd'
    >
        <el-tab-pane v-for='v in current.groupList' :key='v.id' :label='v.title' :name='v.id'>
            <div class='grid-nested-repeat'>
                <GridLayout
                    v-model='modelValue'
                    is-nested
                    :pid='current.id'
                    :nested-condition='val => val.groupPId === v.id'
                    @nested-change='(from, to) => emits("nestedChange", from, to)'
                >
                    <template #default='scope2'>
                        <slot :row='scope2.row' />
                    </template>
                </GridLayout>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script setup lang='ts'>
import GridLayout from '@/components/GridNested/GridLayout.vue'
import type { IGridItem } from '@/components'
import { onMounted, useTemplateRef } from 'vue'

const modelValue = defineModel<IGridItem[]>({ required: true })
const current = defineModel<IGridItem>('current', { required: true })
const emits = defineEmits(['nestedChange'])

const tabRef = useTemplateRef('tabRef')
onMounted(() => {
    (tabRef.value?.$el.querySelector('.el-tabs__header') as HTMLDivElement).addEventListener('mousedown', e => e.stopPropagation())
    current.value.groupActiveId = current.value.groupList?.[0]?.id ?? ''
})
const tabAdd = () => {
    if(!current.value.groupList) current.value.groupList = []
    current.value.groupList.push({ id: `${Date.now()}`, title: `测试-${current.value.groupList.length + 1}` })
}
</script>

<style scoped>
    .border{
        border: 1px solid #0f0;
    }
</style>