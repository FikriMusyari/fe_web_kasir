import { useState } from 'react';

const useForm = (initialState) => {
  const [values, setValues] = useState(initialState);
  
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const reset = () => setValues(initialState);
  
  const handleChange = (name) => (e) => {
    setValue(name, e.target.value);
  };

  const validate = (rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = values[field];
      
      if (rule.required && (!value || value.trim() === '')) {
        errors[field] = rule.message || `${field} is required`;
      }
      
      if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
      }
      
      if (rule.match && value !== values[rule.match]) {
        errors[field] = rule.message || `${field} does not match`;
      }
      
      if (rule.custom && typeof rule.custom === 'function') {
        const customError = rule.custom(value, values);
        if (customError) {
          errors[field] = customError;
        }
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  return { 
    values, 
    setValue, 
    reset, 
    setValues, 
    handleChange,
    validate
  };
};

export default useForm;
