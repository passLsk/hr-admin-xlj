import dayjs from 'dayjs'
export const formateDate = function (time) {
  return dayjs(time).format('YYYY-MM-DD')
}
