export function getAppointmentsForDay(state, day) {
  const foundAppointments = [];
  const currentDay = state.days.find(d => d.name === day);
  if (currentDay) {
    currentDay.appointments.forEach(id => foundAppointments.push(state.appointments[id]));
  }
  return foundAppointments;
}