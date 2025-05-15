export function Card({ children, className = "" }) {
  return <div className={`rounded-lg shadow-md bg-white dark:bg-gray-800 p-6 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`${className}`}>{children}</div>;
}