<template>
  <div class="schedule">
    <div v-if="username" class="user">
      <button class="user_name hover" @click="showUserDropdown = !showUserDropdown">{{ username }}</button>
      <div v-if="showUserDropdown" class="user_dropdown">
        <div class="hover">Profile</div>
        <div class="hover" @click="logOut">Log out</div>
      </div>
    </div>
    <div v-else class="user hover" @click="logIn">log in</div>
    <div class="schedule_container">
      <div class="calendar_container" :class="{ shrink: showDetail == true }">
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
            @click="openDetail(selectedMonth, date)"
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
      <Transition>
        <div class="detail_container" v-show="showDetail">
          <div class="close" @click="closeDetail"></div>
          <div>{{ detailMonth }} / {{ detailDate }}</div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import * as api from "../api"

export default {
  name: "Home",
  data() {
    return {
      username: "",
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      selectedMonth: null,
      selectedYear: null,
      detailMonth: null,
      detailDate: null,
      showDetail: false,
      showUserDropdown: false,
    };
  },
  async created() {
    this.selectedMonth = this.currentMonth;
    this.selectedYear = this.currentYear;
    const resp = await api.getUser();
    this.username = resp.username;
  },
  computed: {
    months() {
      return {
        1: "January",
        2: "Febuary",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
      };
    },
    date() {
      return new Date();
    },
    currentYear() {
      return this.date.getFullYear();
    },
    currentMonth() {
      return this.date.getMonth() + 1;
    },
    currentDate() {
      return this.date.getDate();
    },
    currentDay() {
      return this.date.getDay();
    },
    gap() {
      let selectedMonth = this.selectedMonth;
      let selectedYear = this.selectedYear;
      let gap = 0;
      if (selectedYear > this.currentYear) {
        while (selectedMonth > 1) {
          gap += this.findMonthDays(selectedMonth - 1, selectedYear);
          selectedMonth--;
        }
        selectedYear--;
        while (selectedYear > this.currentYear) {
          gap += this.isLeapYear(selectedYear) ? 366 : 365;
          selectedYear--;
        }
        selectedMonth = 13;
      } else if (selectedYear < this.currentYear) {
        while (selectedMonth < 13) {
          gap += this.findMonthDays(selectedMonth, selectedYear);
          selectedMonth++;
        }
        selectedYear++;
        while (selectedYear < this.currentYear) {
          gap += this.isLeapYear(selectedYear) ? 366 : 365;
          selectedYear++;
        }
        selectedMonth = 1;
      }

      if (selectedMonth > this.currentMonth) {
        while (selectedMonth > this.currentMonth) {
          gap += this.findMonthDays(selectedMonth - 1, selectedYear);
          selectedMonth--;
        }
        gap = this.currentDay + ((1 + gap - this.currentDate) % 7);
      } else if (selectedMonth <= this.currentMonth) {
        while (selectedMonth < this.currentMonth) {
          gap += this.findMonthDays(selectedMonth, selectedYear);
          selectedMonth++;
        }
        gap = this.currentDay - ((this.currentDate + gap - 1) % 7);
      }

      return gap < 0 ? gap + 7 : gap >= 7 ? gap - 7 : gap;
    },
  },
  methods: {
    isLeapYear(year) {
      return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
    },
    findMonthhName(month) {
      return this.months[month];
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
          return 31;
        case 2:
          return this.isLeapYear(year) ? 29 : 28;
        default:
          return 30;
      }
    },
    async logIn() {
      this.$router.push({ name: "LogIn" });
    },
    async logOut() {
      await api.logOut();
      this.username = "";
    },
    prev() {
      if (this.selectedMonth == 1) {
        this.selectedMonth = 12;
        this.selectedYear--;
      } else {
        this.selectedMonth--;
      }
    },
    next() {
      if (this.selectedMonth == 12) {
        this.selectedMonth = 1;
        this.selectedYear++;
      } else {
        this.selectedMonth++;
      }
    },
    openDetail(month, date) {
      this.showDetail = true;
      this.detailMonth = month;
      this.detailDate = date;
    },
    closeDetail() {
      this.showDetail = false;
      this.detailMonth = null;
      this.detailDate = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.schedule {
  display: flex;
  flex-direction: column;

  .arrow {
    border: solid black;
    border-width: 0 3px 3px 0;
    display: inline-block;
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

    .calendar_container {
      width: 100%;
      height: 90vh;
      border: 1px solid black;
      display: flex;
      flex-direction: column;
      transition: width 0.5s;

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
  }
  
  .shrink {
    width: 75%;
  }

  .detail_container {
    position: relative;
    width: 25%;
    border: 1px solid black;

    .close {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 10px;
      width: 16px;
      height: 16px;
      opacity: 0.3;
    }
    .close:hover {
      opacity: 1;
    }
    .close:before,
    .close:after {
      position: absolute;
      left: 7.5px;
      content: "";
      height: 16.5px;
      width: 2px;
      background-color: black;
    }
    .close:before {
      transform: rotate(45deg);
    }
    .close:after {
      transform: rotate(-45deg);
    }
  }
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}
</style>
