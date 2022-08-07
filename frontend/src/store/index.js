import { defineStore } from 'pinia'
import * as api from '../api'
import { formatDate, formatDatetime } from '../utils'

export const useStore = defineStore('main', {
  state: () => {
    return {
      currentUser: '',
      eventsOfThreeMonths: [], // previous, selected, next
    }
  },
  getters: {
    eventsOfSelectedDay(state) {
      return (year, month, day) => {
        let events = []
        let selected = formatDate(year, month, day)
        if (state.eventsOfThreeMonths.length === 3) {
          for (let event of [
            ...state.eventsOfThreeMonths[0],
            ...state.eventsOfThreeMonths[1],
            ...state.eventsOfThreeMonths[2],
          ]) {
            let start = event.start_datetime.split('T')[0].replaceAll('-', '')
            let end = event.end_datetime.split('T')[0].replaceAll('-', '')
            if (start <= selected && selected <= end) {
              let evt = { ...event, shared_users: [...event.shared_users] }
              evt.start_datetime = formatDatetime(evt.start_datetime)
              evt.end_datetime = formatDatetime(evt.end_datetime)
              if (
                (selected !== end || evt.end_datetime.time !== '00:00') &&
                !events.find((element) => element.id === evt.id)
              )
                events.push(evt)
            }
          }
        }
        return events
      }
    },
  },
  actions: {
    async getUser() {
      const resp = await api.getUser()
      this.currentUser = resp.username
    },
    async getAllEvents(year, month) {
      this.eventsOfThreeMonths = await Promise.all([
        api.getEvents(
          month === 1 ? year - 1 : year,
          month === 1 ? 12 : month - 1
        ),
        api.getEvents(year, month),
        api.getEvents(
          month === 12 ? year + 1 : year,
          month === 12 ? 1 : month + 1
        ),
      ])
    },
    async shiftFirst(year, month) {
      this.eventsOfThreeMonths.shift()
      this.eventsOfThreeMonths.push(await api.getEvents(year, month))
    },
    async shiftLast(year, month) {
      this.eventsOfThreeMonths.pop()
      this.eventsOfThreeMonths.unshift(await api.getEvents(year, month))
    },
  },
})
