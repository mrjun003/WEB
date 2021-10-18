export default {
  has_permission (permission) {
    let permissions = localStorage.getItem('permissions')
    let b = isSubArray(permissions,permission)
    console.log('----------------------has_permission')
    console.log(permissions)
    console.log(permission)
    console.log(b)
    return b
  }
}
