import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
 value, 
 onChange, 
 options, 
 placeholder = "Select...", 
 className = "", 
 disabled = false 
}) {
 const [isOpen, setIsOpen] = useState(false);
 const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
 const dropdownRef = useRef(null);
 const menuRef = useRef(null);

 useEffect(() => {
 function handleClickOutside(event) {
 const clickedOutsideButton = dropdownRef.current && !dropdownRef.current.contains(event.target);
 const clickedOutsideMenu = menuRef.current && !menuRef.current.contains(event.target);
 
 if (clickedOutsideButton && clickedOutsideMenu) {
 setIsOpen(false);
 }
 }
 
 function handleScroll(event) {
 // Don't close if scrolling inside the menu itself
 if (menuRef.current && menuRef.current.contains(event.target)) return;
 setIsOpen(false);
 }
 
 document.addEventListener("mousedown", handleClickOutside);
 // Use capture phase for scroll to catch scroll events on any element
 document.addEventListener("scroll", handleScroll, true);
 
 return () => {
 document.removeEventListener("mousedown", handleClickOutside);
 document.removeEventListener("scroll", handleScroll, true);
 };
 }, []);

 const handleSelect = (optionValue) => {
 if (disabled) return;
 
 // Create a mock event object to be compatible with standard onChange handlers
 const mockEvent = {
 target: { value: optionValue }
 };
 
 onChange(mockEvent);
 setIsOpen(false);
 };

 const handleOpen = () => {
 if (disabled) return;
 if (!isOpen && dropdownRef.current) {
 const rect = dropdownRef.current.getBoundingClientRect();
 setCoords({
 left: rect.left,
 top: rect.bottom + window.scrollY,
 width: rect.width
 });
 }
 setIsOpen(!isOpen);
 };

 const selectedOption = options.find(opt => String(opt.value) === String(value));
 const widthClasses = className.split(' ').filter(c => c.startsWith('w-') || c.startsWith('sm:w-') || c.startsWith('md:w-') || c.startsWith('lg:w-') || c.startsWith('max-w-')).join(' ');
 const wrapperClasses = `relative inline-block text-left ${widthClasses || 'w-full sm:w-auto'}`;

 return (
 <div className={wrapperClasses} ref={dropdownRef}>
 <button
 type="button"
 disabled={disabled}
 onClick={handleOpen}
 className={`w-full bg-white text-[var(--color-text-main)] border ${isOpen ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-[var(--color-border-subtle)]'} rounded-xl px-4 py-2.5 text-sm font-medium flex items-center justify-between gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
 >
 <div className="truncate flex-1 text-left">
 {selectedOption ? (selectedOption.displayLabel || selectedOption.label) : placeholder}
 </div>
 <ChevronDown size={14} className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
 </button>

 {isOpen && !disabled && typeof document !== 'undefined' && createPortal(
 <div 
 ref={menuRef}
 className="absolute z-[9999] mt-1 min-w-[160px] max-h-60 overflow-y-auto bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-xl py-1.5 custom-scrollbar origin-top animate-in fade-in zoom-in-95 duration-200"
 style={{
 top: coords.top,
 left: coords.left,
 width: Math.max(160, coords.width)
 }}
 >
 {options.length === 0 ? (
 <div className="px-4 py-2 text-sm text-[var(--color-text-muted)] text-center">No options</div>
 ) : (
 options.map((option) => (
 <div
 key={option.value}
 onClick={() => handleSelect(option.value)}
 className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors font-medium ${
 String(option.value) === String(value)
 ? 'bg-[#EFF6FF] text-[#3B82F6]'
 : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-subtle)]'
 }`}
 >
 <div className="truncate flex-1">{option.label}</div>
 {String(option.value) === String(value) && (
 <Check size={14} className="text-[#3B82F6] shrink-0 ml-2" />
 )}
 </div>
 ))
 )}
 </div>,
 document.body
 )}
 </div>
 );
}
