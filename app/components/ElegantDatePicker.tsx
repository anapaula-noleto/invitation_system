'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface ElegantDatePickerProps {
  value: string;
  onChange: (date: string, formatted: string) => void;
  minDate?: string;
  placeholder?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function ElegantDatePicker({ value, onChange, minDate, placeholder }: ElegantDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => {
    if (value) {
      const d = new Date(value + 'T12:00:00');
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o calendário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Formata a data para exibição
  const formatDate = useCallback((dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Gera os dias do mês
  const getDaysInMonth = useCallback(() => {
    const { year, month } = displayMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    // Dias vazios antes do primeiro dia
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [displayMonth]);

  // Verifica se um dia está desabilitado
  const isDisabled = useCallback((day: number): boolean => {
    if (!minDate) return false;
    const { year, month } = displayMonth;
    const date = new Date(year, month, day);
    const min = new Date(minDate + 'T00:00:00');
    return date < min;
  }, [displayMonth, minDate]);

  // Verifica se um dia está selecionado
  const isSelected = useCallback((day: number): boolean => {
    if (!value) return false;
    const { year, month } = displayMonth;
    const selectedDate = new Date(value + 'T12:00:00');
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  }, [value, displayMonth]);

  // Verifica se é hoje
  const isToday = useCallback((day: number): boolean => {
    const today = new Date();
    const { year, month } = displayMonth;
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }, [displayMonth]);

  // Seleciona um dia
  const selectDay = (day: number) => {
    if (isDisabled(day)) return;
    
    const { year, month } = displayMonth;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const formatted = formatDate(dateStr);
    onChange(dateStr, formatted);
    setIsOpen(false);
  };

  // Navega entre meses
  const goToPrevMonth = () => {
    setDisplayMonth(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setDisplayMonth(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const days = getDaysInMonth();
  const displayValue = value ? formatDate(value) : '';

  return (
    <div ref={containerRef} className="elegant-datepicker">
      {/* Input que abre o calendário */}
      <div 
        className={`datepicker-input ${isOpen ? 'focused' : ''} ${value ? 'has-value' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <span className={`datepicker-value ${!value ? 'placeholder' : ''}`}>
          {displayValue || placeholder || 'Select a date'}
        </span>
        <span className="datepicker-icon">📅</span>
      </div>

      {/* Dropdown do calendário */}
      {isOpen && (
        <div className="datepicker-dropdown">
          {/* Header com navegação */}
          <div className="datepicker-header">
            <button 
              type="button" 
              className="datepicker-nav" 
              onClick={goToPrevMonth}
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="datepicker-month-year">
              {MONTHS[displayMonth.month]} {displayMonth.year}
            </span>
            <button 
              type="button" 
              className="datepicker-nav" 
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          {/* Dias da semana */}
          <div className="datepicker-weekdays">
            {WEEKDAYS.map(day => (
              <span key={day} className="datepicker-weekday">{day}</span>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="datepicker-days">
            {days.map((day, index) => (
              <div key={index} className="datepicker-day-cell">
                {day !== null && (
                  <button
                    type="button"
                    className={`datepicker-day ${isSelected(day) ? 'selected' : ''} ${isToday(day) ? 'today' : ''} ${isDisabled(day) ? 'disabled' : ''}`}
                    onClick={() => selectDay(day)}
                    disabled={isDisabled(day)}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="datepicker-footer">
            <button 
              type="button" 
              className="datepicker-today-btn"
              onClick={() => {
                const today = new Date();
                setDisplayMonth({ year: today.getFullYear(), month: today.getMonth() });
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
