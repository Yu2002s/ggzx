<script setup lang="ts">
import {
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
  reqHasTrademark,
} from '@/api/product/trademark'
import { Records, Trademark, TrademarkResponseData } from '@/api/product/trademark/type'
import { ElMessage, type FormInstance, type UploadProps } from 'element-plus'
import { onMounted, onUnmounted, reactive, ref } from 'vue'

const dialogFormVisible = ref<boolean>(false)

// 当前页码
const pageNo = ref<number>(1)
// 每一页展示多少条数据
const limit = ref<number>(3)
// 存储已有品牌的数据的总数
const total = ref<number>(0)
// 存储已有品牌的数组
const trademarkArr = ref<Records>([])

// 定义收集品牌的接口数据
const trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})

// 获取el-from表单实例
const formRef = ref<FormInstance>()

// 获取已有品牌的接口封装为一个函数，在任何情况下获取数据，调用函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  const result: TrademarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code === 200) {
    // 存储已有品牌的数据
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

onMounted(() => {
  // 组件挂载完毕钩子 --- 发第一次请求，获取第一页、一页三个已有品牌数据
  getHasTrademark()
  console.log('onMounted')
})

onUnmounted(() => {
  console.log('onUnmounted')
})

// 当前分页器页码发生变化时触发
// 当前页码发生变化自定义事件，组件pagination父组件回传了数据（当前页码）
/* const changePageNo = () => {
  // 当前页码发生变化时再次发起请求获取数据
  console.log('123');
  getHasTrademark()
} */

// 当下拉菜单发生变化的时候，会触发此方法
// 这个自定义事件，分页器组件会将下拉菜单选中的数据返回
const sizeChange = () => {
  // 当前每一页的数据发生变化的时候，当前页码归1
  // pageNo.value = 1

  getHasTrademark()
}

// 添加品牌
const addTrademark = () => {
  // 显示对话框
  dialogFormVisible.value = true
  // 清空上一次的数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
  // 清除所有表单验证错误信息
  formRef.value?.clearValidate()
}

// 修改已有品牌数据
// row:即为当前已有品牌数据
const updateTrademark = (row: Trademark) => {
  dialogFormVisible.value = true
  // 展示已有品牌的数据
  // ES6语法合并对象
  Object.assign(trademarkParams, row)
  /* trademarkParams.id = row.id
  trademarkParams.tmName = row.tmName
  trademarkParams.logoUrl = row.logoUrl */
  // 清除所有表单验证错误信息
  formRef.value?.clearValidate()
}

const cancel = () => {
  dialogFormVisible.value = false
}

const confirm = async () => {
  // 在发请求之前对整个表单进行校验
  // 调用这个方法进行全部表单项的校验，如果全部通过在进行后面的方法
  await formRef.value?.validate()

  const result = await reqAddOrUpdateTrademark(trademarkParams)
  // 修改|添加品牌成功
  if (result.code === 200) {
    // 关闭对话框
    cancel()
    ElMessage.success('操作成功')
    // 再次发起请求，获取已有品牌数据
    await getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    cancel()
    ElMessage.error('操作失败')
  }
}

// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  _: any,
) => {
  // response: 当前这次上传图片服务器返回的结
  // uploadFile: 当前上传的图片文件
  trademarkParams.logoUrl = response.data
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  // 如果图片上传成功，清除掉错误信息
  formRef.value?.clearValidate('logoUrl')
}

// 上传图片组件->上传图片触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 钩子是在图片上传之前触发,上传文件之前可以约束文件类型与大小
  // 要求：上传文件格式格式png|jpg|gif，大小不超过4M
  if (
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/jpg' ||
    rawFile.type === 'image/gif'
  ) {
    // 判断文件类型是否符合要求
    if (rawFile.size / 1024 / 1024 < 4) {
      // 判断文件大小是否符合要求
      return true
    } else {
      ElMessage.error('上传头像图片大小不能超过 4MB!')
      return false
    }
  } else {
    ElMessage.error('上传头像图片只能是 png/jpg/gif 格式!')
    return false
  }
}

// 品牌校验自定义校验规则
const validateTrademarkName = (_: any, value: string, callback: any) => {
  // 当表单元素触发blur时，会触发此方法
  // console.log(rule);
  if (value.trim().length >= 2) {
    callback()
  } else {
    // 返回的错误的提示信息
    callback(new Error('品牌名称不能少于2个字符'))
  }
}

// 品牌logo自定义校验规则
const validateTrademarkLogo = (_: any, value: string, callback: any) => {
  // 如果图片上传
  if (value) {
    callback()
  } else {
    callback(new Error('LOGO图片务必上传'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: [
    // required 表示必填项
    // trigger 触发校验规则时机
    { required: true, trigger: 'blur', validator: validateTrademarkName },
  ],
  logoUrl: [{ required: true, trigger: 'change', validator: validateTrademarkLogo }],
}

// 气泡确认框确定按钮回调
const removeTrademark = async (id: number) => {
  const result = await reqDeleteTrademark(id)
  if (result.code === 200) {
    // 删除成功的提示信息
    ElMessage.success('删除品牌成功')
    // 再次获取已有品牌数据
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除品牌失败')
  }
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部的添加品牌按钮 -->
      <el-button v-has="`btn.Trademark.add`" type="primary" icon="Plus" @click="addTrademark">
        添加品牌
      </el-button>
      <!-- 表格组件，用于展示已有品牌数据 -->
      <!-- 
      table
         border 可以设置纵向是否有边框
      table-column
        label 某一个列表
        width 列表的宽度
        align 列表的对齐方式
     -->
      <el-table style="margin: 10px 0" border :data="trademarkArr" :page-count="9">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <!-- table-cloumn:默认展示数据是div -->
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template v-slot="{ row }">
            <img
              :src="row.logoUrl.startsWith('http') ? row.logoUrl : 'http://' + row.logoUrl"
              style="width: 100px; height: 100px; object-fit: cover"
              alt="图片不存在"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              title="你确定要删除这个品牌吗?"
              width="250px"
              icon="delete"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
      pagination
      v-model:current-page="currentPage" 分页器当前的页码
      v-model:page-size="pageSize4" 设置每一页展示数据的条数
      :page-sizes="[3, 5, 7, 9]" 下拉菜单的数量
      :small="small" 是否使用小型分页器
      :disabled="disabled" 是否禁用
      :background="background" 是否为背景色
      layout="total, sizes, prev, pager, next, jumper" 设置分页器显示的内容
      :total="total" 总共有多少条数据

     -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, total, sizes"
        :total="total"
        @current-change="getHasTrademark"
        @size-change="sizeChange"
      />
    </el-card>
    <!-- 对话框组件 -->
    <!-- v-model属性用于控制对话框显示与隐藏 
    title是设置左上角标题的
  -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action:上传文件地址 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>