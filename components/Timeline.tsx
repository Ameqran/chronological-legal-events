'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, FileText, AlertCircle, CheckCircle, XCircle, Clock, ChevronDown, Filter, Search, Eye } from 'lucide-react';
import { Event, EventIconProps, TimelineEventProps, TypeConfig, TypeConfigs } from '../types';

const events: Event[] = [
  {
    date: '09-abr-2025',
    title: 'Contrato laboral firmado con Cognizant',
    description: 'Firmado contrato indefinido (63.000 €/año) para iniciar trabajo el 28-abr-2025 bajo HQP (Ley 14/2013).',
    files: 'Cognizant contract signed.pdf',
    type: 'success',
    category: 'contrato'
  },
  {
    date: '28–30 abr 2025',
    title: 'Trabajo realizado para Cognizant / configuración de cliente',
    description: 'Trabajó tres días configurando portátiles de cliente (ING). RRHH posteriormente pidió devolverlos.',
    files: '28th April 1st day pickup.pdf, 29th April 2nd day setup.pdf, 30th April 3rd day standby.pdf, returning laptops.pdf, work permit with Cognizant.pdf',
    type: 'info',
    category: 'trabajo'
  },
  // ... other events
];

const EventIcon = ({ type }: EventIconProps) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />;
    case 'error':
      return <XCircle className="w-5 h-5" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

const TimelineEvent = ({ event, isExpanded, onToggle }: TimelineEventProps) => {
  const typeConfig: TypeConfigs = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-500',
      text: 'text-emerald-700',
      dotBg: 'bg-emerald-400'
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      iconBg: 'bg-rose-500',
      text: 'text-rose-700',
      dotBg: 'bg-rose-400'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-500',
      text: 'text-amber-700',
      dotBg: 'bg-amber-400'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-500',
      text: 'text-blue-700',
      dotBg: 'bg-blue-400'
    }
  };

  const config = typeConfig[event.type];

  return (
    <div className="relative pl-8 pb-8 group">
      <div className={`absolute left-0 top-2 w-4 h-4 rounded-full ${config.dotBg} ring-4 ring-white shadow-md`} />
      
      <div 
        className={`${config.bg} ${config.border} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${isExpanded ? 'shadow-xl' : 'shadow-md'}`}
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.iconBg} text-white flex items-center justify-center shadow-lg`}>
            <EventIcon type={event.type} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {event.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="flex-shrink-0 px-3 py-1 text-xs font-semibold text-gray-600 bg-white rounded-full shadow-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {event.date}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
            
            <p className={`text-gray-700 leading-relaxed ${config.text} font-medium`}>
              {event.description}
            </p>
            
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              {event.files !== '—' && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Documentación:</p>
                      <p className="text-gray-600 italic leading-relaxed">{event.files}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Timeline() {
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());
  const [filterType, setFilterType] = useState<'all' | Event['type']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleEvent = (index: number) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedEvents(newExpanded);
  };

  const expandAll = () => {
    setExpandedEvents(new Set(events.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedEvents(new Set());
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesType = filterType === 'all' || event.type === filterType;
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filterType, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: events.length,
      success: events.filter(e => e.type === 'success').length,
      error: events.filter(e => e.type === 'error').length,
      warning: events.filter(e => e.type === 'warning').length,
      info: events.filter(e => e.type === 'info').length
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="inline-block px-4 py-2 bg-white rounded-full shadow-md mb-4">
            <span className="text-sm font-semibold text-indigo-600">Caso Legal</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Cronología de Eventos
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Cognizant Technology Solutions Spain S.L
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500 font-medium">Total Eventos</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 shadow-md border-2 border-emerald-200">
            <div className="text-3xl font-bold text-emerald-700">{stats.success}</div>
            <div className="text-sm text-emerald-600 font-medium">Positivos</div>
          </div>
          <div className="bg-rose-50 rounded-xl p-4 shadow-md border-2 border-rose-200">
            <div className="text-3xl font-bold text-rose-700">{stats.error}</div>
            <div className="text-sm text-rose-600 font-medium">Críticos</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 shadow-md border-2 border-amber-200">
            <div className="text-3xl font-bold text-amber-700">{stats.warning}</div>
            <div className="text-sm text-amber-600 font-medium">Advertencias</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-md border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-700">{stats.info}</div>
            <div className="text-sm text-blue-600 font-medium">Informativos</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | Event['type'])}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white font-medium"
              >
                <option value="all">Todos</option>
                <option value="success">Positivos</option>
                <option value="error">Críticos</option>
                <option value="warning">Advertencias</option>
                <option value="info">Informativos</option>
              </select>
              
              <button
                onClick={expandAll}
                className="px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Expandir
              </button>
              
              <button
                onClick={collapseAll}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium shadow-md hover:shadow-lg"
              >
                Colapsar
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {filteredEvents.map((event, index) => (
            <TimelineEvent
              key={index}
              event={event}
              isExpanded={expandedEvents.has(index)}
              onToggle={() => toggleEvent(index)}
            />
          ))}
        </div>

        <footer className="mt-8 text-center">
          <div className="inline-block bg-white rounded-xl shadow-md px-6 py-3 border border-gray-100">
            <p className="text-sm text-gray-600">
              Última actualización: <span className="font-semibold text-gray-900">16 de octubre de 2025</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Timeline;