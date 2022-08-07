<template>
  <div class="detail_container">
    <div class="detail_close close" @click="$emit('close')">&times;</div>
    <div class="detail_date">{{ detailDate.month }} / {{ detailDate.day }}</div>
    <div class="button" @click="newEvent">New event</div>
    <br />
    <div v-if="showLoginPrompt">Please log in to manage your schedule</div>
    <div
      class="detail_eventlist"
      v-for="event in eventsOfSelectedDay(
        detailDate.year,
        detailDate.month,
        detailDate.day
      )"
      :style="eventBackgroundColor(event.id)"
      :key="event.id"
    >
      <div class="information">
        <div class="information-title">{{ event.title }}</div>
        <div>
          {{ event.start_datetime.month }}/{{ event.start_datetime.day }}
        </div>
        <div>{{ event.start_datetime.time }}</div>
        -
        <div>{{ event.end_datetime.month }}/{{ event.end_datetime.day }}</div>
        <div>{{ event.end_datetime.time }}</div>
      </div>
      <div class="edit_share_delete">
        <div class="button" @click="editEvent(event)">edit</div>
        <div
          v-if="event.creator === currentUser"
          class="button"
          @click="deleteEvent(event)"
        >
          delete
        </div>
      </div>
    </div>
    <div v-if="showEventDetail" class="backdrop" />
    <div class="edit_container" v-if="showEventDetail">
      <div class="detail_close close" @click="closeEventDetail">&times;</div>
      <input
        class="edit_container-title"
        placeholder="Add Title"
        v-model="eventTitle"
      />
      <div class="edit_container-start">
        starts:&nbsp;
        <div class="edit_container-date" @click="openCalendar('start')">
          {{ eventStartDate.month }} / {{ eventStartDate.day }}
        </div>
        <calendar
          class="calendar_small start"
          v-if="showSmallCalendar === 'start'"
          :defaultYear="eventStartDate.year"
          :defaultMonth="eventStartDate.month"
          :defaultDay="eventStartDate.day"
          :small="true"
          @event="changeEventDate"
        />
        &nbsp;&nbsp;
        <select v-model="eventStartDate.time">
          <option v-for="option in startTimeOptions" :key="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="edit_container-end">
        ends:&nbsp;
        <div class="edit_container-date" @click="openCalendar('end')">
          {{ eventEndDate.month }} / {{ eventEndDate.day }}
        </div>
        <calendar
          class="calendar_small end"
          v-if="showSmallCalendar === 'end'"
          :defaultYear="eventStartDate.year"
          :defaultMonth="eventStartDate.month"
          :defaultDay="eventStartDate.day"
          :disablePreviousDay="true"
          :small="true"
          @event="changeEventDate"
        />
        &nbsp;&nbsp;
        <select v-model="eventEndDate.time">
          <option v-for="option in endTimeOptions" :key="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="edit_container-creator">creator: {{ eventCreator }}</div>
      <div class="edit_container-shared">
        <div>shared users:</div>
        <div class="edit_container-searchbox">
          <input
            class="search"
            placeholder="manage with others"
            v-model="userInSearch"
          />
          <div v-if="userSearchResult.length" class="result">
            <div
              class="each"
              v-for="user in userSearchResult"
              :key="user"
              @click="addSharedUser(user)"
            >
              {{ user }}
            </div>
          </div>
        </div>
        <div class="notice">notice: only creator can delete the event</div>
        <div v-if="eventSharedUsers.length" class="edit_container-sharedusers">
          <div class="user" v-for="user in eventSharedUsers" :key="user">
            <div>{{ user }}</div>
            <div class="close" @click="removeSharedUser(user)">&times;</div>
          </div>
        </div>
      </div>
      <div v-if="showWarning">
        <div class="warning" v-if="titleLimitation">
          Please make sure title is less than 100 characters
        </div>
        <div class="warning" v-else-if="!eventTitle">
          Title may not be blank
        </div>
      </div>
      <button class="edit_container-save button" @click="saveEvent">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useStore } from '../store'
import { formatDate, generateTimeOptions, chooseColor } from '../utils'
import * as api from '../api'
import Calendar from './Calendar.vue'

