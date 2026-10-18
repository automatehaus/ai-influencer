const PILLS = {
  pending: ['pend', 'Waiting for reply'],
  accepted: ['ok', 'Accepted · go live'],
  awaiting: ['pend', 'Waiting on their confirm'],
  confirmed: ['v', 'Confirmed'],
  declined: ['no', 'Declined'],
  notyet: ['no', "Didn't happen"],
}

export default function StatusPill({ status }) {
  const [cls, label] = PILLS[status]
  return <span className={`pill ${cls}`}>{label}</span>
}
