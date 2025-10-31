import { computed, onMounted, ref, type Ref, type InjectionKey, nextTick, onBeforeUnmount } from 'vue'

export class IData {
    rootEl?: HTMLDivElement
    margin?: [number, number] = [10, 10]
    rowHeight?: number = 30
    cols?: number = 12
}

export const InjectionKeySymbol = Symbol() as InjectionKey<IData>

export interface IGridItem {
    id: string
    x: number
    y: number
    w: number
    h: number
    isNested?: boolean
    pid?: string
    [index: string]: any
}

class IDomRect {
    width = 0
    height = 0
    top = 0
    right = 0
    bottom = 0
    left = 0
    x = 0
    y = 0
}

export interface IProps {
    pid?: string
    margin?: [number, number]
    rowHeight?: number
    cols?: number
    isNested?: boolean
    /** 嵌套子节点的额外过滤参数（为分组使用，如Tab页设计） */
    nestedCondition?: (v: IGridItem) => boolean
}

export function useGridstack(
    props: IProps, 
    rootData: IData, 
    modelValue: Ref<IGridItem[]>, 
    gridRef: Ref<HTMLDivElement | null>,
    emits: (evt: 'nestedChange', from: IGridItem, to: IGridItem) => void
) {
    const marginX = computed(() => rootData.margin![0])
    const marginY = computed(() => rootData.margin![1])
    const rootRect = ref(new IDomRect())
    const layoutRect = ref(new IDomRect())
    const boxWidth = ref(0)
    const currentData = computed(() => modelValue.value.filter(v => !v.pid || v.pid === props.pid && (props.nestedCondition ? props.nestedCondition(v) : true)))

    const skyline = ref<number[]>([])
    let stop1: () => void, stop2:() => void

    onMounted(async() => {
        await nextTick()
        skyline.value = compressVerticalSkyline(currentData, rootData.cols!)
        // 以根节点为参考坐标系
        stop1 = domResizeObserver(rootData.rootEl!, ([r]) => {
            rootRect.value = r!.contentRect
            boxWidth.value = (rootRect.value.width - marginX.value * (rootData.cols! - 1)) / rootData.cols!
        }).stop
        stop2 = domResizeObserver(gridRef.value!, ([r]) => {
            layoutRect.value = r!.contentRect
        }).stop
    })
    onBeforeUnmount(() => {
        stop1?.()
        stop2?.()
    })
    
    const { mouseDown, mouseUp, movingItem, moveLeft, moveTop } = useDragFn(rootData, currentData, layoutRect, boxWidth, modelValue, skyline, emits)
    const { resizeDown, resizeItem, resizeWidth, resizeHeight } = useResizeFn(rootData, currentData, boxWidth, modelValue, skyline)

    /** 每块样式 */
    const itemStyle = computed(() => (v: IGridItem) => {
        const boxHeight = rootData.rowHeight!
        const style = getStyle(v, marginX.value, marginY.value, boxWidth.value, boxHeight)
        // 如果当前正在拖拽，则修改为移动的坐标
        if(movingItem.value && movingItem.value.id === v.id) {
            style.left = `${moveLeft.value}px`
            style.top = `${moveTop.value}px`
            style.zIndex = 1
        }
        // 如果当前正在缩放，则修改宽高
        if(resizeItem.value && resizeItem.value.id === v.id) {
            style.width = `${resizeWidth.value}px`
            style.height = `${resizeHeight.value}px`
            style.zIndex = 1
        }
        return style
    })
    
    const isShowPlaceholder = computed(() => !!movingItem.value || !!resizeItem.value)
    /** 拖拽阴影样式 */
    const placeholderStyle = computed(() => {
        const boxHeight = rootData.rowHeight!
        const v = movingItem.value || resizeItem.value
        if(!v) return {}
        const style = getStyle(v, marginX.value, marginY.value, boxWidth.value, boxHeight)
        return style
    })
    
    const layoutHeight = computed(() => countGridMaxHeight(skyline.value, rootData.rowHeight!, marginY.value))
    /** layout样式 */
    const layoutStyle = computed(() => {
        const style: Record<string, string> = {
            height: `${layoutHeight.value}px`
        }
        return style
    })

    return {
        currentData, itemStyle, isShowPlaceholder, mouseDown, mouseUp, placeholderStyle, resizeDown, layoutStyle
    }
}

