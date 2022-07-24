<template>
  <form class="login_box" @submit.prevent="logIn">
    <input
      type="text"
      class="login_input"
      placeholder="Username"
      v-model="username"
    /><br /><br />
    <input
      type="password"
      class="login_input"
      placeholder="Password"
      v-model="password"
    /><br /><br />
    <button class="login_button">Log In</button>
    <p v-if="status == 'loginFailed'" class="login_failed">
      the password you've entered is incorrect
    </p>
    <template v-else><br /><br /></template>
    <hr />
    <br />
    <button class="signup_button" @click="signUp">Sign Up</button>
  </form>
</template>

<script>
import { logIn } from '../api'

export default {
  name: 'LogIn',
  data() {
    return {
      username: '',
      password: '',
      status: '',
    }
  },
  methods: {
    async logIn() {
      const resp = await logIn(this.username, this.password)
      if (resp.msg === 'failed') {
        this.status = 'loginFailed'
      } else {
        this.$router.push({ name: 'Home' })
      }
    },
    signUp() {
      this.$router.push({ name: 'SignUp' })
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  &_box {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 25%;
    height: 40vh;
    border: 1px solid black;
    border-radius: 5%;
    padding: 1%;
  }
  &_input {
    width: 90%;
    height: 15%;
    border: 1px solid black;
    border-radius: 8px;
    padding: 0 2%;
    font-size: 20px;
  }
  &_button {
    width: 95%;
    height: 15%;
    border: 1px solid black;
    border-radius: 8px;
    padding: 0 2%;
    font-size: 20px;
    background-color: white;
    cursor: pointer;
  }
  &_button:hover {
    opacity: 0.3;
  }
  &_failed {
    color: red;
    line-height: 0;
    font-size: 15px;
  }
}

.signup_button {
  width: 95%;
  height: 15%;
  border: 1px solid black;
  border-radius: 8px;
  padding: 0 2%;
  font-size: 20px;
  background-color: white;
  cursor: pointer;
}

.signup_button:hover {
  opacity: 0.3;
}
</style>
