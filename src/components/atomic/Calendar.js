 import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ko from 'date-fns/locale/ko'
registerLocale('ko', ko)

const Calendar = (props) => {
  const { valueType, date, onChange,  startDate, endDate, selectsStart, selectsEnd, minDate } = props

  return (
    <DatePicker
      selected={date}
      onChange={onChange}
      locale={ko}
      startDate={startDate}
      endDate={endDate}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      minDate={minDate}
      dateFormat={valueType === 'dash' ? 'yyyy-MM-dd' : 'yyyyMMdd'}
    />
  )
}

export default Calendar