export default {
  name: 'Detail',
  components: { Calendar },
  props: {
    detailDate: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      startOrEnd: null,
      selectedEventId: null,
      eventTitle: null,
      eventStartDate: null,
      eventEndDate: null,
      eventCreator: null,
      eventSharedUsers: null,
      showEventDetail: false,
      showSmallCalendar: false,
      showLoginPrompt: false,
      startTimeOptions: null,
      userList: [],
      userInSearch: null,
      userSearchResult: [],
      showWarning: false,
    }
  },
  async created() {
    if (this.currentUser) {
      this.startTimeOptions = generateTimeOptions('00:00')
      this.userList = await api.getUserList()
      let index = this.userList.findIndex(
        (user) => user.username == this.currentUser
      )
      this.userList.splice(index, 1)
    }
  },
  watch: {
    detailDate() {
      this.showEventDetail = false
    },
    endTimeOptions(newVal, oldVal) {
      if (newVal.length < oldVal.length || this.eventStartDate.time === '23:55')
        this.eventEndDate.time = newVal[0]
    },
    eventStartDate: {
      handler(val) {
        if (
          formatDate(val.year, val.month, val.day) >=
          formatDate(
            this.eventEndDate.year,
            this.eventEndDate.month,
            this.eventEndDate.day
          )
        ) {
          const date = new Date(
            val.year,
            val.month - 1,
            val.day,
            Number(val.time.split(':')[0]),
            Number(val.time.split(':')[1])
          )
          const plusFiveMinutes = new Date(date.getTime() + 5 * 60 * 1000)
          this.eventEndDate.year = plusFiveMinutes.getFullYear()
          this.eventEndDate.month = plusFiveMinutes.getMonth() + 1
          this.eventEndDate.day = plusFiveMinutes.getDate()
        }
      },
      deep: true,
    },
    userInSearch(val) {
      this.userSearchResult = []
      if (!val) return
      for (let user of this.userList) {
        if (user.username.toLowerCase().search(val) != -1) {
          this.userSearchResult.push(user.username)
        }
      }
    },
  },
  computed: {
    ...mapState(useStore, ['eventsOfSelectedDay', 'currentUser']),
    endTimeOptions() {
      let start = { ...this.eventStartDate }
      let end = { ...this.eventEndDate }
      if (
        Object.keys(start).length &&
        start.year === end.year &&
        start.month === end.month &&
        start.day === end.day
      ) {
        return generateTimeOptions(start.time, 'end')
      }
      return generateTimeOptions('00:00')
    },
    titleLimitation() {
      return this.eventTitle.length > 100
    },
  },
  methods: {
    ...mapActions(useStore, ['getAllEvents']),
    newEvent() {
      if (this.currentUser) {
        this.showEventDetail = true
        this.eventTitle = ''
        this.eventStartDate = {
          ...this.detailDate,
          time: this.startTimeOptions[0],
        }
        this.eventEndDate = { ...this.detailDate }
        this.eventEndDate.time = this.endTimeOptions[0]
        this.eventCreator = this.currentUser
        this.eventSharedUsers = []
      } else {
        this.showLoginPrompt = true
      }
    },
    editEvent(event) {
      this.showEventDetail = true
      this.eventTitle = event.title
      this.eventStartDate = { ...event.start_datetime }
      this.eventEndDate = { ...event.end_datetime }
      this.eventCreator = event.creator
      this.eventSharedUsers = event.shared_users
      this.selectedEventId = event.id
    },
    addSharedUser(user) {
      this.userInSearch = null
      if (!this.eventSharedUsers.find((usr) => usr === user))
        this.eventSharedUsers.push(user)
    },
    removeSharedUser(user) {
      let index = this.eventSharedUsers.indexOf(user)
      this.eventSharedUsers.splice(index, 1)
    },
    async deleteEvent(event) {
      await api.deleteEvent(event.id)
      await this.getAllEvents(this.detailDate.year, this.detailDate.month)
    },
    async saveEvent() {
      if (this.titleLimitation || !this.eventTitle) {
        this.showWarning = true
        return
      }
      let start = this.eventStartDate
      let end = this.eventEndDate
      let startDateTime = `${start.year}-${start.month}-${start.day}T${start.time}`
      let endDateTime = `${end.year}-${end.month}-${end.day}T${end.time}`
      if (this.selectedEventId) {
        await api.updateEvent(
          this.selectedEventId,
          this.eventTitle,
          startDateTime,
          endDateTime,
          this.eventCreator,
          this.eventSharedUsers
        )
      } else {
        await api.newEvent(
          this.eventTitle,
          startDateTime,
          endDateTime,
          this.eventCreator,
          this.eventSharedUsers
        )
      }
      await this.getAllEvents(this.detailDate.year, this.detailDate.month)
      this.closeEventDetail()
    },
    closeEventDetail() {
      this.showEventDetail = false
      this.showSmallCalendar = false
      this.showWarning = false
      this.userInSearch = null
      this.selectedEventId = null
    },
    openCalendar(type) {
      this.showSmallCalendar = type
    },
    changeEventDate(year, month, day) {
      if (this.showSmallCalendar === 'start') {
        this.eventStartDate.year = year
        this.eventStartDate.month = month
        this.eventStartDate.day = day
      } else if (this.showSmallCalendar === 'end') {
        this.eventEndDate.year = year
        this.eventEndDate.month = month
        this.eventEndDate.day = day
      }
      this.showSmallCalendar = false
    },
    eventBackgroundColor(index) {
      return { backgroundColor: chooseColor(index) }
    },
  },
}
</script>

