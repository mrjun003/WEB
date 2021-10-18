<template>
  <div class="login">
    <el-row style="z-index: 1;height: 100%;">
      <div class="box-container">
        <span class="title">数据库运维平台</span>
        <el-card class="login-box"  >
          <el-tabs>
              <el-form class="login-form" ref="form" :model="form" :rules="rules" @keyup.enter.native="handleSubmit">
                <el-form-item prop="username">
                  <el-input v-model="form.username" :autofocus="true" placeholder="请输入用户">
                    <template slot="prepend">
                      <i class="fa fa-user"></i>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="form.password" placeholder="请输入密码" >
                    <template slot="prepend">
                      <i class="fa fa-lock"></i>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-alert v-if="error" :title="error" type="error" style="margin-top: -10px; margin-bottom: 10px" show-icon></el-alert>
                  <el-button type="primary" :loading="loading" @click="handleSubmit" style="width: 100%; margin-bottom: 10px">登录</el-button>
                </el-form-item>
              </el-form>
          </el-tabs>
        </el-card>
      </div>
    </el-row>

  </div>
</template>
<style>
  .login {
    background: url(../assets/login.png) no-repeat scroll center center / cover;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    position: fixed;
  }
  .title {
    width: 100%;
    font-size: 40px;
    color: #ffffff;
    text-align: center;
    display: inline-block;
    margin-bottom: 20px;
  }
  .box-container {
    border: none;
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%,0);
    -webkit-transform: translate3d(-50%, -50%,0);
  }
  .login-form {
    border-radius: 20px;
    abel-with: 80px;
    padding: 0px;
  }
  .login-box-msg {
    color: #ffffff;
    text-align: center;
  }

</style>
<script>
  export default {
    data() {
      return {
        loading: false,
        error: '',
        form: {
          username: 'admin',
          password: 'admin'
        },
        rules: {
          username: [
            {required: true, message: '请输入用户', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.error = '';
        this.$refs['form'].validate(pass => {
          if (!pass) {
            return false
          }
          this.loading = true;
          this.$http.post('/api/account/users/login/', this.form).then(res => {
            localStorage.setItem('token', res.result['token']);
            localStorage.setItem('login_user', res.result['username']);
            localStorage.setItem('permissions', res.result['permissions']);
            this.$router.push('/layout');
          }, response => {
            this.error = response.result
          }).finally(() => this.loading = false)
        })
      }
    },
    watch: {
      form: {
        handler: function () {
          this.error = ''
        },
        deep: true
      }
    }
  }
</script>
