<template>
  <div>
    <!-- 三级分类全局组件 -->
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select v-model="categoryStore.c1Id" @change="handler">
            <el-option
              v-for="c1 in categoryStore.c1Arr"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
            <!-- 对于options组件，label为显示的文字，value为select下拉菜单收集的数据 -->
            <!-- <el-option
              :label="c1.name"
              :value="c1.id"
              v-for="(c1, index) in c1Arr"
              :key="c1.id"
            ></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="categoryStore.c2Id" @change="handler2">
            <el-option
              :label="c2.name"
              v-for="c2 in categoryStore.c2Arr"
              :key="c2.id"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="categoryStore.c3Id">
            <el-option
              :label="c3.name"
              v-for="c3 in categoryStore.c3Arr"
              :key="c3.id"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'

const categoryStore = useCategoryStore()

// 引入组件挂载完毕的方法
onMounted(() => {
  getC1()
})

// 通知仓库获取一级分类数据
const getC1 = () => {
  // 通知分类仓库发请求获取一级分类
  categoryStore.getC1()
}

// 此方法即为一级分类下拉菜单change事件，当选中值的时候触发，保证一级分类的id有了
const handler = () => {
  // 通知仓库获取二级分类数据
  categoryStore.getC2()
}

// 二级分类下拉菜单change事件
const handler2 = () => {
  categoryStore.getC3()
}

/* // 引入分类的接口方法
import { reqC1 } from '@/api/product/attr'
// 引入声明周期函数
import { onMounted, ref } from 'vue'

// 储存一级分类数据
const c1Arr = ref<any>([])
const c1Id = ref<number | string>('')

// 组件挂载完毕
onMounted(() => {
  // 获取一级分类数据
  getC1()
})

// 获取分类数据方法
const getC1 = async () => {
  const result = await reqC1()
  if (result.code === 200) {
    c1Arr.value = result.data
  }
} */
</script>

<style scoped></style>
