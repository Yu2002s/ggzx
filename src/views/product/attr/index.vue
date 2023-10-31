<script setup lang="ts">
// 获取仓库
import useCategoryStore from '@/store/modules/category.ts'
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { reqAddOrUpdateAttr, reqAttr, reqRemoveAttr } from '@/api/product/attr'
import {
  Attr,
  AttrList,
  AttrResponseData,
  AttrValue,
} from '@/api/product/attr/type.ts'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()

// 储存已有的属性与属性值
const attrArr = ref<AttrList>([])
// 定义卡片组件内容切换
const scene = ref<number>(0)
// 定义一个响应式的数据，控制编辑模式与查看模式的切换
// const flag = ref(true)

// 准备一个数组，储存组件实例el-input
const inputArr = ref<any[]>([])

// 收集新增的属性的数据
const attrParams = reactive<Attr>({
  attrName: '', // 新增属性的名字
  attrValueList: [], // 新增的属性值数组
  categoryId: '', // 三级分类id
  categoryLevel: 3, // 代表的是三级分类
})

// 获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  if (!c3Id) return
  // 获取分类下已有的属性与属性值
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

// 侦听category3Id
// 侦听
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次的数据
    attrArr.value = []
    // 获取分类的ID
    getAttr()
  },
  {
    immediate: true,
  },
)

// 添加属性按钮的回调
const addAttr = () => {
  // 每一次点击的时候，先清空一下数据，再收集数据
  Object.assign(attrParams, {
    id: undefined,
    attrName: '', // 新增属性的名字
    attrValueList: [], // 新增的属性值数组
    categoryId: categoryStore.c3Id, // 三级分类id
    categoryLevel: 3, // 代表的是三级分类
  })
  // 切换为添加与修改属性的结构
  scene.value = 1
  // 点击这个按钮的时候手机新增属性的三级分类的id
  // attrParams.categoryId = categoryStore.c3Id
}

// 修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性的对象赋值给attrParams对象
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

const cancel = () => {
  scene.value = 0
}

// 添加属性值
const addAttrValue = () => {
  // 点击添加属性值按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制每一个属性值的编辑模式与控制模式切换
  })

  // 获取输入框添加之后的dom
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 保存按钮的回调
const save = async () => {
  // 收集参数
  // 发起请求
  const result = await reqAddOrUpdateAttr(attrParams)
  if (result.code === 200) {
    // 添加或者修改已有属性已经成功
    scene.value = 0
    // 提示信息
    ElMessage.success('操作成功')
    await getAttr()
  } else {
    ElMessage.error('操作失败')
  }
}

// 属性值失去焦点方法
const toLook = (row: AttrValue, index: number) => {
  // 非法情况判断1
  if (!row.valueName.trim()) {
    // 删除空的属性值
    attrParams.attrValueList.splice(index, 1)
    // 提示信息
    ElMessage.error('属性值不能为空')
    return
  }
  const repeat = attrParams.attrValueList.find((item) => {
    // 把当前失去焦点的属性值对象与数组中的每一个属性值对象进行比较（排除当前的）
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 将重复的属性值从数组中删除
    attrParams.attrValueList.splice(index, 1)
    ElMessage.error('属性值不能重复')
    return
  }
  // 非法情况2
  row.flag = false
}

// 点击转换成编辑模式
const toEdit = (row: AttrValue, index: number) => {
  row.flag = true
  // 响应式数据繁盛变化，获取更新的dom
  nextTick(() => {
    inputArr.value[index].focus()
  })
}

// 删除某一个已有的顺序方法回调
const deleteAttr = async (attrId: number) => {
  // 删除已有的属性的请求
  const result = await reqRemoveAttr(attrId)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    // 重新获取数据
    await getAttr()
  } else {
    ElMessage.error('删除失败')
  }
}

// 路由销毁的时候，把相关的数据清空
onBeforeUnmount(() => {
  // 清空仓库的数据
  // categoryStore.$reset()
  // 这里不清空，保留数据更为合理
})
</script>

<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="!scene">
        <el-button
          @click="addAttr"
          type="primary"
          icon="plus"
          :disabled="!categoryStore.c3Id"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot:default="{ row }">
              <!--suppress JSUnresolvedReference -->
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操纵" width="120px">
            <template #default="{ row }">
              <!-- 修改 -->
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="InfoFilled"
                icon-color="#626AEF"
                :title="`你确定要删除[${row.attrName}]嘛？`"
                @confirm='deleteAttr(row.id)'
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div />
      </div>
      <div v-show="scene">
        <!--   展示添加属性与修改属性的结构     -->
        <el-form inline>
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性的名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="plus"
          :disabled="!attrParams.attrName.trim()"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            width="80px"
            type="index"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column label="属性值">
            <!--     row为当前属性值对象       -->
            <template #default="{ row, $index }">
              <el-input
                :ref="(el: any) => (inputArr[$index] = el)"
                v-if="row.flag"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                @blur="toLook(row, $index)"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ $index }">
              <el-button
                type="danger"
                size="small"
                icon="delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="!attrParams.attrValueList.length"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>