const useDragFn = (
    rootData: IData, 
    currentData: Ref<IGridItem[]>, 
    layoutRect: Ref<IDomRect>, 
    boxWidth: Ref<number>, 
    modelValue: Ref<IGridItem[]>, 
    skyline: Ref<number[]>,
    emits: (evt: 'nestedChange', from: IGridItem, to: IGridItem) => void
) => {
    const marginX = computed(() => rootData.margin![0])
    const marginY = computed(() => rootData.margin![1])
    let mouseDownX = 0
    let mouseDownY = 0
    let mouseOffsetX = 0
    let mouseOffsetY = 0
    const moveLeft = ref(0)
    const moveTop = ref(0)
    const targetEl = ref<HTMLDivElement>()
    const mouseDown = (event: MouseEvent, v: IGridItem) => {
        targetEl.value = event.currentTarget as HTMLDivElement
        mouseDownX = event.clientX - targetEl.value.offsetLeft
        mouseDownY = event.clientY - targetEl.value.offsetTop
        targetEl.value.style.pointerEvents = 'none'

        movingItem.value = v
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)

        moveLeft.value = targetEl.value.offsetLeft
        moveTop.value = targetEl.value.offsetTop

        mouseOffsetX = event.offsetX
        mouseOffsetY = event.offsetY
    }
    const mouseMove = (event: MouseEvent) => {
        const { clientX, clientY } = event
        let x = clientX - mouseDownX
        let y = clientY - mouseDownY

        const el = document.elementFromPoint(clientX, clientY) as HTMLDivElement
        const pid = el?.getAttribute('grid-pid')
        const item = movingItem.value!
        // 不在一个坐标系（嵌套拖拽）
        if(pid && item.pid !== pid) {
            // 计算当前元素相对坐标系的坐标
            const relativeTo = getOffsetRelativeTo(targetEl.value!, el)
            x = relativeTo.x + mouseOffsetX
            y = relativeTo.y + mouseOffsetY

            const toItem = modelValue.value.find(v => v.id === pid)!
            item.pid = pid
            emits('nestedChange', item, toItem)
            // 结束当前坐标系的拖拽
            document.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true, // 让事件可以冒泡
                cancelable: true, // 是否可取消
                clientX: clientX, // 模拟鼠标位置
                clientY: clientY
            }))

            // 在新的坐标系执行拖拽
            nextTick(() => {
                const nEl = document.querySelector(`.grid-nested[grid-pid='${pid}'] .grid-nested-item[grid-id='${item.id}']`)
                nEl && nEl.dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true, // 让事件可以冒泡
                    cancelable: true, // 是否可取消
                    clientX: clientX, // 模拟鼠标位置
                    clientY: clientY
                }))
            })
        }

        moveLeft.value = x
        moveTop.value = y

        // 边界判断
        if(x < 0) x = 0
        if(y < 0) y = 0
        if(targetEl.value) {
            const w = layoutRect.value.width - targetEl.value!.offsetWidth
            if(x > w) x = w
        }
        item.x = pixelToGridX(x, marginX.value, boxWidth.value)
        item.y = pixelToGridY(y, marginY.value, rootData.rowHeight!)
        skyline.value = compressVerticalSkyline(currentData, rootData.cols!)
    }

    const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
        targetEl.value!.style.pointerEvents = ''
        movingItem.value = undefined
        targetEl.value = undefined
    }
    const movingItem = ref<IGridItem>()

    return {
        mouseDown, mouseUp, movingItem, moveLeft, moveTop
    }
}

