export function getAppointmentsForDay(state, day) {
  const foundAppointments = [];
  const currentDay = state.days.find(d => d.name === day);
  // Check if days have come in from api
  if (currentDay) {
    currentDay.appointments.forEach(id => foundAppointments.push(state.appointments[id]));
  }
  return foundAppointments;
}

export function getInterviewersForDay(state, day) {
  const foundInterviewers = [];
  const currentDay = state.days.find(d => d.name === day);
  // Check if days have come in from api
  if (currentDay) {
    currentDay.interviewers.forEach(id => foundInterviewers.push(state.interviewers[id]));
  }
  return foundInterviewers;
}

export function getInterview(state, interview) {
  if (interview) {
    return {
      ...interview,
      interviewer: state.interviewers[interview.interviewer]
    }
  }
  return null;
}