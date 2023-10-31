<script setup lang="ts">
import { ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category.ts'
import { reqHasSpu, reqRemoveSpu, reqSkuList } from '@/api/product/spu'
import type { Records, SkuData, SpuData } from '@/api/product/spu/type.ts'
import SpuForm from '@/views/product/spu/SpuForm.vue'
import SkuForm from '@/views/product/spu/SkuForm.vue'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()

// 场景数据
const scene = ref(0) // 0显示已有的spu，1：添加或者修改已有的spu结构，2：添加sku结构
// 分页器默认页码
const pageNo = ref(1)
// 每一页展示几条数据
const pageSize = ref(3)
// 储存已有的spu数据
const records = ref<Records>()
// 储存已有spu的总个数
const total = ref(0)
// 获取子组件spuForm
const spuForm = ref<InstanceType<typeof SpuForm>>()
// 获取子组件skuForm
const skuForm = ref<InstanceType<typeof SkuForm>>()
// 储存所有sku数据
const skuArr = ref<SkuData[]>([])
const show = ref(false)

// 此方法执行可以获取某个三级分类下的spu
const getHasSpu = async (pager = 1) => {
  console.log(pageNo.value, pager)
  pageNo.value = pager
  if (!categoryStore.c3Id) return
  const result = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 监听三级分类id的变化
watch(
  () => categoryStore.c3Id,
  () => {
    getHasSpu()
  },
  { immediate: true },
)

// 分页器的下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}

// 添加新的spu的按钮的回调
const addSpu = () => {
  // 切换为场景一，修改已有spu结构
  scene.value = 1
  // 点击添加spu按钮
  spuForm.value?.initAddSpu(categoryStore.c3Id)
}

// 自组件spuForm绑定的自定义事件，子组件让父组件切换scene切换为0
const changeScene = (obj: any) => {
  // 子组件spuForm点击取消变为场景0，展示已有的spu
  scene.value = obj.flag
  if (obj.params === 'update') {
    // 更新留在当前页
    getHasSpu(pageNo.value)
  } else if (obj.params === 'add') {
    // 添加回到第一页
    getHasSpu()
  }
}

// 修改已有的spu的按钮回调
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件实例的方法，获取完整的spu数据
  spuForm.value?.initHasSpuData(row)
}

// 添加sku按钮的回调
const addSku = (row: SpuData) => {
  // 点击添加sku按钮切换场景2
  scene.value = 2
  // 调用子组件的方法，去初始化添加sku的数据
  skuForm.value?.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 获取sku列表数据
const findSku = async (row: SpuData) => {
  const result = await reqSkuList(row.id as number)
  if (result.code === 200) {
    skuArr.value = result.data
    // 对话框显示出来
    show.value = true
  }
}

// 删除已有spu按钮的回调
const deleteSpu = async (row: SpuData) => {
  const result = await reqRemoveSpu(row.id as number)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    // 获取已有的spu的数据
    getHasSpu(records.value!!.length > 1 ? pageNo.value : pageNo.value -1)
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <!--  v-if与v-show都能实现显示与隐藏    -->
      <div v-show="!scene">
        <el-button
          type="primary"
          icon="plus"
          :disabled="!categoryStore.c3Id"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <!--      展示已有的spu数据-->
        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            width="100px"
            align="center"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <!--          row: 已有的spu对象-->
            <template #default="{ row }">
              <el-button
                type="primary"
                icon="plus"
                size="small"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="info"
                icon="edit"
                size="small"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="view"
                size="small"
                title="查看sku列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.spuName}嘛？`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    icon="delete"
                    size="small"
                    title="删除sku"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!--    添加spu，修改spu子组件  -->
      <SpuForm
        ref="spuForm"
        v-show="scene === 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!--    添加sku，修改sku子组件  -->
      <SkuForm
        ref="skuForm"
        v-show="scene === 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- 对话框组件，展示已有的sku数据 -->
      <el-dialog title="SKU列表" v-model="show">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
                alt=""
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
