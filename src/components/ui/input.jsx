
export function Input({ name, type = "text", placeholder, value, onChange, className = "" }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 ${className}`}
    />
  );
}
