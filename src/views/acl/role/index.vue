<template>
  <div>
    <el-card>
      <el-form inline class="form">
        <el-form-item label="职位搜索">
          <el-input placeholder="请输入搜索职位的关键字" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!keyword.trim()" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
      <el-table border style="margin: 10px 0" :data="allRole">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="职位名称"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" label="操作" width="280px">
          <template #default="{ row }">
            <el-button icon="user" size="small" type="primary" @click="setPermission(row)">
              分配权限
            </el-button>
            <el-button icon="edit" size="small" type="info" @click="updateRole(row)">
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除 ${row.roleName} 嘛？`"
              width="260px"
              @confirm="removeRole(row.id)"
            >
              <template #reference>
                <el-button icon="delete" size="small" type="danger">删除</el-button>
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
        @size-change="handleSizeChange"
        @current-change="getHasRole"
      />
    </el-card>
    <!-- 更新职位或新增职位dialog -->
    <el-dialog v-model="dialogVisible" :title="roleParams.id ? '更新职位' : '添加职位'">
      <el-form :model="roleParams" :rules="rules" ref="formRef">
        <el-form-item label="职位" prop="roleName">
          <el-input placeholder="请输入职位名称" v-model="roleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <!-- 抽屉组件，分配职位用户菜单权限与按钮的权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree
          ref="tree"
          :data="menuArr"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[1]"
          :default-checked-keys="selectArr"
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="handler">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqAllRoleList,
  reqRemoveRole,
  reqSetPermission,
} from '@/api/acl/role'
import type {
  MenuList,
  MenuResponseData,
  Records,
  RoleData,
  RoleResponseData,
} from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage, type FormInstance } from 'element-plus'
import { nextTick } from 'vue'
import { onMounted, reactive, ref } from 'vue'

// 当前页码
const pageNo = ref<number>(1)
// 一页展示几条数据
const pageSize = ref<number>(10)
// 搜索关键字
const keyword = ref<string>('')
// 存储全部已有的职位
const allRole = ref<Records>([])
// 职位总数
const total = ref<number>(0)
const layoutSettingStore = useLayoutSettingStore()
// 控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 收集新增岗位数据
const roleParams = reactive<RoleData>({
  roleName: '',
})
// 获取form组件实例
const formRef = ref<FormInstance>()
//控制抽屉显示与隐藏
const drawer = ref<boolean>(false)
// 定义数组存储用户的权限的数据
const menuArr = ref<MenuList>([])
// 定义数组存储勾选的节点id
const selectArr = ref<number[]>([])
// 获取tree组件实例
const tree = ref<any>()

// 组件挂载完毕
onMounted(() => {
  // 获取职位的请求
  getHasRole()
})

// 获取全部用户信息的方法，分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  // 修改当前的页码
  pageNo.value = pager
  const result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    allRole.value = result.data.records
    total.value = result.data.total
  }
}

// 下拉菜单的回调
const handleSizeChange = () => {
  getHasRole()
}

// 搜索按钮回调
const search = () => {
  getHasRole()
  keyword.value = ''
}

// 重置按钮的回调
const reset = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

// 添加职位按钮的回调
const addRole = () => {
  // 对话框显示出来
  dialogVisible.value = true
  // 清空数据
  roleParams.roleName = ''
  roleParams.id = undefined

  // 清空上一次表单错误结果
  nextTick(() => {
    formRef.value?.clearValidate('roleName')
  })
}

// 更新已有职位按钮回调
const updateRole = (_row: RoleData) => {
  dialogVisible.value = true
  // 存储已有的职位---带有id
  Object.assign(roleParams, _row)
  // 清空上一次表单错误结果
  nextTick(() => {
    formRef.value?.clearValidate('roleName')
  })
}

const validatorRoleName = (_rule: any, value: string, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('职位名称至少两个字符'))
  }
}

// 职位相关的校验规则
const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorRoleName,
    },
  ],
}

// 确定按钮回调
const save = async () => {
  // 表单校验结果，结果通过了再发请求，结果没有通过，不应该再发请求
  await formRef.value?.validate()
  // 发请求 添加职位|更新职位
  const result = await reqAddOrUpdateRole(roleParams)
  if (result.code === 200) {
    ElMessage.success('操作成功')
    dialogVisible.value = false
    // 获取数据
    getHasRole(roleParams.id ? pageNo.value : 1)
  } else {
    ElMessage.error('操作失败')
  }
}

// 过滤已选中的数据
const filterSelectArr = (allData: any, initData: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level === 4) {
      initData.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initData)
    }
  })
}

// 分配权限按钮的回调
// row:已有的职位的数据
const setPermission = async (row: RoleData) => {
  // 抽屉显示出来
  drawer.value = true
  // 收集当前要分配权限的数据
  Object.assign(roleParams, row)
  // 根据职位获取权限的数据
  const result: MenuResponseData = await reqAllMenuList(roleParams.id as number)
  if (result.code === 200) {
    menuArr.value = result.data
    filterSelectArr(menuArr.value, selectArr.value)
  }
}

// 抽屉确定按钮的回调
const handler = async () => {
  // 获取选中的权限id
  const selectIds = tree.value.getCheckedKeys()
  // 获取半选的id
  const arr = tree.value.getHalfCheckedKeys()
  selectIds.push(...arr)
  // 发送请求
  const result: any = await reqSetPermission(roleParams.id as number, selectIds)
  if (result.code === 200) {
    ElMessage.success('操作成功')
    drawer.value = false
    // 页面的刷新
    window.location.reload()
  } else {
    ElMessage.error('操作失败')
  }
}

// 树形控件
const defaultProps = {
  children: 'children',
  label: 'name',
}

//删除已有的职位
const removeRole = async (id: number) => {
  const result = await reqRemoveRole(id)
  if (result.code === 200) {
    // 提示信息
    ElMessage.success('删除成功')
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
