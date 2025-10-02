import InterviewerDashboard from '../pages/Interviewer/Dashboard'
import IntervieweeDashboard from '../pages/Interviewee/Dashboard'

export const interviewerRoutes = [
  { path: '/interviewer/dashboard', element: <InterviewerDashboard /> }
]

export const intervieweeRoutes = [
  { path: '/interviewee/dashboard', element: <IntervieweeDashboard /> }
]

export default { interviewerRoutes, intervieweeRoutes }
