<template>
  <div>
    <div class="year">{{ selectedYear }}</div>
    <div class="month">
      <i class="arrow left" @click="prev"></i>
      <div class="month_title">{{ findMonthhName(selectedMonth) }}</div>
      <i class="arrow right" @click="next"></i>
    </div>
    <div class="week">
      <div class="name" v-for="(name, index) in days" :key="index">
        {{ name }}
      </div>
    </div>
    <div class="days">
      <div class="day" v-for="day in gap" :key="day"></div>
      <div
        class="day hover"
        v-for="date in findMonthDays(selectedMonth, selectedYear)"
        :key="date"
        @click="$emit('event', selectedMonth, date)"
      >
        <div
          class="date"
          :class="{
            today:
              date == currentDate &&
              selectedMonth == currentMonth &&
              selectedYear == currentYear,
            selected: selectedMonth == detailMonth && date == detailDate,
          }"
        >
          {{ date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
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
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      selectedMonth: null,
      selectedYear: null,
    }
  },
  created() {
    this.selectedMonth = this.currentMonth
    this.selectedYear = this.currentYear
  },
  computed: {
    date() {
      return new Date()
    },
    currentYear() {
      return this.date.getFullYear()
    },
    currentMonth() {
      return this.date.getMonth() + 1
    },
    currentDate() {
      return this.date.getDate()
    },
    currentDay() {
      return this.date.getDay()
    },
    gap() {
      let selectedMonth = this.selectedMonth
      let selectedYear = this.selectedYear
      let gap = 0
      if (selectedYear > this.currentYear) {
        while (selectedMonth > 1) {
          gap += this.findMonthDays(selectedMonth - 1, selectedYear)
          selectedMonth--
        }
        selectedYear--
        while (selectedYear > this.currentYear) {
          gap += this.isLeapYear(selectedYear) ? 366 : 365
          selectedYear--
        }
        selectedMonth = 13
      } else if (selectedYear < this.currentYear) {
        while (selectedMonth < 13) {
          gap += this.findMonthDays(selectedMonth, selectedYear)
          selectedMonth++
        }
        selectedYear++
        while (selectedYear < this.currentYear) {
          gap += this.isLeapYear(selectedYear) ? 366 : 365
          selectedYear++
        }
        selectedMonth = 1
      }

      if (selectedMonth > this.currentMonth) {
        while (selectedMonth > this.currentMonth) {
          gap += this.findMonthDays(selectedMonth - 1, selectedYear)
          selectedMonth--
        }
        gap = this.currentDay + ((1 + gap - this.currentDate) % 7)
      } else if (selectedMonth <= this.currentMonth) {
        while (selectedMonth < this.currentMonth) {
          gap += this.findMonthDays(selectedMonth, selectedYear)
          selectedMonth++
        }
        gap = this.currentDay - ((this.currentDate + gap - 1) % 7)
      }

      return gap < 0 ? gap + 7 : gap >= 7 ? gap - 7 : gap
    },
  },
  methods: {
    isLeapYear(year) {
      return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)
    },
    findMonthhName(month) {
      return this.months[month]
    },
    findMonthDays(month, year) {
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
    openDetail(month, date) {
      this.$emit('openDetail', month, date)
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

  .today {
    background-color: orange;
  }

  .selected {
    transform: scale(1.5);
    font-size: 150%;
  }

  .hover:hover {
    cursor: pointer;
    opacity: 1;

    .date {
      transform: scale(1.5);
      font-size: 150%;
    }
  }
}
</style>
