import { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

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
  const issueDate   = useRef(formatDate()).current
  const validUntil  = useRef(formatValidUntil()).current

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const lineItems = selectedMedicines.map((med) => {
    const qty       = quantities[med.id] || 1
    const unitPrice = med.price
    const lineTotal = unitPrice * qty
    return { ...med, qty, unitPrice, lineTotal }
  })

  const subtotal   = lineItems.reduce((s, i) => s + i.lineTotal, 0)
  const taxAmount  = subtotal * 0.08
  const grandTotal = subtotal + taxAmount

  return (
    /*
     * BACKDROP — full-screen fixed overlay.
     * Clicking the dark area outside the card closes the modal.
     */
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/*
       * CARD — centred, scrollable, never taller than the viewport.
       * On mobile it fills the screen with 12px breathing room on each side.
       * On desktop it caps at 640px and centres nicely.
       */}
      <div className={styles.card}>

        {/* ── BLUE HEADER (always fully visible, never scrolls away) ── */}
        <div className={styles.header} id="modal-title">

          {/* Row 1 — brand */}
          <div className={styles.brandRow}>
            <div className={styles.brandLogo} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className={styles.brandText}>
              <div className={styles.brandName}>Expanse Pharmaceutical</div>
              <div className={styles.brandTagline}>Quality Medicine Solutions</div>
            </div>
          </div>

          {/* Row 2 — quotation number */}
          <div className={styles.quotRow}>
            <span className={styles.quotLabel}>QUOTATION</span>
            <span className={styles.quotNo}>#{quotationNo}</span>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className={styles.body}>

          {/* Details grid */}
          <div className={styles.detailsGrid}>
            <div className={styles.detailCell}>
              <div className={styles.detailLabel}>Issue Date</div>
              <div className={styles.detailValue}>{issueDate}</div>
            </div>
            <div className={styles.detailCell}>
              <div className={styles.detailLabel}>Valid Until</div>
              <div className={styles.detailValue}>{validUntil}</div>
            </div>
            <div className={styles.detailCell}>
              <div className={styles.detailLabel}>Currency</div>
              <div className={styles.detailValue}>USD ($)</div>
            </div>
            <div className={styles.detailCell}>
              <div className={styles.detailLabel}>Status</div>
              <span className={styles.statusPill}>Pending</span>
            </div>
          </div>

          <div className={styles.rule} />

          {/* Bill to / From */}
          <div className={styles.billRow}>
            <div className={styles.billSide}>
              <div className={styles.billLabel}>Bill To</div>
              <div className={styles.billName}>Valued Customer</div>
              <div className={styles.billSub}>Quotation prepared upon request</div>
            </div>
            <div className={`${styles.billSide} ${styles.billRight}`}>
              <div className={styles.billLabel}>From</div>
              <div className={styles.billName}>Expanse Pharmaceutical</div>
              <div className={styles.billSub}>contact@expansepharma.com</div>
              <div className={styles.billSub}>+1 (800) 555-0192</div>
            </div>
          </div>

          <div className={styles.rule} />

          {/* Line-items — mobile cards, desktop table */}

          {/* ── MOBILE CARDS (< 560px) ── */}
          <div className={styles.itemCards}>
            {lineItems.map((item, idx) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemCardTop}>
                  <span className={styles.itemIdx}>{idx + 1}</span>
                  <div className={styles.itemCardInfo}>
                    <div className={styles.itemCardName}>{item.name}</div>
                    <div className={styles.itemCardDesc}>{item.description}</div>
                  </div>
                </div>
                <div className={styles.itemCardBottom}>
                  <span className={styles.itemCardMeta}>
                    ${item.unitPrice.toFixed(2)} × <strong>{item.qty}</strong>
                  </span>
                  <span className={styles.itemCardTotal}>${item.lineTotal.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP TABLE (≥ 560px) ── */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thIdx}>#</th>
                  <th className={styles.thMed}>Medicine / Description</th>
                  <th className={styles.thRight}>Unit Price</th>
                  <th className={styles.thRight}>Qty</th>
                  <th className={styles.thRight}>Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td className={styles.tdIdx}>{idx + 1}</td>
                    <td className={styles.tdMed}>
                      <div className={styles.tdMedName}>{item.name}</div>
                      <div className={styles.tdMedDesc}>{item.description} · {item.unit}</div>
                    </td>
                    <td className={styles.tdRight}>${item.unitPrice.toFixed(2)}</td>
                    <td className={styles.tdRight}>
                      <span className={styles.qtyChip}>{item.qty}</span>
                    </td>
                    <td className={`${styles.tdRight} ${styles.tdTotal}`}>${item.lineTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Subtotal</span>
              <span className={styles.totalAmt}>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Tax (8%)</span>
              <span className={styles.totalAmt}>${taxAmount.toFixed(2)}</span>
            </div>
            <div className={styles.thinRule} />
            <div className={styles.grandRow}>
              <span className={styles.grandLabel}>
                Total Amount Due
                <span className={styles.currencyTag}>USD</span>
              </span>
              <span className={styles.grandAmt}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Terms */}
          <div className={styles.terms}>
            <div className={styles.termsTitle}>Terms &amp; Conditions</div>
            <ul className={styles.termsList}>
              <li>This quotation is valid for 30 days from the date of issue.</li>
              <li>Prices are subject to change after the validity period.</li>
              <li>Minimum order quantity may apply to selected items.</li>
              <li>Payment terms: Net 30 days from invoice date.</li>
            </ul>
          </div>

          {/* Info note */}
          <div className={styles.infoNote}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true" style={{flexShrink:0, marginTop:1}}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Our team will contact you within 24 hours to confirm and arrange delivery.</span>
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            <button id="modal-print-btn" className={styles.printBtn}
              onClick={() => window.print()} type="button">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Print / Save PDF
            </button>
            <button id="modal-close-btn" className={styles.closeBtn}
              onClick={onClose} type="button">
              Close Quotation
            </button>
          </div>

        </div>{/* /body */}
      </div>{/* /card */}
    </div>
  )
}
