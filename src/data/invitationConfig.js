export const invitationConfig = {
  dogImage: '/images/puppy.jpg',
  dogImageAlt: 'A wide-eyed black pug wearing a denim jacket',
  footerNote: 'no pressure, just good company',
  agreementAmount: '₦100,000',
  timeOptions: Array.from({ length: 21 }, (_, index) => {
    const totalMinutes = 12 * 60 + index * 30
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    const hour12 = hour % 12 || 12
    const period = hour < 12 ? 'AM' : 'PM'

    return {
      value: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      label: `${hour12}:${String(minute).padStart(2, '0')} ${period}`,
    }
  }),
}
