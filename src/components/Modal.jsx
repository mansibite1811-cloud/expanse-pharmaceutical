import { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

// Generate a quotation number deterministically
function genQuotationNo() {
  const d = new Date()
  return `EXP-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatValidUntil(d = new Date()) {
  const v = new Date(d)
  v.setDate(v.getDate() + 30)
  return formatDate(v)
}

export default function Modal({ selectedMedicines, quantities, onClose }) {
  const quotationNo = useRef(genQuotationNo()).current
  const issueDate = useRef(formatDate()).current
  const validUntil = useRef(formatValidUntil()).current

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const lineItems = selectedMedicines.map((med) => {
    const qty = quantities[med.id] || 1
    const unitPrice = med.price
    const lineTotal = unitPrice * qty
    return { ...med, qty, unitPrice, lineTotal }
  })

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const taxRate = 0.08
  const taxAmount = subtotal * taxRate
  const grandTotal = subtotal + taxAmount

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>

        {/* ── Invoice Header ── */}
        <div className={styles.invoiceHeader}>
          <div className={styles.brandBlock}>
            <div className={styles.brandLogo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div className={styles.brandName}>Expanse Pharmaceutical</div>
              <div className={styles.brandTagline}>Quality Medicine Solutions</div>
            </div>
          </div>
          <div className={styles.invoiceMeta}>
            <div className={styles.invoiceTitle}>QUOTATION</div>
            <div className={styles.invoiceNo}>#{quotationNo}</div>
          </div>
        </div>

        {/* ── Quotation Details Row ── */}
        <div className={styles.detailsRow}>
          <div className={styles.detailBox}>
            <div className={styles.detailLabel}>Issue Date</div>
            <div className={styles.detailValue}>{issueDate}</div>
          </div>
          <div className={styles.detailBox}>
            <div className={styles.detailLabel}>Valid Until</div>
            <div className={styles.detailValue}>{validUntil}</div>
          </div>
          <div className={styles.detailBox}>
            <div className={styles.detailLabel}>Currency</div>
            <div className={styles.detailValue}>USD ($)</div>
          </div>
          <div className={styles.detailBox}>
            <div className={styles.detailLabel}>Status</div>
            <div className={`${styles.detailValue} ${styles.statusBadge}`}>Pending</div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* ── Bill To ── */}
        <div className={styles.billToRow}>
          <div className={styles.billBlock}>
            <div className={styles.billLabel}>Bill To</div>
            <div className={styles.billName}>Valued Customer</div>
            <div className={styles.billSub}>Quotation prepared upon request</div>
          </div>
          <div className={styles.billBlock} style={{ textAlign: 'right' }}>
            <div className={styles.billLabel}>From</div>
            <div className={styles.billName}>Expanse Pharmaceutical</div>
            <div className={styles.billSub}>contact@expansepharma.com</div>
            <div className={styles.billSub}>+1 (800) 555-0192</div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* ── Line Items Table ── */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.thItem}>#</th>
                <th className={styles.thMed}>Medicine / Description</th>
                <th className={styles.thNum}>Unit Price</th>
                <th className={styles.thNum}>Qty</th>
                <th className={styles.thNum}>Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr key={item.id} className={`${styles.tableRow} ${idx % 2 === 0 ? styles.rowEven : styles.rowOdd}`}>
                  <td className={styles.tdIdx}>{idx + 1}</td>
                  <td className={styles.tdMed}>
                    <div className={styles.medName}>{item.name}</div>
                    <div className={styles.medDesc}>{item.description} · {item.unit}</div>
                  </td>
                  <td className={styles.tdNum}>${item.unitPrice.toFixed(2)}</td>
                  <td className={styles.tdNum}>
                    <span className={styles.qtyChip}>{item.qty}</span>
                  </td>
                  <td className={styles.tdTotal}>${item.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Totals ── */}
        <div className={styles.totalsSection}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Subtotal</span>
            <span className={styles.totalValue}>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Tax (8%)</span>
            <span className={styles.totalValue}>${taxAmount.toFixed(2)}</span>
          </div>
          <div className={styles.dividerThin} />
          <div className={`${styles.totalRow} ${styles.grandRow}`}>
            <span className={styles.grandLabel}>
              Total Amount Due
              <span className={styles.currencyTag}>USD</span>
            </span>
            <span className={styles.grandValue}>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Terms ── */}
        <div className={styles.termsBlock}>
          <div className={styles.termsTitle}>Terms & Conditions</div>
          <ul className={styles.termsList}>
            <li>This quotation is valid for 30 days from the date of issue.</li>
            <li>Prices are subject to change without prior notice after validity period.</li>
            <li>Minimum order quantity may apply to selected items.</li>
            <li>Payment terms: Net 30 days from invoice date.</li>
          </ul>
        </div>

        {/* ── Footer Note ── */}
        <div className={styles.footerNote}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Our team will contact you within 24 hours to confirm your order and arrange delivery.</span>
        </div>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <button
            id="modal-print-btn"
            className={styles.printBtn}
            onClick={() => window.print()}
            type="button"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Save PDF
          </button>
          <button
            id="modal-close-btn"
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
          >
            Close Quotation
          </button>
        </div>
      </div>
    </div>
  )
}
