import { useEffect, useId, useMemo, useState } from "react";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import phoneLabels from "react-phone-number-input/locale/en.json";
import countryList from "react-select-country-list";

const labelClass = "block text-sm font-semibold text-gray-800";
const selectClass =
  "mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-normal text-gray-900 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/10";
const phoneClass =
  "mt-2 flex min-h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-white font-normal text-gray-900 transition focus-within:border-[#00337C] focus-within:ring-2 focus-within:ring-[#00337C]/10";

const normalizePartialPhone = (input, country) => {
  const raw = String(input || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (raw.startsWith("+")) return `+${digits}`;
  return `+${getCountryCallingCode(country)}${digits.replace(/^0+/, "")}`;
};

export function CountrySelectField({
  id,
  label = "Country",
  value,
  onChange,
  required = false,
  error = "",
  className = "",
}) {
  const generatedId = useId();
  const fieldId = id || `country-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const countries = useMemo(() => countryList().getLabels(), []);

  return (
    <div className={className}>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      <select
        id={fieldId}
        required={required}
        autoComplete="country-name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${selectClass} ${error ? "border-red-400" : ""}`}
      >
        <option value="">Select country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function PhoneNumberField({
  id,
  label = "Phone number",
  value,
  onChange,
  required = false,
  error = "",
  className = "",
  defaultCountry = "SS",
}) {
  const generatedId = useId();
  const fieldId = id || `phone-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [displayValue, setDisplayValue] = useState(value || "");
  const phoneCountries = useMemo(() => getCountries(), []);

  useEffect(() => {
    if (!value) setDisplayValue("");
  }, [value]);

  const changeCountry = (country) => {
    setSelectedCountry(country);
    setDisplayValue("");
    onChange("");
  };

  return (
    <div className={className}>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      <div className={`${phoneClass} ${error ? "border-red-400" : ""}`}>
        <select
          value={selectedCountry}
          onChange={(event) => changeCountry(event.target.value)}
          aria-label={`${label} country calling code`}
          className="w-28 shrink-0 cursor-pointer border-0 border-r border-gray-200 bg-gray-50 px-2 text-sm text-[#00337C] outline-none sm:w-36"
        >
          {phoneCountries.map((country) => (
            <option key={country} value={country}>
              {phoneLabels[country]} (+{getCountryCallingCode(country)})
            </option>
          ))}
        </select>
        <input
          id={fieldId}
          type="tel"
          required={required}
          autoComplete="tel"
          inputMode="tel"
          placeholder="Phone number"
          value={displayValue}
          onChange={(event) => {
            setDisplayValue(event.target.value);
            onChange(normalizePartialPhone(event.target.value, selectedCountry));
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm text-gray-900 outline-none"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
