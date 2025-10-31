## vue3栅栏嵌套布局

支持缩放和自动对齐，支持嵌套和分组

### 使用方式

1. 安装 `npm i vue3-grid-nested -D`
1. 使用：

    ```ts
    import { gridNestedInstall } from 'vue3-grid-nested'
    import 'vue3-grid-nested/style.css'
    app.use(gridNestedInstall)
    ```

### 示例

#### 单层

```vue
<template>
    <GridLayout v-model='layout'>
        <template #default='scope'>
            <div class='item'>{{ scope.row.id }}</div>
        </template>
    </GridLayout>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import { type IGridItem } from 'vue3-grid-nested'

const layout = ref<IGridItem[]>([
    { id: 'a', x: 0, y: 0, w: 3, h: 3 },
    { id: 'b', x: 3, y: 0, w: 3, h: 3 },
    { id: 'c', x: 6, y: 0, w: 6, h: 3 },
    { id: 'd', x: 4, y: 3, w: 6, h: 12 },

    { id: 'd-a', x: 0, y: 3, w: 4, h: 8 },
    { id: 'd-a-a', x: 0, y: 0, w: 2, h: 2 },
    { id: 'd-a-b', x: 0, y: 2, w: 2, h: 2 },

    { id: 'd-b', x: 0, y: 0, w: 2, h: 2 },

    { id: 'e', x: 0, y: 2, w: 2, h: 3 },
    { id: 'f', x: 6, y: 6, w: 4, h: 3 }
])
</script>
<style scoped>
.item{
    width: 100%;
    height: 100%;
    border: 1px dashed #f00;
    box-sizing: border-box;
}
</style>
```

#### 嵌套

```vue
<template>
    <GridNested v-model='layout'>
        <template #default='scope'>
            <div v-if='scope.row.isNested'>
                <!-- <div>nexted--{{ scope.row.id }}</div> -->
            </div>
            <div v-else class='item'>
                <div>{{ scope.row.id }}</div>
                <div>{{ scope.row.x }}--{{ scope.row.y }}--{{ scope.row.w }}--{{ scope.row.h }}</div>
            </div>
        </template>
    </GridNested>
</template>
<script setup lang='ts'>

import { ref } from 'vue'
import { type IGridItem } from 'vue3-grid-nested'

const layout = ref<IGridItem[]>([
    { pid: '#', id: 'a', x: 0, y: 0, w: 3, h: 3 },
    { pid: '#', id: 'b', x: 3, y: 0, w: 3, h: 3 },
    { pid: '#', id: 'c', x: 6, y: 0, w: 6, h: 3 },
    { pid: '#', id: 'd', x: 4, y: 3, w: 6, h: 12, isNested: true },

    { pid: 'd', id: 'd-a', x: 0, y: 0, w: 4, h: 8, isNested: true },
    { pid: 'd-a', id: 'd-a-a', x: 0, y: 0, w: 2, h: 2 },
    { pid: 'd-a', id: 'd-a-b', x: 0, y: 2, w: 2, h: 2 },

    { pid: 'd', id: 'd-b', x: 0, y: 0, w: 2, h: 2 },

    { pid: '#', id: 'e', x: 0, y: 2, w: 2, h: 3 },
    { pid: '#', id: 'f', x: 6, y: 6, w: 4, h: 3 }
])
</script>

<style scoped>
.item{
    width: 100%;
    height: 100%;
    border: 1px dashed #f00;
    box-sizing: border-box;
}
</style>
```
