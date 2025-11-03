<template>
    <div ref='gridRef' class='grid-nested' :grid-pid='props.pid' :style='layoutStyle'>
        <div v-if='isShowPlaceholder' class='grid-nested-item shadow-placeholder' :style='placeholderStyle' />
        <div
            v-for='v,i in currentData'
            :key='v.id'
            class='grid-nested-item'
            :style='itemStyle(v)'
            :grid-id='v.id'
            @mousedown.stop='(e) => mouseDown(e, v)'
        >
            <slot :row='currentData[i]!' />
            <div v-if='!rootData.isReadonly && !v.isReadonly' class='grid-nested-item-resize' @mousedown.stop='(e) => resizeDown(e, v)' />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef, reactive, inject, provide, watchEffect } from 'vue'
import { IData, InjectionKeySymbol, useGridstack, type IGridItem, type IProps } from './useLayout'
const props = withDefaults(defineProps<IProps>(), {
    pid: '#',
    margin: () => [10, 10],
    rowHeight: 30,
    cols: 12,
    isNested: false,
    isReadonly: false
})
const gridRef = useTemplateRef('gridRef')
const modelValue = defineModel<IGridItem[]>({ required: true })
const emits = defineEmits<{
    /** 不在同一坐标系时触发 */
    nestedChange: [from: IGridItem, to: IGridItem]
}>()

let rootData = reactive(new IData())
const isRoot = props.pid === '#'
if(!isRoot) {
    rootData = reactive(inject(InjectionKeySymbol, new IData()))
}else{
    provide(InjectionKeySymbol, rootData)
    watchEffect(() => {
        rootData.rootEl = gridRef.value!
        rootData.cols = props.cols
        rootData.margin = props.margin
        rootData.rowHeight = props.rowHeight
        rootData.isReadonly = props.isReadonly
    })
}

const { 
    currentData, itemStyle, isShowPlaceholder, mouseDown, placeholderStyle, resizeDown, layoutStyle 
} = useGridstack(props, rootData, modelValue, gridRef, emits)
</script>

<style>
.grid-nested {
    width: 100%;
    min-height: 100%;
    position: relative;
}
.grid-nested-item {
    position: absolute;
    top: 0;
    left: 0;
    user-select: none;
}
.grid-nested-item.shadow-placeholder {
    background: rgba(255, 0, 0, .2);
}
.grid-nested-item-resize{
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
    z-index: 2;
}
.grid-nested-repeat {
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    outline: 1px dashed #ddd;
}
</style>
