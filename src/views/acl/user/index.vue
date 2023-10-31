<script setup lang="ts">
import {
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveUser,
  reqSelectUser,
  reqSetUserRole,
  reqUserInfo,
} from '@/api/acl/user'
import type {
  AllRole,
  AllRoleResponseData,
  Records,
  SetRoleData,
  User,
  UserResponseData,
} from '@/api/acl/user/type'
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage, FormInstance } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'

// 默认页码
const pageNo = ref<number>(0)
// 一页展示几条数据
const pageSize = ref<number>(5)
// 用户的总个数
const total = ref<number>(0)
// 用户的数组
const userArr = ref<Records>([])
// 控制响应式数据抽屉显示与隐藏
const drawer = ref<boolean>(false)
// 收集用户信息的响应式数据
const userParams = reactive<User>({
  username: '',
  password: '',
  name: '',
})
// 获取form组件实例
const formRef = ref<FormInstance>()
// 控制分配角色抽屉显示与隐藏
const drawer2 = ref<boolean>(false)
// 存储全部职位的数据
const allRole = ref<AllRole>([])
// 当前用户已有的职位
const userRole = ref<AllRole>([])
// 收集顶部复选框全选的数据
const checkAll = ref<boolean>(false)
// 控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true)
// 批量删除用户的id
const selectIdArr = ref<User[]>([])
// 定义响应式数据，收集用户输入的关键字
const keyword = ref<string>('')
const layoutSettingStore = useLayoutSettingStore()

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  const result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

onMounted(() => {
  getHasUser()
})

// 分页器下拉菜单自定义事件的回调
const handler = () => {
  getHasUser()
}

// 添加用户按钮的回调
const addUser = () => {
  // 抽屉显示出来
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    username: '',
    password: '',
    name: '',
  })
  // 重置表单
  userParams.id = undefined
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

// 更新用户按钮回调
// row: 已有的账号信息
const updateUser = (row: User) => {
  drawer.value = true
  // 储存收集已有的账号信息
  Object.assign(userParams, row)
}

// 保存按钮的回调
const save = async () => {
  // 点击保存按钮的时候。务必需要表单全部符合条件再去发请求
  await formRef.value?.validate()
  const result: any = await reqAddOrUpdateUser(userParams)
  console.log(result)
  if (result.code === 200) {
    // 关闭抽屉
    drawer.value = false
    // 提示信息
    ElMessage.success('操作成功')
    // 重新获取用户信息
    // getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器重新刷新
    window.location.reload()
  } else {
    ElMessage.error('操作失败')
  }
}

// 取消按钮回调
const cancel = () => {
  // 关闭抽屉
  drawer.value = false
}

// 校验用户名的回调函数
const validatorUserName = (rule: any, value: string, callback: any) => {
  console.log(rule)
  // 用户名字|昵称|长度至少五位
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户名至少五位'))
  }
}

// 校验用户昵称的回调函数
const validatorName = (rule: any, value: string, callback: any) => {
  console.log(rule)
  // 用户名字|昵称|长度至少五位
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称至少五位'))
  }
}

// 校验用户密码的回调函数
const validatorPassword = (rule: any, value: string, callback: any) => {
  console.log(rule)
  // 用户密码长度至少六位
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户密码至少六位'))
  }
}

// 表单校验的规则
const rules = {
  // 用户名字
  username: [
    { required: true, trigger: 'change', validator: validatorUserName },
  ],
  // 用户昵称
  name: [{ required: true, trigger: 'change', validator: validatorName }],
  // 用户密码
  password: [
    { required: true, trigger: 'change', validator: validatorPassword },
  ],
}

// 分配角色按钮的回调
const setRole = async (row: User) => {
  // 存储已有的用户信息
  Object.assign(userParams, row)
  // 发请求获取全部的职位的数据以及当前用户已有的职位的数据
  const result: AllRoleResponseData = await reqAllRole(row.id as number)
  if (result.code === 200) {
    // 存储全部的职位的数据
    allRole.value = result.data.allRolesList
    // 存储当前用户已有的职位的数据
    userRole.value = result.data.assignRoles
    // 抽屉显示出来
    drawer2.value = true
  }
}

