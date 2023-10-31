<script setup lang="ts">
import {
  reqCancelSale,
  reqRemoveSku,
  reqSaleSku,
  reqSkuInfo,
  reqSkuList,
} from '@/api/product/sku'
import type { SkuInfoData, SkuResponseData } from '@/api/product/sku/type'
import { SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

// 分页器当前页码
const pageNo = ref<number>(1)
// 每一页展示几条数据
const pageSize = ref<number>(10)
const total = ref<number>(0)
const skuArr = ref<SkuData[]>([])
// 控制抽屉显示与隐藏的字段
const drawer = ref<boolean>(false)
const skuInfo = ref<SkuData>({})

// 当组件挂载完毕
onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager: number = 1) => {
  pageNo.value = pager
  const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 分页器下拉菜单变化回调
const handler = () => {
  getHasSku()
}

// 商品的上架与下架
const updateSale = async (row: SkuData) => {
  // 如果是已上架的，说明是上架状态，更新为下架状态
  if (row.isSale) {
    // 下架操作
    const result = await reqCancelSale(row.id as number)
    if (result.code === 200) {
      ElMessage.success('下架成功')
      getHasSku(pageNo.value)
    } else {
      ElMessage.error('下架失败')
    }
  } else {
    const result = await reqSaleSku(row.id as number)
    if (result.code === 200) {
      ElMessage.success('上架成功')
      getHasSku(pageNo.value)
    } else {
      ElMessage.error('上架失败')
    }
  }
}

// 更新已有的sku
const updateSku = (row: SkuData) => {
  console.log(row)
  ElMessage.success('程序员正在更新中...')
}

// 查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
  // 抽屉展示出来
  drawer.value = true
  // 获取已有商品详情数据
  const result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code === 200) {
    skuInfo.value = result.data
  }
}

// 删除某一个已有的商品
const removeSku = async (id: number) => {
  // 删除某一个已有商品的请求
  const result = await reqRemoveSku(id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    // 获取已有的全部的所有商品
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="150px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #default="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="info"
            size="small"
            icon="Edit"
            @click="updateSku(row)"
          ></el-button>
          <el-button
            type="info"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除 ${row.skuName} ?`"
            width="200px"
            @confirm="removeSku(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
    <!-- 抽屉组件，展示商品的详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              type="danger"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="160px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<style scoped lang="scss">
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
