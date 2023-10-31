<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import { Attr } from '@/api/product/attr/type'
import { reqAddSku, reqSpuHasSaleAttr, reqSpuImageList } from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
import { SaleAttr, SpuData, SpuImage } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

// 自定义事件的方法
const emit = defineEmits(['changeScene'])

const cancel = () => {
  emit('changeScene', { flag: 0 })
}

// 平台属性
const attrArr = ref<Attr[]>([])
// 销售属性
const saleArr = ref<SaleAttr[]>([])
// 照片墙
const imgArr = ref<SpuImage[]>([])
// 获取table组件
const table = ref<any>()
// 收集sku参数
const skuParams = reactive<SkuData>({
  // 父组件传递过来的数据
  category3Id: '',
  spuId: '',
  tmId: '',
  // v-model收集
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})

// 当前子组件的方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: SpuData,
) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id!!
  skuParams.tmId = spu.tmId
  // 获取平台属性
  const result = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  const result2 = await reqSpuHasSaleAttr(spu.id as number)
  // 获取照片墙的数据
  const result3 = await reqSpuImageList(spu.id as number)
  // 平台属性
  attrArr.value = result.data
  saleArr.value = result2.data
  imgArr.value = result3.data
}

// 设置默认图片的方法回调
const handler = (row: any) => {
  // 点击的时候，让全部复选框不勾选
  /* imgArr.value.forEach(item => {
    table.value.toggleRowSelection(item, false)
  }) */
  // 清除勾选
  table.value.clearSelection()
  // 复选框选中
  table.value.toggleRowSelection(row, true)

  // 收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

// 保存按钮的方法
const save = async () => {
  // 整理参数
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({saleAttrId, saleAttrValueId})
    }
    return prev
  }, [])
  // 发请求
  const result = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage.success('操作成功')
    // 通知父组件切换场景0
    emit('changeScene', {flag: 0})
  } else {
    ElMessage.error('操作失败')
  }
  //成功
  // 失败
}

// 对外暴露的方法
defineExpose({
  initSkuData,
})
</script>

<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuParams.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input
          placeholder="重量(克)"
          type="number"
          v-model="skuParams.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input placeholder="SKU描述" v-model="skuParams.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form inline>
          <el-form-item
            :label="item.attrName"
            v-for="item in attrArr"
            :key="item.id"
          >
            <el-select v-model="item.attrIdAndValueId">
              <el-option
                v-for="attrValue in item.attrValueList"
                :key="attrValue.id"
                :value="`${item.id}:${attrValue.id}`"
                :label="attrValue.valueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form inline>
          <el-form-item
            :label="item.saleAttrName"
            v-for="item in saleArr"
            :key="item.id"
          >
            <el-select v-model="item.saleIdAndValueId">
              <el-option
                v-for="saleAttrValue in item.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :value="`${item.id}:${saleAttrValue.id}`"
                :label="saleAttrValue.saleAttrValueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="imgArr" ref="table">
          <el-table-column
            type="selection"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handler(row)">
                设置默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>
