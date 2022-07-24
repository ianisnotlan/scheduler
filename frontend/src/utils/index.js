export function formatDigits(number, length = 2) {
  return String(number).padStart(length, '0')
}

export function formatDate(year, month, day) {
  return formatDigits(year, 4) + formatDigits(month) + formatDigits(day)
}

export function formatDatetime(datetime) {
  const date = datetime.split('T')[0].split('-')
  const time = datetime.split('T')[1].slice(0, 5)
  return {
    year: Number(date[0]),
    month: Number(date[1]),
    day: Number(date[2]),
    time,
  }
}

export function generateTimeOptions(time, type = 'start') {
  let hour = Number(time.split(':')[0])
  let minute = Number(time.split(':')[1])
  if (type === 'end') {
    minute = minute + 5 === 60 ? 0 : minute + 5
    hour = minute === 0 ? (hour + 1) % 24 : hour
  }
  let timeOptions = []
  for (let i = hour; i < 24; i++) {
    for (let j = minute; j < 60; j = j + 5) {
      let time = formatDigits(i) + ':' + formatDigits(j)
      timeOptions.push(time)
      minute = 0
    }
  }
  return timeOptions
}

export function eventBackgroundColor(index) {
  let h = (index % 15) * (360 / 15)
  return { backgroundColor: `hsl(${h}, 100%, 85%)` }
}
