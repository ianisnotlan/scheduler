<template>
  <div class="profile_box">
    <!-- <img class="profile_photo" :src="photo" /> -->
    <div class="profile_input">
      username:&nbsp;<input type="text" class="input" v-model="username" />
    </div>
    <br />
    <div class="profile_input">
      email:&nbsp;<input type="email" class="input" v-model="email" />
    </div>
    <br />
    <div class="profile_input">
      birthday:&nbsp;
      <select v-model="birthday.month">
        <option v-for="(option, key) in monthOptions" :key="key" :value="key">
          {{ option }}
        </option>
      </select>
      &nbsp;
      <input type="text" class="day input" v-model="birthday.day" />, &nbsp;
      <input type="text" class="year input" v-model="birthday.year" />
    </div>
    <p v-if="warning" class="warning">{{ warning }}</p>
    <template v-else><br /><br /></template>
    <button class="save_button" @click="updateProfile">Save</button>
  </div>
</template>

<script>
import * as api from '../api'

export default {
  name: 'Profile',
  data() {
    return {
      id: null,
      username: null,
      email: null,
      photo: null,
      birthday: { year: null, month: null, day: null },
      monthOptions: {
        1: 'January',
        2: 'Febuary',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
      },
      warning: null,
    }
  },
  async created() {
    const resp = await api.getUserProfile()
    this.id = resp.id
    this.username = resp.username
    this.email = resp.email
    this.photo = resp.photo
    if (resp.birthday) {
      const date = resp.birthday.split('-')
      this.birthday = { year: date[0], month: date[1], day: date[2] }
    }
  },
  methods: {
    async updateProfile() {
      const birthday = `${this.birthday.year}-${this.birthday.month}-${this.birthday.day}`
      try {
        await api.updateProfile(
          this.id,
          this.username,
          this.email,
          this.photo,
          birthday
        )
        this.warning = null
      } catch (err) {
        if (err.response.data.email)
          this.warning = 'Please enter a valid email address'
        else if (err.response.data.birthday)
          this.warning = 'Please enter a valid date'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.profile {
  &_box {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 25%;
    height: 30vh;
    border: 1px solid black;
    border-radius: 5%;
    padding: 1%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &_photo {
    width: 100px;
    height: 100px;
  }

  &_input {
    display: flex;
    align-items: center;
    width: 90%;
    height: 15%;
    padding: 0 2%;
    font-size: 20px;
  }
}

.input {
  flex: 1;
  border: none;
  border-bottom: 1px solid;
  outline-width: 0;
  font-size: 20px;
}

.year {
  flex: 0;
  width: 50px;
  text-align: center;
}

.day {
  flex: 0;
  width: 30px;
  text-align: center;
}

.save_button {
  height: 15%;
  border: 1px solid black;
  border-radius: 10px;
  padding: 0 2%;
  font-size: 20px;
  background-color: white;
  cursor: pointer;
}

.save_button:hover {
  opacity: 0.3;
}

.warning {
  color: red;
  font-size: 13px;
}
</style>
