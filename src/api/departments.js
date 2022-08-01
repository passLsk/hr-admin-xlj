import request from '@/utils/request'
export const getDepartmentsList = () => {
  return request({
    url: '/company/department'
  })
}
/**
 *删除部门
 * @param {部门id} id
 * @returns
 */
export const delDepartmentsList = id => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
/**
 * 新增部门
 * @param code 编码 introduce部门介绍 manager部门负责人 name部门名称 pid部门id
 * @returns
 */
export const addDepartment = ({ code, introduce, manager, name, pid }) => {
  return request({
    method: 'POST',
    url: '/company/department',
    data: { code, introduce, manager, name, pid }
  })
}
/**
 *编辑部门
 * @param {部门id} data
 * @returns
 */
export const editDepartmentsApi = data => {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
