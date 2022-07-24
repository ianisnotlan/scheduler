import { defineStore } from 'pinia'
import * as api from '../api'
import { formatDate, formatDatetime } from '../utils'

export const useStore = defineStore('main', {
  state: () => {
    return {
      eventsOfSelectedMonth: [],
    }
  },
  getters: {
    eventsOfSelectedDay(state) {
      return (year, month, day) => {
        let events = []
        let selected = formatDate(year, month, day)
        for (let event of state.eventsOfSelectedMonth) {
          let start = event.start_datetime.split('T')[0].replaceAll('-', '')
          let end = event.end_datetime.split('T')[0].replaceAll('-', '')
          if (start <= selected && selected <= end) {
            let evt = { ...event }
            evt.start_datetime = formatDatetime(evt.start_datetime)
            evt.end_datetime = formatDatetime(evt.end_datetime)
            if (selected !== end || evt.end_datetime.time !== '00:00')
              events.push(evt)
          }
        }
        return events
      }
    },
  },
  actions: {
    async getEvents(year, month) {
      this.eventsOfSelectedMonth = await api.getEvents(year, month)
    },
  },
})
