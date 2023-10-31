<script setup lang="ts">
import type {
  AllTradeMark,
  HasSaleAttr,
  SaleAttr,
  SaleAttrResponseData,
  SaleAttrValue,
  SpuData,
  SpuHasImg,
  SpuImage,
  Trademark,
} from '@/api/product/spu/type.ts'
import {
  reqAddOrUpdateSpu,
  reqAllTrademark,
  reqSaleAttr,
  reqSpuHasSaleAttr,
  reqSpuImageList,
} from '@/api/product/spu'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['changeScene'])

// 点击取消按钮，通知父组件去切换场景为1，展示已有的spu数据
const cancel = () => {
  emit('changeScene', {flag: 0, params: 'update'})
}

// 储存已有的spu数据
const AllTrademark = ref<Trademark[]>([])
// 商品图片
const imgList = ref<SpuImage[]>([])
// 已有的spu销售属性
const saleAttr = ref<SaleAttr[]>([])
// 全部的销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])
// 控制对话框的显示与隐藏
const dialogVisible = ref(false)
// 储存预览图片的地址
const dialogImageUrl = ref('')
// 储存已有的spu对象
const spuParams = ref<SpuData>({
  category3Id: '', // 三级分类的id
  description: '', // spu描述
  spuName: '', // spu名字
  tmId: '', // 品牌id
  spuImageList: [],
  spuSaleAttrList: [],
})
// 将来收集还没选择的id和属性名字
const saleAttrIdAndValueName = ref<string>('')

// 子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  // 储存已有的spu对象，将来模板中展示
  spuParams.value = spu
  // spu:父组件传递过来已有的spu数据
  // 获取全部品牌的数据
  const result: AllTradeMark = await reqAllTrademark()
  // 获取某一个品牌旗下的全部售卖商品的图片
  const result2: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 获取已有spu销售属性的数据
  const result3: SaleAttrResponseData = await reqSpuHasSaleAttr(
    spu.id as number,
  )
  // 获取已有的所有销售属性
  const result4 = await reqSaleAttr()
  // 储存全部品牌的数据
  AllTrademark.value = result.data
  // spu对应的商品图片
  imgList.value = result2.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 储存已有的spu销售惜
  saleAttr.value = result3.data
  // 储存全部的销售属性
  allSaleAttr.value = result4.data
}

// 照片墙点击预览按钮时候触发的回调
const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

// 照片墙删除图片的回调
const handleRemove = () => {}

// 照片墙上传成功之前的钩子，可以约束文件类型大小
const handlerUpload = (file: any) => {
  if (
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    }
  }
  ElMessage.error('上传文件类型或者大小错误')
  return false
}

// 计算出当前spu还未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  // 全部的销售属性，【颜色，尺码，版本】
  // 已有的销售属性【颜色，版本】
  return allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item2) => item.name !== item2.saleAttrName)
  })
})

// 添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 准备一个新的销售属性对象，将来带给服务器
  const newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组中
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}

// 属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  // 进入编辑模式
  row.flag = true
  row.saleAttrValue = ''
}

// 表单元素失去焦点的回调
const toLook = (row: SaleAttr) => {
  // 整理收集到属性的id和属性的名字
  const { baseSaleAttrId, saleAttrValue, saleAttrName } = row
  // 整理服务器需要的属性值形式
  const newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrName,
    saleAttrValueName: saleAttrValue as string,
  }

  // 非法情况判断
  if (!saleAttrValue?.trim()) {
    ElMessage.error('属性值不能为空')
    return
  }

  // 判断属性值是否在数组中存在
  const repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue
  })

  // 是否重复
  if (repeat) {
    ElMessage.error('属性值不能重复')
    return
  }

  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}

// 保存按钮的回调
const save = async () => {
  // 整理参数
  //1,照片墙的数据
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, // 图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  //2,整理销售属性的数据
  spuParams.value.spuSaleAttrList = saleAttr.value
  // 发请求：添加或者更新已有的spu
  const result = await reqAddOrUpdateSpu(spuParams.value)
  // 成功
  if (result.code === 200) {
    ElMessage.success('操作成功')
    // 通知父组件，切换场景为0
    emit('changeScene', {
      flag: 0,
      params: spuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage.error('操作失败')
  }
  // 失败
}

// 添加一个新的spu初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(spuParams.value, {
    id: null,
    category3Id: '', // 三级分类的id
    description: '', // spu描述
    spuName: '', // spu名字
    tmId: '', // 品牌id
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 清空照片墙
  imgList.value = []
  // 清空销售属性
  saleAttr.value = []
  // 清空销售属性id与属性名
  saleAttrIdAndValueName.value = ''
  // 存储3级分类id
  spuParams.value.category3Id = c3Id
  // 获取全部品牌的数据
  const result: AllTradeMark = await reqAllTrademark()
  // 获取已有的所有销售属性
  const result2 = await reqSaleAttr()

  // 存储数据
  AllTrademark.value = result.data
  allSaleAttr.value = result2.data
}

// 对外暴露方法
defineExpose({
  initHasSpuData,
  initAddSpu,
})
</script>

<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请你输入SPU的名称"
          v-model="spuParams.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select v-model="spuParams.tmId">
          <el-option
            :value="trademark.id"
            :label="trademark.tmName"
            :key="trademark.id"
            v-for="trademark in AllTrademark"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="请你输入SPU的描述"
          v-model="spuParams.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!--   action: 上传图片地址
             list-type: 文件列表类型
             -->
        <el-upload
          v-model:file-list="imgList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="handlerUpload"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img
            w-full
            :src="dialogImageUrl"
            alt="Preview Image"
            style="width: 100%; height: 100%"
          />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <!--     展示销售的下拉菜单   -->
        <el-select
          v-model="saleAttrIdAndValueName"
          :placeholder="
            unSelectSaleAttr.length
              ? `还未选择${unSelectSaleAttr.length}个`
              : '无数据'
          "
        >
          <el-option
            :label="item.name"
            v-for="item in unSelectSaleAttr"
            :key="item.id"
            :value="`${item.id}:${item.name}`"
          ></el-option>
        </el-select>
        <el-button
          style="margin-left: 10px"
          type="primary"
          icon="plus"
          :disabled="!saleAttrIdAndValueName"
          @click="addSaleAttr"
        >
          添加属性值
        </el-button>
        <!--    table展示销售属性与属性值    -->
        <el-table border style="margin: 10px 0" :data="saleAttr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="销售属性名字"
            prop="saleAttrName"
            width="120px"
          ></el-table-column>
          <el-table-column label="销售属性值">
            <!--             row: 当前spu已有的销售属性对象 -->
            <template v-slot="{ row }">
              <el-tag
                style="margin: 0 5px"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                class="mx-1"
                closable
                :type="tag.type"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.flag"
                placeholder="请你输入属性值"
                style="width: 120px"
                v-model="row.saleAttrValue"
                @blur="toLook(row)"
              ></el-input>
              <el-button
                v-else
                type="primary"
                size="small"
                icon="plus"
                @click="toEdit(row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #default>
              <el-button size="small" type="danger" icon="delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save" :disabled="!saleAttr?.length">
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>