<template>
  <div class="schedule">
    <div v-if="username" class="user">
      <button
        class="user_name hover"
        @click="showUserDropdown = !showUserDropdown"
      >
        {{ username }}
      </button>
      <div v-if="showUserDropdown" class="user_dropdown">
        <div class="hover" @click="editProfile">Profile</div>
        <div class="hover" @click="logOut">Log out</div>
      </div>
    </div>
    <div v-else class="user hover" @click="logIn">log in</div>
    <div class="schedule_container">
      <calendar
        class="calendar_container"
        :class="{ shrink: showDetail == true }"
        @event="openDetail"
      />
      <detail
        v-if="showDetail"
        :detailDate="detailDate"
        @close="showDetail = false"
        class="detail_container"
      />
    </div>
  </div>
</template>

<script>
import * as api from '../api'
import Calendar from '../components/Calendar.vue'
import Detail from '../components/Detail.vue'

export default {
  components: { Calendar, Detail },
  name: 'Home',
  data() {
    return {
      username: null,
      detailDate: null,
      showDetail: false,
      showUserDropdown: false,
    }
  },
  async created() {
    const resp = await api.getUser()
    this.username = resp.username
  },
  methods: {
    async logIn() {
      this.$router.push({ name: 'LogIn' })
    },
    async logOut() {
      await api.logOut()
      this.username = null
    },
    editProfile() {
      this.$router.push({ name: 'Profile' })
    },
    openDetail(year, month, day) {
      this.showDetail = true
      this.detailDate = { year, month, day }
    },
  },
}
</script>

<style lang="scss" scoped>
.schedule {
  display: flex;
  flex-direction: column;
  text-align: center;

  .user {
    position: relative;
    font-size: 20px;
    padding: 5px;
    align-self: flex-end;

    &_name {
      font-size: 20px;
      border: none;
      background-color: inherit;
    }
    &_dropdown {
      position: absolute;
      top: 37px;
      right: 0;
      text-align: right;
      white-space: nowrap;
      padding: 5px;
      background-color: orange;
    }
  }

  .hover {
    cursor: pointer;
  }

  .hover:hover {
    opacity: 0.3;
  }

  &_container {
    display: flex;
    justify-content: center;

    .calendar_container {
      width: 100%;
      max-width: 1600px;
      min-height: 810px;
      height: 90vh;
      max-height: 1000px;
      border: 1px solid black;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      transition: width 0.5s;
    }

    .shrink {
      width: 75%;
      border-radius: 10px 0 0 10px;
    }

    .detail_container {
      position: relative;
      width: 25%;
      border: 1px solid black;
      border-radius: 0 10px 10px 0;
    }
  }
}
</style>