<style lang="scss" scoped>
.detail {
  &_container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .backdrop {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 0 10px 10px 0;
    }
  }

  &_date {
    align-self: flex-start;
    font-size: 30px;
    font-weight: 500;
    margin: 10px 0 0 10px;
  }

  &_eventlist {
    width: 100%;
    position: relative;

    .information {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 10px 0;

      &-title {
        width: 30%;
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .edit_share_delete {
      display: none;
    }
  }

  &_eventlist:hover {
    .information {
      opacity: 0.1;
    }

    .edit_share_delete {
      position: absolute;
      top: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 10px;
      padding: 6px 0;
    }
  }

  &_close {
    position: absolute;
    right: 10px;
    top: 5px;
    transform: scale(1.8);
  }
}

.close {
  cursor: pointer;
  opacity: 0.3;
}

.close:hover {
  opacity: 1;
}

.button {
  cursor: pointer;
  color: black;
  background-color: inherit;
  border: 1px solid black;
  display: inline-block;
  border-radius: 10px;
  padding: 3px;
}

.button:hover {
  opacity: 0.5;
}

.edit_container {
  border: 1px solid;
  border-radius: 10px;
  position: absolute;
  top: 50px;
  width: 91%;
  padding: 30px 10px 10px;
  background-color: white;

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
    margin-top: 10px;

    .calendar {
      &_small {
        width: 200px;
        border: 1px solid black;
        position: absolute;
        left: 55px;
        display: flex;
        flex-direction: column;
        z-index: 10;
        font-size: 10px;
        background-color: white;
      }
    }

    .start {
      top: 21px;
    }

    .end {
      top: 49px;
    }
  }

  &-date:hover {
    cursor: pointer;
    transition: transform 0.5s;
    transform: scale(1.1);
  }

  &-creator {
    margin-top: 10px;
    display: flex;
    font-size: 20px;
  }

  &-shared {
    margin-top: 10px;
    position: relative;
    text-align: left;
    font-size: 20px;

    .notice {
      font-size: 14px;
    }
  }

  &-searchbox {
    position: absolute;
    left: 120px;
    top: 4px;
    display: flex;
    flex-direction: column;
    width: 50%;

    .search {
      width: 97%;
    }

    .result {
      border: 1px solid;
      border-top: 0;
      width: 100%;
      z-index: 5;
      background-color: white;

      .each {
        width: 98%;
        padding-left: 3px;
        font-size: 15px;
        text-align: left;
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .each:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  &-sharedusers {
    margin-top: 6px;
    display: flex;
    max-width: 100%;
    overflow: scroll;

    .user {
      cursor: pointer;
      color: black;
      background-color: white;
      border: 1px solid black;
      display: flex;
      border-radius: 10px;
      padding: 0 5px;
      margin-right: 4px;
      font-size: 18px;
    }
  }

  &-save {
    margin-top: 6px;
    padding: 6px;
  }
}

.warning {
  margin-top: 10px;
  color: red;
}
</style>
