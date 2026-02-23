/**
 * Custom React Hooks for shared functionality
 */

import { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

/**
 * Hook for managing form state with validation
 */
export const useFormState = (initialState = {}, onSubmit) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts correcting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  const setFieldError = useCallback((fieldName, error) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    reset,
    setValue: (name, value) =>
      setValues((prev) => ({ ...prev, [name]: value })),
  };
};

/**
 * Hook for managing pagination
 */
export const usePagination = (items, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    pageSize,
    startIndex,
    endIndex,
  };
};

/**
 * Hook for managing sorting
 */
export const useSorting = (items, initialSort = { key: 'name', order: 'asc' }) => {
  const [sort, setSort] = useState(initialSort);

  const sortedItems = [...items].sort((a, b) => {
    const aValue = a[sort.key];
    const bValue = b[sort.key];

    if (typeof aValue === 'string') {
      return sort.order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (sort.order === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      order:
        prev.key === key && prev.order === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  return {
    sortedItems,
    sort,
    handleSort,
  };
};

/**
 * Hook for managing filters
 */
export const useFiltering = (items, filterFn = null) => {
  const [activeFilters, setActiveFilters] = useState({});

  const filtered = items.filter((item) => {
    if (filterFn) {
      return filterFn(item, activeFilters);
    }

    return Object.entries(activeFilters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'search') {
        return JSON.stringify(item)
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return item[key] === value;
    });
  });

  const setFilter = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilter = (key) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  return {
    filtered,
    activeFilters,
    setFilter,
    clearFilter,
    clearAllFilters,
  };
};

/**
 * Hook for managing async data with error/loading states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
      setStatus('success');
      return result;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  // Execute on mount if immediate
  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error, reset };
};

/**
 * Hook for managing modal state
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return { isOpen, data, open, close };
};

/**
 * Hook for debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for local storage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};
