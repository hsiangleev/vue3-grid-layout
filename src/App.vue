<template>
    <div class='content'>
        <el-tabs v-model='activeName' class='nested-tabs-flex'>
            <el-tab-pane label='单层' name='layout'>
                <el-scrollbar v-if='activeName === "layout"' class='h-full'>
                    <LayoutTest />
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label='无限嵌套' name='nested'>
                <el-scrollbar v-if='activeName === "nested"' class='h-full'>
                    <NestedTest />
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label='分组嵌套' name='nestedTab'>
                <el-scrollbar v-if='activeName === "nestedTab"' class='h-full'>
                    <NestedTabTest />
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import LayoutTest from '@/view/layout.vue'
import NestedTest from '@/view/nested.vue'
import NestedTabTest from '@/view/nestedTab/index.vue'

const activeName = ref('layout')
</script>

<style>
html,body{
    margin: 0;
    padding: 0;
}
.content {
    width: 100vw;
    height: 100vh;
}
.nested-tabs-flex {
    height: 100%;
    display: flex;

    & > .el-tabs__content {
        display: block;
        flex: 1;
        flex-basis: auto;
        overflow: auto;

        & > .el-tab-pane{
            height: 100%;
        }
    }
}
</style>