// 顶部的全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  // val true: 全选 false：取消全选
  userRole.value = val ? allRole.value : []
  // 不确定的样式
  isIndeterminate.value = false
}

// 底部复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 顶部复选框的勾选数据
  const checkedCount = value.length
  // 代表：勾选上的职位与全部职位是否相等，则为全选
  checkAll.value = checkedCount === allRole.value.length
  // 不确定的样式
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

// 确定按钮的回调（分配角色）
const confirmClick = async () => {
  // 收集参数
  const data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => item.id as number),
  }
  // 分配用户的职位
  const result: any = await reqSetUserRole(data)
  if (result.code === 200) {
    // 提示信息
    ElMessage.success('分配职位成功')
    // 关闭抽屉
    drawer2.value = false
    // 获取更新完毕用户的信息，更新完毕留在当前页
    getHasUser(pageNo.value)
  } else {
    ElMessage.error('分配职位失败')
  }
}

// 删除某一个用户
const deleteUser = async (userId: number) => {
  const result = await reqRemoveUser(userId)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    // 获取更新完毕用户的信息，更新完毕留在当前页
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}

// table复选框勾选的时候会触发的事件
const selectChange = (value: User[]) => {
  selectIdArr.value = value
}

// 批量删除按钮的回调
const deleteSelectUser = async () => {
  // 整理批量删除的参数
  const idList = selectIdArr.value.map((item) => item.id as number)
  // 批量删除的请求
  const result: any = await reqSelectUser(idList)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    // 获取更新完毕用户的信息，更新完毕留在当前页
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}

// 搜索按钮的回调
const search = () => {
  // 根据关键字获取响应的用户数据
  getHasUser()
  keyword.value = ''
}

// 重置按钮
const reset = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

/* // 测试代码
const checkAll = ref<boolean>(false)
const allRole = ref(['销售', '前台', '财务', 'boss'])
const userRole = ref(['销售'])
// 设置不确定状态，仅负责样式控制
const isIndeterminate = ref<boolean>(true)
// 全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

// 底部复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 以及勾选项目的长度
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  // determinate属性，表示全选框的选中状态，如果为true，则表示用户选中了所有选项，如果为false，则表示没有
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
} */
</script>

<template>
  <div>
    <el-card style="height: 80px">
      <el-form inline class="form">
        <el-form-item label="用户名: ">
          <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!keyword.trim()" @click="search">
            搜索
          </el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button
        type="danger"
        :disabled="!selectIdArr.length"
        @click="deleteSelectUser"
      >
        批量删除
      </el-button>
      <!-- 展示用户的信息 -->
      <el-table
        style="margin: 10px 0"
        border
        :data="userArr"
        @selection-change="selectChange"
      >
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column align="center" label="id" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="用户名"
          prop="username"
        ></el-table-column>
        <el-table-column
          align="center"
          label="用户名称"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="用户角色"
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
        <el-table-column align="center" label="操作" width="300px">
          <template #default="{ row }">
            <el-button
              icon="User"
              size="small"
              type="primary"
              @click="setRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              icon="Edit"
              size="small"
              type="info"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除 ${row.username} 嘛？`"
              width="260px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button icon="Delete" size="small" type="danger">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11]"
        :background="true"
        layout="prev, pager, next, jumper, ->, total, sizes"
        :total="total"
        @current-change="getHasUser"
        @size-change="handler"
      />
    </el-card>
    <!-- 抽屉结构，完成添加账号信息，更新账号信息 -->
    <el-drawer v-model="drawer">
      <!-- 头部的标题 -->
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请输入姓名"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请输入昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!--  抽屉结构,用于某一个已有账号进行职位分配 -->
    <el-drawer v-model="drawer2">
      <template #header>
        <h4>分配角色用户</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input disabled :value="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- 显示职位的复选框 -->
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="item in allRole" :key="item.id" :label="item">
                {{ item.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer2 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
