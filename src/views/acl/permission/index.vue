<script setup lang="ts">
import { reqAddOrUpdateMenu, reqAllPermission, reqRemoveMenu } from '@/api/acl/menu'
import type { MenuParams, Permission, PermissionList } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

// 存储菜单的数据
const permissionArr = ref<PermissionList>([])
// 控制对话框的显示与隐藏
const dialogVisible = ref(false)
// 携带的参数
const menuData = reactive<MenuParams>({
  code: '', // 权限值
  level: 0, // 新增/更新几级菜单
  name: '', // 权限值
  pid: 0, // 菜单的id
})

onMounted(() => {
  getHasPermission()
})

// 获取菜单数据的方法
const getHasPermission = async () => {
  const result = await reqAllPermission()
  if (result.code === 200) {
    permissionArr.value = result.data
  }
}

// 添加菜单按钮的回调
const addPermission = (row: Permission) => {
  // 清空数据
  Object.assign(menuData, { id: undefined, code: '', level: 0, name: '', pid: 0 })
  // 对话框显示出来
  dialogVisible.value = true
  // 收集新增菜单的level数值
  menuData.level = row.level + 1
  // 给谁新增子菜单
  menuData.pid = row.id as number
}

// 更新已有的菜单
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  // 收集已有的菜单数据进行更新
  Object.assign(menuData, row)
}

// 确定按钮的回调
const save = async () => {
  // 发请求：新增子菜单|更新某一个已有菜单的数据
  const result = await reqAddOrUpdateMenu(menuData)
  if (result.code === 200) {
    dialogVisible.value = false
    ElMessage.success('操作成功')
    // 再次获取全部最新的菜单数据
    getHasPermission()
  } else {
    ElMessage.error('操作失败')
  }
}

// 删除按钮的回调
const removeMenu = async (id: number) => {
  const result = await reqRemoveMenu(id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    // 再次获取全部最新的菜单数据
    getHasPermission()
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<template>
  <div>
    <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="addPermission(row)">
            {{ row.level === 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="info"
            size="small"
            :disabled="row.level === 1"
            @click="updatePermission(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除 ${row.name} 嘛？`"
            width="260px"
            @confirm="removeMenu(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" :disabled="row.level === 1">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件，添加或者更新已有菜单的数据结构 -->
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'" width="30%">
      <!-- 表单元素,收集新增与已有数据 -->
      <el-form label-width="60px">
        <el-form-item label="名称">
          <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限值">
          <el-input placeholder="请你输入权限值" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
