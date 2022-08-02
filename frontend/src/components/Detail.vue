<template>
  <div class="detail_container">
    <div class="detail_close" @click="$emit('close')"></div>
    <div class="detail_date">{{ detailDate.month }} / {{ detailDate.day }}</div>
    <div class="button" @click="newEvent">New event</div>
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
      <div>{{ event.title }}</div>
      <div>{{ event.start_datetime.month }}/{{ event.start_datetime.day }}</div>
      <div>{{ event.start_datetime.time }}</div>
      -
      <div>{{ event.end_datetime.month }}/{{ event.end_datetime.day }}</div>
      <div>{{ event.end_datetime.time }}</div>
      <div class="button" @click="editEvent(event)">edit</div>
      <div class="button" @click="deleteEvent(event)">delete</div>
    </div>
    <div v-if="showEventDetail" class="backdrop" />
    <div class="edit_container" v-if="showEventDetail">
      <div class="detail_close" @click="closeEventDetail"></div>
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
      <div class="edit_container-save button" @click="saveEvent">Save</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useStore } from '../store'
import { formatDate, generateTimeOptions, eventBackgroundColor } from '../utils'
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
      showEventDetail: false,
      showSmallCalendar: false,
      showLoginPrompt: false,
      startTimeOptions: null,
    }
  },
  async created() {
    this.startTimeOptions = generateTimeOptions('00:00')
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
  },
  methods: {
    ...mapActions(useStore, ['getAllEvents']),
    editEvent(event) {
      this.showEventDetail = true
      this.eventTitle = event.title
      this.eventStartDate = { ...event.start_datetime }
      this.eventEndDate = { ...event.end_datetime }
      this.selectedEventId = event.id
    },
    newEvent() {
      if (this.currentUser) {
        this.showEventDetail = true
        this.eventTitle = null
        this.eventStartDate = {
          ...this.detailDate,
          time: this.startTimeOptions[0],
        }
        this.eventEndDate = { ...this.detailDate, time: this.endTimeOptions[0] }
      } else {
        this.showLoginPrompt = true
      }
    },
    async deleteEvent(event) {
      await api.deleteEvent(event.id)
      this.selectedEventId = null
      await this.getAllEvents(this.detailDate.year, this.detailDate.month)
    },
    async saveEvent() {
      let start = this.eventStartDate
      let end = this.eventEndDate
      let startDateTime = `${start.year}-${start.month}-${start.day}T${start.time}`
      let endDateTime = `${end.year}-${end.month}-${end.day}T${end.time}`
      if (this.selectedEventId) {
        await api.updateEvent(
          this.selectedEventId,
          this.eventTitle,
          startDateTime,
          endDateTime
        )
        this.selectedEventId = null
      } else {
        await api.newEvent(this.eventTitle, startDateTime, endDateTime)
      }
      this.closeEventDetail()
      await this.getAllEvents(this.detailDate.year, this.detailDate.month)
    },
    closeEventDetail() {
      this.showEventDetail = false
      this.showSmallCalendar = false
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
      return eventBackgroundColor(index)
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
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px 0;
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

  &-save {
    margin-top: 10px;
  }
}

.button {
  cursor: pointer;
  border: 1px solid;
  display: inline-block;
  border-radius: 10px;
  padding: 3px;
}

.button:hover {
  opacity: 0.3;
}
</style>
