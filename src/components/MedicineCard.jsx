import styles from './MedicineCard.module.css'
import { categoryColors } from '../data/medicines'

export default function MedicineCard({ medicine, isSelected, onToggle, quantity, onQuantityChange }) {
  const colors = categoryColors[medicine.category] || {
    bg: '#F5F5F5', text: '#555', border: '#DDD',
  }

  const handleQuantityClick = (e) => {
    // Prevent the card toggle when clicking quantity controls
    e.stopPropagation()
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    if (!isSelected) onToggle(medicine.id)
    const newVal = Math.max(1, (quantity || 1) - 1)
    onQuantityChange(medicine.id, newVal)
  }

  const handleIncrement = (e) => {
    e.stopPropagation()
    if (!isSelected) onToggle(medicine.id)
    const newVal = (quantity || 1) + 1
    onQuantityChange(medicine.id, newVal)
  }

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 1) {
      onQuantityChange(medicine.id, val)
    }
  }

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={() => onToggle(medicine.id)}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onToggle(medicine.id)
        }
      }}
    >
      {/* Custom Checkbox */}
      <div className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`} aria-hidden="true">
        {isSelected && (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <polyline
              points="2,7 5,10 11,3"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Medicine Info */}
      <div className={styles.info}>
        <div className={styles.topRow}>
          <span className={styles.name}>{medicine.name}</span>
          <span
            className={styles.categoryBadge}
            style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
          >
            {medicine.category}
          </span>
        </div>
        <span className={styles.description}>{medicine.description}</span>
        <span className={styles.price}>${medicine.price.toFixed(2)} / {medicine.unit}</span>
      </div>

      {/* Quantity Control */}
      <div className={styles.quantityControl} onClick={handleQuantityClick}>
        <span className={styles.qtyLabel}>Qty</span>
        <div className={styles.qtyWrapper}>
          <button
            className={styles.qtyBtn}
            onClick={handleDecrement}
            type="button"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            className={styles.qtyInput}
            type="number"
            min="1"
            value={isSelected ? (quantity || 1) : (quantity || 1)}
            onChange={handleInputChange}
            onClick={handleQuantityClick}
            aria-label={`Quantity for ${medicine.name}`}
          />
          <button
            className={styles.qtyBtn}
            onClick={handleIncrement}
            type="button"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Selected Indicator glow */}
      {isSelected && <div className={styles.selectedGlow} aria-hidden="true" />}
    </div>
  )
}
