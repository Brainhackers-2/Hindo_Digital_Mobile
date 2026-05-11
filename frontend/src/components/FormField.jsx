// ============================================================
// components/FormField.jsx — Champ de formulaire réutilisable
// Gère input, textarea, select avec affichage des erreurs
// ============================================================

/**
 * Champ de formulaire générique avec label et gestion d'erreur
 * @param {string} label — Libellé du champ
 * @param {string} name — Attribut name de l'input
 * @param {string} type — Type de l'input (text, email, tel, textarea, select)
 * @param {string} value — Valeur actuelle
 * @param {Function} onChange — Gestionnaire de changement
 * @param {string} error — Message d'erreur de validation
 * @param {string} placeholder — Texte indicatif
 * @param {boolean} required — Champ obligatoire
 * @param {Array} options — Options pour le select [{ value, label }]
 */
const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder = '',
  required = false,
  options = [],
}) => {
  // Classes de base communes à tous les champs
  const inputClass = `w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none text-secondary
    ${error
      ? 'border-red-400 focus:border-red-500 bg-red-50'
      : 'border-gray-200 focus:border-primary bg-white'
    }`

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label htmlFor={name} className="text-sm font-medium text-secondary">
        {label} {required && <span className="text-primary">*</span>}
      </label>

      {/* Rendu conditionnel selon le type */}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={5}
          className={`${inputClass} resize-y`}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClass}
        >
          <option value="">-- Sélectionner --</option>
          {options.map(({ value: val, label: lbl }) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClass}
        />
      )}

      {/* Message d'erreur de validation */}
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

export default FormField
