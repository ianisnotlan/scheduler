<template>
  <form class="signup_box" @submit.prevent="signUp">
    <input type="text" class="signup_input" placeholder="Username" v-model="username" required/><br /><br />
    <input type="password" class="signup_input" placeholder="Password" v-model="password" required/><br /><br />
    <input type="email" class="signup_input" placeholder="email" v-model="email" required/>
    <p v-if="warning" class="warning">{{ warning }}</p>
    <template v-else><br /><br /></template>
    <hr /><br />
    <button class="signup_button">Sign Up</button>
  </form>
</template>

<script>
import * as api from "../api";

export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      password: "",
      email: "",
      warning: "",
    };
  },
  methods: {
    async signUp() {
      try {
        await api.signUp(this.username, this.password, this.email);
        await api.logIn(this.username, this.password);
        this.$router.push({ name: "Home" });
      } catch(e) {
        this.warning = e.response.data.username[0];
      }
    },
  },
};
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
