import { useState, useMemo } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import MedicineCard from './components/MedicineCard'
import Modal from './components/Modal'
import Chatbot from './components/Chatbot'
import { medicines } from './data/medicines'
import styles from './App.module.css'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [quantities, setQuantities] = useState({}) // { [medicineId]: number }
  const [showModal, setShowModal] = useState(false)

  // Filter medicines based on search query
  const filteredMedicines = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return medicines
    return medicines.filter(
      (med) =>
        med.name.toLowerCase().includes(query) ||
        med.category.toLowerCase().includes(query) ||
        med.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Toggle a medicine selection
  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        // Ensure a default quantity of 1 when first selected
        setQuantities((q) => ({ ...q, [id]: q[id] || 1 }))
      }
      return next
    })
  }

  // Handle quantity change
  const handleQuantityChange = (id, qty) => {
    setQuantities((prev) => ({ ...prev, [id]: qty }))
  }

  // Gather selected medicine objects
  const selectedMedicines = medicines.filter((med) => selectedIds.has(med.id))

  // Handle quotation button
  const handleRequestQuotation = () => {
    if (selectedIds.size === 0) return
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className={styles.app}>
      {/* ── Header ── */}
      <Header />

      {/* ── Main Content ── */}
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/>
                <polyline points="9 11 12 14 22 4"/>
              </svg>
              Quotation System
            </div>
            <h1 className={styles.heroTitle}>Select Medicines</h1>
            <p className={styles.heroSubtitle}>
              Select the medicines you require, set quantities, and request a quotation.
            </p>
          </section>

          {/* Controls Row */}
          <div className={styles.controls}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Selected count */}
            <div className={styles.selectionSummary}>
              <div className={`${styles.countBadge} ${selectedIds.size > 0 ? styles.countBadgeActive : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  {selectedIds.size > 0 && <polyline points="9 12 11 14 15 10"/>}
                </svg>
                <span>
                  Selected Medicines:{' '}
                  <strong>{selectedIds.size}</strong>
                </span>
              </div>

              {selectedIds.size > 0 && (
                <button
                  className={styles.clearAllBtn}
                  onClick={() => setSelectedIds(new Set())}
                  type="button"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Medicine List */}
          <section aria-label="Medicine list" className={styles.listSection}>
            {filteredMedicines.length > 0 ? (
              <ul className={styles.medicineGrid} role="list">
                {filteredMedicines.map((medicine) => (
                  <li key={medicine.id} role="listitem">
                    <MedicineCard
                      medicine={medicine}
                      isSelected={selectedIds.has(medicine.id)}
                      onToggle={handleToggle}
                      quantity={quantities[medicine.id] || 1}
                      onQuantityChange={handleQuantityChange}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="#8A99B5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p className={styles.emptyTitle}>No medicines found</p>
                <p className={styles.emptyText}>
                  Try a different search term.
                </p>
              </div>
            )}
          </section>

          {/* Spacer for sticky button on mobile */}
          <div className={styles.stickySpacing} aria-hidden="true" />
        </div>
      </main>

      {/* ── Sticky Bottom Bar ── */}
      <div className={styles.stickyBar} aria-label="Request quotation bar">
        <div className={styles.stickyBarInner}>
          {selectedIds.size > 0 && (
            <div className={styles.stickyCount}>
              <span className={styles.stickyCountPill}>{selectedIds.size}</span>
              <span className={styles.stickyCountText}>
                {selectedIds.size === 1 ? 'medicine' : 'medicines'} selected
              </span>
            </div>
          )}
          <button
            id="request-quotation-btn"
            className={styles.quotationBtn}
            onClick={handleRequestQuotation}
            disabled={selectedIds.size === 0}
            type="button"
            aria-disabled={selectedIds.size === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Request Quotation
          </button>
        </div>
      </div>

      {/* ── Invoice / Quotation Modal ── */}
      {showModal && (
        <Modal
          selectedMedicines={selectedMedicines}
          quantities={quantities}
          onClose={handleCloseModal}
        />
      )}

      {/* ── Chatbot ── */}
      <Chatbot isModalOpen={showModal} />
    </div>
  )
}
