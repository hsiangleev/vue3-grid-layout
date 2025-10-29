<template>
    <div ref='gridRef' class='grid-stack' :grid-pid="props.pid">
        <div v-if="isMoving" class="grid-stack-item shadow-placeholder" :style="movingStyle" ></div>
        <div
            v-for='v,i in currentData'
            :key='v.id'
            :class='["grid-stack-item"]'
            :style='itemStyle(v)'
            :grid-id="v.id"
            @mousedown.stop="(e) => mouseDown(e, v)"
        >
            <slot :row="currentData[i]!" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, reactive, inject, provide, onMounted } from 'vue'
import { IData, InjectionKeySymbol, useGridstack, type IGridItem, type IProps } from './useLayout'
const props = withDefaults(defineProps<IProps>(), {
    pid: '#',
    margin: () => [10, 10],
    rowHeight: 30,
    cols: 12,
    verticalCompact: true,
    isNested: false,
    level: 1
})

const gridRef = useTemplateRef('gridRef')
const modelValue = defineModel<IGridItem[]>({ required: true })
const currentData = computed(() => modelValue.value.filter(v => !v.pid || v.pid === props.pid))

let rootData = reactive(new IData())
if(props.pid !== '#') {
    rootData = reactive(inject(InjectionKeySymbol, new IData()))
}else{
    provide(InjectionKeySymbol, rootData)
    onMounted(() => {
        rootData.rootEl = gridRef.value!
        rootData.cols = props.cols
        rootData.margin = props.margin
        rootData.rowHeight = props.rowHeight
        rootData.verticalCompact = props.verticalCompact
    })
}

const { itemStyle, isMoving, mouseDown, movingStyle } = useGridstack(rootData, currentData, gridRef)
</script>

<style>
.grid-stack {
    height: 100%;
    width: 100%;
    position: relative;
}
.grid-stack-item {
    position: absolute;
    top: 0;
    left: 0;
    user-select: none;
}
.grid-stack-item.shadow-placeholder {
    background: rgba(255, 0, 0, .2);
}
</style>
