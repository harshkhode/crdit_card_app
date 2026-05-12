const BANKS = [
  'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'IDFC First Bank',
  'HSBC Bank', 'SBI Card', 'American Express', 'Citi Bank',
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'annualFee',  label: 'Annual Fee ↑' },
  { value: 'name',       label: 'Name A–Z' },
];

const INCOME_OPTIONS = [
  { value: '',          label: 'Any Income' },
  { value: '600000',    label: 'Up to ₹6 Lakh' },
  { value: '1200000',   label: 'Up to ₹12 Lakh' },
  { value: '2500000',   label: 'Up to ₹25 Lakh' },
  { value: '5000000',   label: 'Up to ₹50 Lakh' },
];

const panelBg = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '1rem',
  padding: '1.25rem',
};
const sectionLabel = {
  display: 'block',
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(240,239,232,0.28)',
  marginBottom: '0.625rem',
};

export default function FilterPanel({ filters, onChange, onReset }) {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div style={panelBg}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: 'rgba(240,239,232,0.75)' }}>
          Filters
        </span>
        <button
          onClick={onReset}
          className="text-xs font-bold uppercase tracking-widest transition-colors"
          style={{ color: 'rgba(201,168,64,0.6)', letterSpacing: '0.1em', fontSize: '0.62rem' }}
          onMouseEnter={(e) => (e.target.style.color = '#c9a840')}
          onMouseLeave={(e) => (e.target.style.color = 'rgba(201,168,64,0.6)')}
        >
          Reset
        </button>
      </div>

      <div className="luxury-divider mb-5" />

      {/* Sort */}
      <div className="mb-5">
        <label style={sectionLabel}>Sort By</label>
        <select
          className="input-field text-xs"
          value={filters.sortBy || 'popularity'}
          onChange={(e) => update('sortBy', e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Bank radio */}
      <div className="mb-5">
        <label style={sectionLabel}>Bank</label>
        <div className="space-y-2">
          {['', ...BANKS].map((b) => (
            <RadioRow
              key={b || '__all'}
              label={b || 'All Banks'}
              checked={filters.bank === b}
              onClick={() => update('bank', b)}
            />
          ))}
        </div>
      </div>

      <div className="luxury-divider mb-5" />

      {/* Annual fee range */}
      <div className="mb-5">
        <label style={sectionLabel}>Annual Fee (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minFee || ''}
            onChange={(e) => update('minFee', e.target.value)}
            className="input-field text-xs"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxFee || ''}
            onChange={(e) => update('maxFee', e.target.value)}
            className="input-field text-xs"
          />
        </div>
      </div>

      {/* Income */}
      <div>
        <label style={sectionLabel}>Income Eligibility</label>
        <select
          className="input-field text-xs"
          value={filters.maxIncome || ''}
          onChange={(e) => update('maxIncome', e.target.value)}
        >
          {INCOME_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function RadioRow({ label, checked, onClick }) {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer" onClick={onClick}>
      <div
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all"
        style={
          checked
            ? { border: '2px solid #c9a840', background: 'rgba(201,168,64,0.12)' }
            : { border: '1px solid rgba(255,255,255,0.15)' }
        }
      >
        {checked && (
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a840' }} />
        )}
      </div>
      <span
        className="text-xs transition-colors leading-tight"
        style={{ color: checked ? 'rgba(240,239,232,0.85)' : 'rgba(240,239,232,0.35)' }}
      >
        {label}
      </span>
    </div>
  );
}
