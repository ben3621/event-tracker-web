export function Textarea({ name, placeholder, value, onChange, className = "" }) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white ${className}`}
    />
  );
}