<template>
  <div>
    <div class="year">{{ selectedYear }}</div>
    <div class="month">
      <i class="arrow left" @click="prev"></i>
      <div class="month_title">{{ findMonthhName(selectedMonth) }}</div>
      <i class="arrow right" @click="next"></i>
    </div>
    <div class="week">
      <div class="name" v-for="(name, index) in weekDays" :key="index">
        {{ name }}
      </div>
    </div>
    <div class="days">
      <div
        class="day"
        v-for="day in frontGap"
        :key="day"
        @click="
          emitEvent(
            previousMonth.year,
            previousMonth.month,
            findMonthDays(previousMonth.year, previousMonth.month) -
              frontGap +
              day
          )
        "
      >
        <div
          class="date other_month"
          :class="{
            disabled: disabledDay(
              previousMonth.year,
              previousMonth.month,
              findMonthDays(previousMonth.year, previousMonth.month) -
                frontGap +
                day
            ),
            hover: !disabledDay(
              previousMonth.year,
              previousMonth.month,
              findMonthDays(previousMonth.year, previousMonth.month) -
                frontGap +
                day
            ),
          }"
        >
          {{
            findMonthDays(previousMonth.year, previousMonth.month) -
            frontGap +
            day
          }}
        </div>
        <template v-if="!small">
          <div
            v-for="event in eventsOfSelectedDay(
              previousMonth.year,
              previousMonth.month,
              findMonthDays(previousMonth.year, previousMonth.month) -
                frontGap +
                day
            )"
            :key="event.id"
            :style="eventBackgroundColor(event.id)"
            class="event_title"
          >
            {{ event.title }}
          </div>
        </template>
      </div>
      <div
        class="day"
        v-for="day in findMonthDays(selectedYear, selectedMonth)"
        :key="day"
        @click="emitEvent(selectedYear, selectedMonth, day)"
      >
        <div
          class="date"
          :class="{
            today:
              selectedYear === currentYear &&
              selectedMonth === currentMonth &&
              day === currentDay,
            disabled: disabledDay(selectedYear, selectedMonth, day),
            hover: !disabledDay(selectedYear, selectedMonth, day),
          }"
        >
          {{ day }}
        </div>
        <template v-if="!small">
          <div
            v-for="event in eventsOfSelectedDay(
              selectedYear,
              selectedMonth,
              day
            )"
            :key="event.id"
            :style="eventBackgroundColor(event.id)"
            class="event_title"
          >
            {{ event.title }}
          </div>
        </template>
      </div>
      <div
        class="day"
        v-for="day in rearGap"
        :key="day"
        @click="emitEvent(nextMonth.year, nextMonth.month, day)"
      >
        <div
          class="date other_month"
          :class="{
            disabled: disabledDay(nextMonth.year, nextMonth.month, day),
            hover: !disabledDay(nextMonth.year, nextMonth.month, day),
          }"
        >
          {{ day }}
        </div>
        <template v-if="!small">
          <div
            v-for="event in eventsOfSelectedDay(
              nextMonth.year,
              nextMonth.month,
              day
            )"
            :key="event.id"
            :style="eventBackgroundColor(event.id)"
            class="event_title"
          >
            {{ event.title }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useStore } from '../store'
import { formatDate, chooseColor } from '../utils'

export default {
  name: 'Calendar',
  props: {
    defaultYear: String,
    defaultMonth: String,
    defaultDay: String,
    disablePreviousDay: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      months: {
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
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      selectedYear: null,
      selectedMonth: null,
    }
  },
  created() {
    this.selectedYear = this.defaultYear || this.currentYear
    this.selectedMonth = this.defaultMonth || this.currentMonth
    if (!this.small && this.currentUser)
      this.getAllEvents(this.selectedYear, this.selectedMonth)
  },
  computed: {
    ...mapState(useStore, ['eventsOfSelectedDay', 'currentUser']),
    date() {
      return new Date()
    },
    currentYear() {
      return this.date.getFullYear()
    },
    currentMonth() {
      return this.date.getMonth() + 1
    },
    currentDay() {
      return this.date.getDate()
    },
    previousMonth() {
      return {
        year:
          this.selectedMonth === 1 ? this.selectedYear - 1 : this.selectedYear,
        month: this.selectedMonth === 1 ? 12 : this.selectedMonth - 1,
      }
    },
    nextMonth() {
      return {
        year:
          this.selectedMonth === 12 ? this.selectedYear + 1 : this.selectedYear,
        month: this.selectedMonth === 12 ? 1 : this.selectedMonth + 1,
      }
    },
    frontGap() {
      const firstDay = new Date(this.selectedYear, this.selectedMonth - 1, 1)
      const weekDay = firstDay.getDay()
      return weekDay
    },
    rearGap() {
      const mod =
        (this.frontGap +
          this.findMonthDays(this.selectedYear, this.selectedMonth)) %
        7
      return mod === 0 ? mod : 7 - mod
    },
  },
  watch: {
    selectedMonth(newVal, oldVal) {
      if (!this.small && oldVal !== null) {
        ;(newVal > oldVal && oldVal !== 1) || newVal === 1
          ? this.shiftFirst(this.selectedYear, newVal)
          : this.shiftLast(this.selectedYear, newVal)
      }
    },
  },
  methods: {
    ...mapActions(useStore, ['getAllEvents', 'shiftFirst', 'shiftLast']),
    isLeapYear(year) {
      return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)
    },
    findMonthhName(month) {
      return this.months[month]
    },
    findMonthDays(year, month) {
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31
        case 2:
          return this.isLeapYear(year) ? 29 : 28
        default:
          return 30
      }
    },
    prev() {
      if (this.selectedMonth == 1) {
        this.selectedMonth = 12
        this.selectedYear--
      } else {
        this.selectedMonth--
      }
    },
    next() {
      if (this.selectedMonth == 12) {
        this.selectedMonth = 1
        this.selectedYear++
      } else {
        this.selectedMonth++
      }
    },
    disabledDay(year, month, day) {
      if (
        this.disablePreviousDay &&
        formatDate(year, month, day) <
          formatDate(this.defaultYear, this.defaultMonth, this.defaultDay)
      ) {
        return true
      }
      return false
    },
    emitEvent(year, month, day) {
      if (!this.disabledDay(year, month, day))
        this.$emit('event', year, month, day)
    },
    eventBackgroundColor(index) {
      return { backgroundColor: chooseColor(index) }
    },
  },
}
</script>

<style lang="scss" scoped>
.year {
  font-size: 40px;
  font-weight: 500;
  margin-top: 10px;
}

.month {
  display: flex;
  align-items: center;
  justify-content: center;

  &_title {
    font-size: 30px;
    width: 170px;
  }

  .arrow {
    border: solid black;
    border-width: 0 3px 3px 0;
    padding: 5px;
    cursor: pointer;
  }

  .arrow:hover {
    opacity: 0.3;
  }

  .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

  .left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
  }
}

.week {
  display: flex;
  border-bottom: 1px solid black;
  padding: 10px 0;

  .name {
    flex: 1;
  }
}

.days {
  margin: 10px;
  flex: 1;
  display: flex;
  flex-wrap: wrap;

  .day {
    text-align: left;
    width: calc(100% / 7);
    cursor: pointer;
  }

  .day:hover {
    .hover {
      transform: scale(1.5);
      font-size: 150%;
    }
  }

  .date {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.5s, font-size 0.5s;
  }

  .other_month {
    color: rgba(0, 0, 0, 0.5);
  }

  .disabled {
    color: rgba(0, 0, 0, 0.2);
  }

  .today {
    background-color: orange;
  }
}

.event_title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
