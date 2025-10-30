<template>
    <GridLayout v-model='modelValue' v-bind='props'>
        <template #default='scope'>
            <GridNested
                v-if='scope.row.isNested' 
                v-model='modelValue'
                class='grid-nested'
                is-nested
                :pid='scope.row.id'
                :margin='margin'
                :row-height='rowHeight'
                :cols='cols'
            >
                <template #default='scope2'><slot :row='scope2.row' /></template>
            </GridNested>
            <slot v-else :row='scope.row' />
        </template>
    </GridLayout>
</template>
<script setup lang='ts'>
import GridLayout from './GridLayout.vue'
import type { IGridItem, IProps } from './useLayout'
defineSlots<{
    default(scope: { row: IGridItem }): any
}>()
const props = withDefaults(defineProps<IProps>(), {
    pid: '#',
    margin: () => [10, 10],
    rowHeight: 30,
    cols: 12,
    isNested: false
})
const modelValue = defineModel<IGridItem[]>({ required: true })
</script>

<style scoped>
.grid-nested {
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    outline: 1px dashed #ddd;
}
</style>