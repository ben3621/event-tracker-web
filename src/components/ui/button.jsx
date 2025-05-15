export function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white ${className}`}
    >
      {children}
    </button>
  );
}