import React, { useState, useMemo, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Table({
 columns,
 data,
 keyField = 'id',
 itemsPerPage = 10,
 onRowClick,
 onVisibleDataChange,
 className = ''
}) {
 const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
 const [currentPage, setCurrentPage] = useState(1);

 // Handle sort
 const handleSort = (key) => {
 let direction = 'asc';
 if (sortConfig.key === key && sortConfig.direction === 'asc') {
 direction = 'desc';
 }
 setSortConfig({ key, direction });
 };

 // Memoize sorted and paginated data
 const processedData = useMemo(() => {
 let sortableItems = [...data];
 if (sortConfig.key !== null) {
 sortableItems.sort((a, b) => {
 let aVal = a[sortConfig.key];
 let bVal = b[sortConfig.key];
 
 // Handle nested keys (e.g. 'user.name') - basic implementation
 if (sortConfig.key && sortConfig.key.includes('.')) {
 const keys = sortConfig.key.split('.');
 aVal = keys.reduce((obj, k) => (obj || {})[k], a);
 bVal = keys.reduce((obj, k) => (obj || {})[k], b);
 }

 // Handle string comparison nicely
 if (typeof aVal === 'string' && typeof bVal === 'string') {
 return sortConfig.direction === 'asc' 
 ? aVal.localeCompare(bVal) 
 : bVal.localeCompare(aVal);
 }

 if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
 if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
 return 0;
 });
 }

 // Pagination
 if (itemsPerPage > 0) {
 const startIndex = (currentPage - 1) * itemsPerPage;
 return sortableItems.slice(startIndex, startIndex + itemsPerPage);
 }
 return sortableItems;
 }, [data, sortConfig, currentPage, itemsPerPage]);

 const totalPages = itemsPerPage > 0 ? Math.ceil(data.length / itemsPerPage) : 1;

 useEffect(() => {
   if (onVisibleDataChange) {
     onVisibleDataChange(processedData);
   }
 }, [processedData, onVisibleDataChange]);

 return (
 <div className={`w-full flex flex-col ${className}`}>
 <div className={`overflow-x-auto bg-white border border-[var(--color-border-subtle)] ${totalPages > 1 ? 'rounded-t-xl border-b-0' : 'rounded-xl'}`}>
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-[var(--color-bg-subtle)] border-b border-[var(--color-border-subtle)]">
 {columns.map((col, index) => (
 <th 
 key={index}
 className={`p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:bg-[var(--color-border-subtle)]/30 transition-colors' : ''} ${col.className || ''}`}
 onClick={() => col.sortable && col.key && handleSort(col.key)}
 >
 <div className="flex items-center gap-1.5">
 {col.label}
 {col.sortable && col.key && (
 <span className="flex flex-col text-[var(--color-text-light)]">
 <ChevronUp size={10} className={sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-[var(--color-primary)]' : ''} />
 <ChevronDown size={10} className={`-mt-[2px] ${sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'text-[var(--color-primary)]' : ''}`} />
 </span>
 )}
 </div>
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--color-border-subtle)]">
 {processedData.length > 0 ? (
 processedData.map((row, rowIndex) => {
 const rowKey = row[keyField] || rowIndex;
 return (
 <tr 
 key={rowKey} 
 className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[var(--color-bg-subtle)]' : 'hover:bg-gray-50/50'}`}
 onClick={() => onRowClick && onRowClick(row)}
 >
 {columns.map((col, colIndex) => {
 let cellValue;
 if (col.render) {
 cellValue = col.render(row);
 } else if (col.key) {
 cellValue = col.key.includes('.') 
 ? col.key.split('.').reduce((o, i) => o?.[i], row) 
 : row[col.key];
 }

 return (
 <td key={colIndex} className={`p-4 align-middle text-sm text-[var(--color-text-main)] ${col.className || ''}`}>
 {cellValue}
 </td>
 );
 })}
 </tr>
 );
 })
 ) : (
 <tr>
 <td colSpan={columns.length} className="p-8 text-center text-[var(--color-text-muted)] text-sm">
 No data available.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination Footer */}
 {totalPages > 1 && (
 <div className="flex items-center justify-between p-4 border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] rounded-b-xl">
 <span className="text-sm text-[var(--color-text-muted)]">
 Showing <span className="font-medium text-[var(--color-text-main)]">{Math.min((currentPage - 1) * itemsPerPage + 1, data.length)}</span> to <span className="font-medium text-[var(--color-text-main)]">{Math.min(currentPage * itemsPerPage, data.length)}</span> of <span className="font-medium text-[var(--color-text-main)]">{data.length}</span> results
 </span>
 <div className="flex gap-2">
 <Button 
 variant="outline" 
 size="sm" 
 disabled={currentPage === 1}
 onClick={() => setCurrentPage(p => p - 1)}
 >
 <ChevronLeft size={16} /> Previous
 </Button>
 <Button 
 variant="outline" 
 size="sm" 
 disabled={currentPage === totalPages}
 onClick={() => setCurrentPage(p => p + 1)}
 >
 Next <ChevronRight size={16} />
 </Button>
 </div>
 </div>
 )}
 </div>
 );
}
