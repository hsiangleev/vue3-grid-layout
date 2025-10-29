<template>
    <div ref='gridRef' class='grid-stack' :grid-pid='props.pid' :style='layoutStyle'>
        <div v-if='isShowPlaceholder' class='grid-stack-item shadow-placeholder' :style='placeholderStyle' />
        <div
            v-for='v,i in currentData'
            :key='v.id'
            :class='["grid-stack-item"]'
            :style='itemStyle(v)'
            :grid-id='v.id'
            @mousedown.stop='(e) => mouseDown(e, v)'
        >
            <slot :row='currentData[i]!' />
            <div class='grid-stack-item-resize' @mousedown.stop='(e) => resizeDown(e, v)' />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef, reactive, inject, provide, onMounted } from 'vue'
import { IData, InjectionKeySymbol, useGridstack, type IGridItem, type IProps } from './useLayout'
const props = withDefaults(defineProps<IProps>(), {
    pid: '#',
    margin: () => [10, 10],
    rowHeight: 30,
    cols: 12,
    verticalCompact: true,
    isNested: false
})

const gridRef = useTemplateRef('gridRef')
const modelValue = defineModel<IGridItem[]>({ required: true })

let rootData = reactive(new IData())
const isRoot = props.pid === '#'
if(!isRoot) {
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

const { currentData, itemStyle, isShowPlaceholder, mouseDown, placeholderStyle, resizeDown, layoutStyle } = useGridstack(props, rootData, modelValue, gridRef, isRoot)
</script>

<style>
.grid-stack {
    height: 100%;
    width: 100%;
    position: relative;
    outline: 1px dashed #0f0;
}
.grid-nested {
    height: 100% !important;
    overflow-y: scroll;
    scrollbar-width: none;     /* Firefox */
    -ms-overflow-style: none;  /* IE 10+ */
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
.grid-stack-item-resize{
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: se-resize;
    width: 12px;
    height: 12px;
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='17' height='17'%3E%3Cpath d='M765.558 510.004a93.65 93.65 0 10191.665 0 93.65 93.65 0 10-191.665 0zm0 311.456a93.65 93.65 0 10191.665 0 93.65 93.65 0 10-191.665 0zm-343.401 0a93.65 93.65 0 10191.665 0 93.65 93.65 0 10-191.665 0zm0-311.456a93.65 93.65 0 10191.665 0 93.65 93.65 0 10-191.665 0zM765.558 202.54a93.65 93.65 0 10191.665 0 93.65 93.65 0 10-191.665 0zM66.777 821.46a93.65 93.65 0 10191.665 0 93.65 93.65 0 10-191.665 0z' fill='%23BFBFBF'/%3E%3C/svg%3E") no-repeat 50%;
}
</style>