const useResizeFn = (
    rootData: IData, 
    currentData: Ref<IGridItem[]>, 
    boxWidth: Ref<number>, 
    modelValue: Ref<IGridItem[]>, 
    skyline: Ref<number[]>
) => {
    const marginX = computed(() => rootData.margin![0])
    const marginY = computed(() => rootData.margin![1])
    const resizeItem = ref<IGridItem>()
    const resizeWidth = ref(0)
    const resizeHeight = ref(0)
    const resizeDown = (event: MouseEvent, v: IGridItem) => {
        const currentEl = ((event.currentTarget as HTMLDivElement).parentNode as HTMLDivElement).getClientRects()[0]!
        const { width, height } = currentEl
        resizeWidth.value = width
        resizeHeight.value = height
        resizeItem.value = v
        document.addEventListener('mousemove', resizeMove)
        document.addEventListener('mouseup', resizeUp)
    }
    const resizeMove = (event: MouseEvent) => {
        resizeWidth.value += event.movementX
        resizeHeight.value += event.movementY

        const item = resizeItem.value!
        if(resizeWidth.value < boxWidth.value) resizeWidth.value = boxWidth.value
        if(resizeHeight.value < rootData.rowHeight!) resizeHeight.value = rootData.rowHeight!
        let w = pixelToGridX(resizeWidth.value, marginX.value, boxWidth.value)
        const h = pixelToGridY(resizeHeight.value, marginY.value, rootData.rowHeight!)

        // 是嵌套的时候，计算当前子节点的最大宽度（缩放不能覆盖最右侧的子节点）
        if(item.isNested) {
            const l = modelValue.value.filter(v => v.pid === item.id).map(v => v.x + v.w)
            const m = Math.max(...l)
            if(w < m) w = m
        }

        // 计算当前坐标系的最大值（缩放不能覆盖最右侧父节点）
        const maxW = modelValue.value.find(v => v.id === item.pid)?.w ?? rootData.cols!
        if(w + item.x > maxW) w = maxW - item.x
        item.w = w
        item.h = h
        skyline.value = compressVerticalSkyline(currentData, rootData.cols!)
    }
    const resizeUp = () => {
        document.removeEventListener('mousemove', resizeMove)
        document.removeEventListener('mouseup', resizeUp)
        resizeItem.value = undefined
    }

    return {
        resizeDown, resizeItem, resizeWidth, resizeHeight
    }
}

/** 向上压缩空间 */
const compressVerticalSkyline = (currentData: Ref<IGridItem[]>, cols: number) => {
    // 初始化 skyline 为 0（每列当前高度）
    const skyline: number[] = new Array(cols).fill(0)
    // 按 y 升序处理（可确保稳定放置）
    currentData.value.sort((a,b) => (a.y - b.y) || (a.x - b.x))
    // 辅助：取区间 max
    const rangeMax = (l: number, r: number) => {
        let m = 0
        for (let c = l; c < r; c++) if (skyline[c]! > m) m = skyline[c]!
        return m
    }
    for (const item of currentData.value) {
        const l = item.x
        const r = Math.min(cols, item.x + item.w)
        const newY = rangeMax(l, r) // 可以放置的最小 y
        item.y = newY
        const newBottom = newY + item.h
        for (let c = l; c < r; c++) skyline[c] = newBottom
    }
    return skyline
}

/** 计算容器最大值 */
const countGridMaxHeight = (skyline: number[], rowHeight: number, marginY: number) => {
    const m = Math.max(...skyline)
    return m * rowHeight + (m - 1) * marginY
}

/**
 * 反推坐标轴X
 * @param px 实际坐标
 * @param marginX marginLeft
 * @param boxWidth 单个坐标宽度
 * @returns 
 */
const pixelToGridX = (px: number, marginX: number, boxWidth: number) => Math.round((px - marginX) / (boxWidth + marginX))

/**
 * 反推坐标轴Y
 * @param px 实际坐标
 * @param marginY marginTop
 * @param rowHeight 单个坐标高度
 * @returns 
 */
const pixelToGridY = (py: number, marginY: number, rowHeight: number) => Math.round((py - marginY) / (rowHeight + marginY))

const getStyle = (v: IGridItem, marginX: number, marginY: number, boxWidth: number, boxHeight: number) => {
    const style: Record<string, any> = {
        width: `${boxWidth * v.w + (v.w - 1) * marginX}px`,
        height: `${boxHeight * v.h + (v.h - 1) * marginY}px`,
        left: `${boxWidth * v.x + (v.x + 1) * marginX - marginX}px`,
        top: `${boxHeight * v.y + (v.y + 1) * marginY - marginY}px`
    }
    return style
}

/** 获取一个元素相对于另一个元素的偏移量 */
const getOffsetRelativeTo = (el: HTMLDivElement, relativeEl: HTMLDivElement) => {
    const rect1 = el.getBoundingClientRect()
    const rect2 = relativeEl.getBoundingClientRect()

    return {
        x: rect1.left - rect2.left,
        y: rect1.top - rect2.top
    }
}

/** 监听元素改变 */
const domResizeObserver = (el: HTMLElement, callback: (entries: ResizeObserverEntry[]) => void) => {
    // 创建监听器
    const resizeObserver = new ResizeObserver((entries) => callback(entries))
    // 开始监听
    resizeObserver.observe(el)

    return {
        stop: () => resizeObserver.unobserve(el)
    }
}