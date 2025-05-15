
export function Textarea({ name, placeholder, value, onChange, className = "" }) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full mt-4 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 ${className}`}
    />
  );
}
