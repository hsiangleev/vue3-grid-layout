<template>
    <div ref='gridRef' class='grid-stack' :grid-pid='props.pid' :style='layoutStyle'>
        <div v-if='isShowPlaceholder' class='grid-stack-item shadow-placeholder' :style='placeholderStyle' />
        <div
            v-for='v,i in currentData'
            :key='v.id'
            class='grid-stack-item'
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

<style scoped>
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
.grid-stack-item-resize{
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: se-resize;
    width: 12px;
    height: 12px;
    background: url("data:image/svg+xml;base64,PHN2ZyBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjYiIGhlaWdodD0iNiI+PHBhdGggZD0iTTYgNkgwVjQuMmg0LjJWMEg2djZ6IiBvcGFjaXR5PSIuMzAyIi8+PC9zdmc+");
    background-position: 100% 100%;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
}
</style>
