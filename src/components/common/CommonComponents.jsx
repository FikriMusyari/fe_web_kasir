import { Eye, EyeOff } from 'lucide-react';

// Loading Spinner Component
export const LoadingSpinner = ({ message = "Memuat data..." }) => (
  <div className="p-8 text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
    <p className="mt-2 text-gray-600">{message}</p>
  </div>
);

// Input Field Component
export const InputField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  showPassword, 
  onTogglePassword,
  disabled = false,
  className = ""
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 ring-indigo-500">
      {Icon && <Icon size={18} className="text-gray-400 mr-2" />}
      <input
        type={showPassword ? "text" : type}
        className="bg-transparent outline-none w-full disabled:text-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {type === "password" && onTogglePassword && (
        <button 
          type="button" 
          onClick={onTogglePassword} 
          className="text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  </div>
);

// Button Component
export const Button = ({ 
  type = "button", 
  onClick, 
  disabled = false, 
  variant = "primary", 
  children, 
  className = "",
  size = "md"
}) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white",
    success: "bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white",
    danger: "bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  };

  const sizes = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-medium rounded-lg transition duration-300 flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className} disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

// Tab Button Component
export const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
      active
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <Icon className="inline mr-2" size={16} />
    {children}
  </button>
);


