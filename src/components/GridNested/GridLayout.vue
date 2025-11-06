<template>
    <div ref='gridRef' class='grid-nested' :grid-pid='props.pid' :style='layoutStyle'>
        <div v-if='isShowPlaceholder' class='grid-nested-drag' :style='placeholderStyle'>
            <div class='grid-nested-item shadow-placeholder' />
        </div>
        <div
            v-for='v,i in currentData'
            :key='v.id'
            class='grid-nested-drag'
            :style='itemStyle(v)'
            :grid-id='v.id'
            @mousedown.stop='(e) => mouseDown(e, v)'
        >
            <div class='grid-nested-item'>
                <slot :row='currentData[i]!' />
            </div>
            <div v-if='!rootData.isReadonly && !v.isReadonly && rootData.isResize' class='grid-nested-drag-resize' @mousedown.stop='(e) => resizeDown(e, v)' />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef, reactive, inject, provide, watchEffect, computed } from 'vue'
import { IData, InjectionKeySymbol, useGridstack, type IGridItem, type IProps } from './useLayout'
const props = withDefaults(defineProps<IProps>(), {
    pid: '#',
    margin: () => [5, 5],
    rowHeight: 30,
    cols: 12,
    isNested: false,
    isReadonly: false,
    isDrag: true,
    isResize: true
})
const gridRef = useTemplateRef('gridRef')
const modelValue = defineModel<IGridItem[]>({ required: true })
const emits = defineEmits<{
    /** 不在同一坐标系时触发 */
    nestedChange: [from: IGridItem, to: IGridItem]
    dragStart: [current: IGridItem, event: MouseEvent]
    dragEnd: [current: IGridItem, event: MouseEvent]
    resizeStart: [current: IGridItem, event: MouseEvent]
    resizeEnd: [current: IGridItem, event: MouseEvent]
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
        rootData.isRealMargin = props.isRealMargin
        rootData.isReadonly = props.isReadonly
        rootData.isDrag = props.isDrag
        rootData.isResize = props.isResize
    })
}

const { 
    currentData, itemStyle, isShowPlaceholder, mouseDown, placeholderStyle, resizeDown, layoutStyle 
} = useGridstack(props, rootData, modelValue, gridRef, emits)

const paddingY = computed(() => !rootData.isRealMargin ? '0px' : `${props.margin[0]}px`)
const paddingX = computed(() => !rootData.isRealMargin ? '0px' : `${props.margin[1]}px`)
const paddingDrag = computed(() => `${paddingY.value} ${paddingX.value}`)
</script>

<style>
.grid-nested {
    width: 100%;
    min-height: 100%;
    position: relative;
}

.grid-nested-drag {
    position: absolute;
    top: 0;
    left: 0;
    user-select: none;
    padding: v-bind(paddingDrag);
    box-sizing: border-box;
}

.grid-nested-item {
    width: 100%;
    height: 100%;
}

.grid-nested-drag:has(.grid-nested-item.shadow-placeholder) {
    transition-duration: 0.25s;
    transition-timing-function: ease;
    transition-property: width, height, top, left;
}

.grid-nested-item.shadow-placeholder {
    background: rgb(255 0 0 / 20%);
}

.grid-nested-drag-resize{
    display: inline-block;
    position: absolute;
    right: v-bind(paddingX);
    bottom: v-bind(paddingY);
    cursor: se-resize;
    width: 12px;
    height: 12px;
    background: url('data:image/svg+xml;base64,PHN2ZyBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjYiIGhlaWdodD0iNiI+PHBhdGggZD0iTTYgNkgwVjQuMmg0LjJWMEg2djZ6IiBvcGFjaXR5PSIuMzAyIi8+PC9zdmc+');
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
