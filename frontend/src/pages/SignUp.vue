<template>
  <anchor />
  <div class="signup_box">
    <input
      type="text"
      class="signup_input"
      placeholder="Username"
      v-model="username"
    /><br /><br />
    <input
      type="password"
      class="signup_input"
      placeholder="Password"
      v-model="password"
    /><br /><br />
    <input
      type="email"
      class="signup_input"
      placeholder="email (optional)"
      v-model="email"
    />
    <p v-if="warning" class="warning">{{ warning }}</p>
    <template v-else><br /><br /></template>
    <hr />
    <br />
    <button class="signup_button" @click="signUp">Sign Up</button>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useStore } from '../store'
import * as api from '../api'
import Anchor from '../components/Anchor.vue'

export default {
  components: { Anchor },
  name: 'SignUp',
  data() {
    return {
      username: '',
      password: '',
      email: '',
      warning: '',
    }
  },
  methods: {
    ...mapActions(useStore, ['getUser']),
    async signUp() {
      if (this.username && this.password) {
        try {
          await api.signUp(this.username, this.password, this.email)
          await api.logIn(this.username, this.password)
          this.$router.push({ name: 'Home' })
        } catch (err) {
          if (err.response.data.username)
            this.warning = err.response.data.username[0]
          else if (err.response.data.password)
            this.warning = err.response.data.password[0]
          else if (err.response.data.email)
            this.warning = 'Please enter a valid email address'
        }
      } else {
        this.warning = 'username and password may not be blank'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.signup {
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
}

.warning {
  color: red;
  line-height: 0;
  font-size: 15px;
}
</style>
