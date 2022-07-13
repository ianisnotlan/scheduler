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
        <div class="hover">Profile</div>
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
      <Transition>
        <div class="detail_container" v-show="showDetail">
          <div class="detail_close" @click="closeDetail"></div>
          <div class="detail_date">{{ detailMonth }} / {{ detailDate }}</div>
          <div class="detail_new" @click="newEvent">New event</div>
          <div class="detail_event" v-show="showNewEvent">
            <div class="detail_close" @click="closeNewEvent"></div>
            <input
              class="detail_event-title"
              placeholder="Add Title"
              v-model="eventTitle"
            />
            <div class="detail_event-start">
              starts:&nbsp;
              <div class="detail_event-date" @click="openCalendar('start')">
                {{ eventStartMonth }} / {{ eventStartDate }}
              </div>
              <calendar
                class="calendar_small"
                :class="{ calendar_end: startOrEnd === 'end' }"
                v-show="showSmallCalendar"
                @event="changeEventDate"
              />
              &nbsp;&nbsp;
              <input
                class="detail_event-time"
                type="number"
                min="0"
                max="24"
                v-model="eventStartHour"
              />:
              <input
                class="detail_event-time"
                type="number"
                min="0"
                max="60"
                step="5"
                v-model="eventStartMinute"
              />
            </div>
            <div class="detail_event-end">
              ends:&nbsp;
              <div class="detail_event-date" @click="openCalendar('end')">
                {{ eventEndMonth }} / {{ eventEndDate }}
              </div>
              &nbsp;&nbsp;
              <input
                class="detail_event-time"
                type="number"
                :min="eventStartHour"
                max="24"
                v-model="eventEndHour"
              />:
              <input
                class="detail_event-time"
                type="number"
                min="0"
                max="60"
                step="5"
                v-model="eventEndMinute"
              />
            </div>
            <div class="detail_event-save">Save</div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import * as api from '../api'
import Calendar from '../components/Calendar.vue'

export default {
  components: { Calendar },
  name: 'Home',
  data() {
    return {
      username: '',
      detailMonth: null,
      detailDate: null,
      startOrEnd: null,
      eventTitle: '',
      eventStartMonth: null,
      eventStartDate: null,
      eventEndMonth: null,
      eventEndDate: null,
      eventStartHour: 11,
      eventStartMinute: 0,
      eventEndHour: 12,
      eventEndMinute: 0,
      showDetail: false,
      showNewEvent: false,
      showUserDropdown: false,
      showSmallCalendar: false,
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
      this.username = ''
    },
    openDetail(month, date) {
      this.showDetail = true
      this.showNewEvent = false
      this.detailMonth = month
      this.detailDate = date
    },
    closeDetail() {
      this.showDetail = false
      this.detailMonth = null
      this.detailDate = null
    },
    newEvent() {
      this.showNewEvent = true
      this.eventStartMonth = this.detailMonth
      this.eventStartDate = this.detailDate
      this.eventEndMonth = this.detailMonth
      this.eventEndDate = this.detailDate
    },
    closeNewEvent() {
      this.showNewEvent = false
      this.eventMonth = null
      this.eventDate = null
    },
    openCalendar(type) {
      this.startOrEnd = type
      this.showSmallCalendar = true
    },
    changeEventDate(month, date) {
      this.showSmallCalendar = false
      if (this.startOrEnd === 'start') {
        this.eventStartMonth = month
        this.eventStartDate = date
      } else {
        this.eventEndMonth = month
        this.eventEndDate = date
      }
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
      display: flex;
      flex-direction: column;
      transition: width 0.5s;
    }

    .shrink {
      width: 75%;
    }

    .detail {
      &_container {
        position: relative;
        width: 25%;
        border: 1px solid black;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &_date {
        align-self: flex-start;
        font-size: 30px;
        font-weight: 500;
        margin: 10px 0 0 10px;
      }

      &_new {
        border: 1px solid;
        border-radius: 10px;
        padding: 5px;
        display: inline-block;
        cursor: pointer;
      }

      &_new:hover {
        opacity: 0.3;
      }

      &_close {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
        width: 16px;
        height: 16px;
        opacity: 0.3;
      }
      &_close:hover {
        opacity: 1;
      }
      &_close:before,
      &_close:after {
        position: absolute;
        left: 7.5px;
        content: '';
        height: 16.5px;
        width: 2px;
        background-color: black;
      }
      &_close:before {
        transform: rotate(45deg);
      }
      &_close:after {
        transform: rotate(-45deg);
      }

      &_event {
        border: 1px solid;
        border-radius: 10px;
        position: relative;
        width: 90%;
        padding: 25px 10px 0 10px;

        &-title {
          width: 100%;
          font-size: 20px;
          border: none;
          border-bottom: 1px solid;
          outline: none;
        }

        &-start,
        &-end {
          display: flex;
          position: relative;
          font-size: 20px;

          .calendar {
            &_small {
              width: 200px;
              border: 1px solid black;
              position: absolute;
              top: 21px;
              left: 55px;
              display: flex;
              flex-direction: column;
              z-index: 1;
              font-size: 10px;
              background-color: white;
            }

            &_end {
              top: 49px;
            }
          }
        }

        &-time {
          font-size: 20px;
          border: none;
          outline: none;
          width: 40px;
        }

        &-save {
          cursor: pointer;
          border: 1px solid;
          display: inline-block;
          border-radius: 10px;
          padding: 3px;
        }

        &-save:hover {
          opacity: 0.3;
        }
      }
    }
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}
</style>
