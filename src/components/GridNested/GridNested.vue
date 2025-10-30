<template>
    <GridLayout v-model='modelValue' v-bind='props'>
        <template #default='scope'>
            <div class='grid-nested-repeat'>
                <slot :row='scope.row' />
                <template v-if='scope.row.isNested'>
                    <GridNested
                        v-model='modelValue'
                        is-nested
                        :pid='scope.row.id'
                        :margin='margin'
                        :row-height='rowHeight'
                        :cols='cols'
                    >
                        <template #default='scope2'><slot :row='scope2.row' /></template>
                    </GridNested>
                </template>
            </div>
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