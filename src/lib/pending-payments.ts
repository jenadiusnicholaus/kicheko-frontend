/**
 * Tracks Pay-IT payments that were initiated but not yet confirmed.
 * A record is saved when the mobile-money prompt is pushed so the user
 * can return later and finish the payment; it is removed once the
 * backend confirms the payment (see the stores' fetch*Status actions).
 */

export interface PendingPayment {
  /** Pay-IT payment_id (cs_...) returned by /payments/initiate/. */
  paymentId: string
  /** 'application_fee' | 'comedian_vote' | 'nani_vote' | ... */
  purpose: string
  /** Application id, applicant id, '<battleId>:<contestantId>', etc. */
  referenceId?: string
  /** Display name (applicant/contestant) for resume UI. */
  label?: string
  amount?: number
  phone?: string
  votesCount?: number
  createdAt: number
}

const STORAGE_KEY = 'kicheko_pending_payments'

function readAll(): PendingPayment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list.filter((p) => p && p.paymentId) : []
  } catch {
    return []
  }
}

function writeAll(list: PendingPayment[]): void {
  try {
    if (list.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable — ignore */
  }
}

export function getPendingPayments(): PendingPayment[] {
  return readAll()
}

export function getPendingPayment(paymentId: string): PendingPayment | undefined {
  return readAll().find((p) => p.paymentId === paymentId)
}

export function findPendingPayment(purpose: string, referenceId?: string): PendingPayment | undefined {
  return readAll().find((p) => p.purpose === purpose && (referenceId === undefined || p.referenceId === referenceId))
}

/**
 * Upserts a pending payment. Only one record is kept per
 * purpose + referenceId so re-initiating replaces the stale payment_id.
 */
export function savePendingPayment(payment: Omit<PendingPayment, 'createdAt'>): PendingPayment {
  const record: PendingPayment = { ...payment, createdAt: Date.now() }
  const list = readAll().filter(
    (p) =>
      p.paymentId !== record.paymentId &&
      !(p.purpose === record.purpose && p.referenceId === record.referenceId && record.referenceId !== undefined),
  )
  list.push(record)
  writeAll(list)
  return record
}

export function removePendingPayment(paymentId: string): void {
  const list = readAll()
  const next = list.filter((p) => p.paymentId !== paymentId)
  if (next.length !== list.length) writeAll(next)
}

/** Terminal payment states — once reached the pending record is dropped,
 * so a failed/expired payment can't trap the user in a resume loop. */
const TERMINAL_STATUSES = ['paid', 'failed', 'underpaid', 'expired', 'cancelled']

export function isTerminalPayment(data: { confirmed?: boolean; payment_status?: string } | null): boolean {
  return !!data && (data.confirmed === true || TERMINAL_STATUSES.includes(data.payment_status ?? ''))
}
