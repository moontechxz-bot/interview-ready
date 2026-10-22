'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white transition-all duration-200 hover:border-gray-300"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-[#1F2937] hover:text-[#F26A21] focus:outline-none focus-visible:bg-orange-50/50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#9CA3AF] transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-[#F26A21]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-[#4B5563] leading-relaxed border-t border-gray-100/80 bg-gray-50/30">
                {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
