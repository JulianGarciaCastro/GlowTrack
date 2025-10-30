/**
 * Month Calendar Component
 * Visual calendar similar to menstrual cycle tracking apps
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarEntry, EntryType, EntryStatus } from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DAY_SIZE = (SCREEN_WIDTH - 40) / 7;

// ============================================================================
// Type Colors & Icons
// ============================================================================

const TYPE_COLORS: Record<EntryType, string> = {
  [EntryType.TREATMENT]: '#8B5CF6', // Purple
  [EntryType.INTERVENTION]: '#F59E0B', // Amber
  [EntryType.SURGERY]: '#EF4444', // Red
};

const STATUS_OPACITY: Record<EntryStatus, number> = {
  [EntryStatus.SCHEDULED]: 0.5,
  [EntryStatus.COMPLETED]: 1,
  [EntryStatus.IN_PROGRESS]: 0.8,
  [EntryStatus.CANCELLED]: 0.3,
};

// ============================================================================
// Component
// ============================================================================

interface MonthCalendarProps {
  entries: CalendarEntry[];
  selectedDate?: Date;
  onDatePress: (date: Date) => void;
  onEntryPress: (entry: CalendarEntry) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  entries,
  selectedDate,
  onDatePress,
  onEntryPress,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get entries for a specific date
  const getEntriesForDate = (date: Date): CalendarEntry[] => {
    return entries.filter(entry => isSameDay(new Date(entry.date), date));
  };

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  // Render day cell
  const renderDay = (date: Date) => {
    const dayEntries = getEntriesForDate(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return (
      <TouchableOpacity
        key={date.toISOString()}
        style={[
          styles.dayCell,
          isSelected && styles.selectedDay,
          isToday && styles.today,
        ]}
        onPress={() => onDatePress(date)}
      >
        <Text
          style={[
            styles.dayNumber,
            !isCurrentMonth && styles.otherMonthDay,
            isToday && styles.todayText,
          ]}
        >
          {format(date, 'd')}
        </Text>

        {/* Entry indicators */}
        {dayEntries.length > 0 && (
          <View style={styles.entryIndicators}>
            {dayEntries.slice(0, 3).map((entry, index) => (
              <View
                key={entry.id}
                style={[
                  styles.entryDot,
                  {
                    backgroundColor: TYPE_COLORS[entry.type],
                    opacity: STATUS_OPACITY[entry.status],
                  },
                ]}
              />
            ))}
            {dayEntries.length > 3 && (
              <Text style={styles.moreIndicator}>+{dayEntries.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render week day headers
  const renderWeekDays = () => {
    const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return (
      <View style={styles.weekDaysRow}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render entries for selected date
  const renderDayEntries = () => {
    if (!selectedDate) return null;

    const dayEntries = getEntriesForDate(selectedDate);

    if (dayEntries.length === 0) {
      return (
        <View style={styles.noEntriesContainer}>
          <Text style={styles.noEntriesText}>
            No hay tratamientos programados para este día
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.entriesListContainer}>
        <Text style={styles.entriesListTitle}>
          {format(selectedDate, "d 'de' MMMM", { locale: es })}
        </Text>
        {dayEntries.map(entry => (
          <TouchableOpacity
            key={entry.id}
            style={[
              styles.entryCard,
              {
                borderLeftColor: TYPE_COLORS[entry.type],
                opacity: STATUS_OPACITY[entry.status],
              },
            ]}
            onPress={() => onEntryPress(entry)}
          >
            <View style={styles.entryCardHeader}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: TYPE_COLORS[entry.type] },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {entry.type === EntryType.TREATMENT && 'Tratamiento'}
                  {entry.type === EntryType.INTERVENTION && 'Intervención'}
                  {entry.type === EntryType.SURGERY && 'Cirugía'}
                </Text>
              </View>
            </View>
            <Text style={styles.entryStatus}>
              {entry.status === EntryStatus.SCHEDULED && '📅 Programado'}
              {entry.status === EntryStatus.COMPLETED && '✅ Completado'}
              {entry.status === EntryStatus.IN_PROGRESS && '🔄 En curso'}
              {entry.status === EntryStatus.CANCELLED && '❌ Cancelado'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToday} style={styles.monthButton}>
          <Text style={styles.monthText}>
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        {renderWeekDays()}
        <View style={styles.daysGrid}>
          {daysInMonth.map(date => renderDay(date))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: TYPE_COLORS[EntryType.TREATMENT] }]} />
          <Text style={styles.legendText}>Tratamiento</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: TYPE_COLORS[EntryType.INTERVENTION] }]} />
          <Text style={styles.legendText}>Intervención</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: TYPE_COLORS[EntryType.SURGERY] }]} />
          <Text style={styles.legendText}>Cirugía</Text>
        </View>
      </View>

      {/* Day Entries */}
      <ScrollView style={styles.entriesScroll}>
        {renderDayEntries()}
      </ScrollView>
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  monthButton: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  calendarContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayCell: {
    width: DAY_SIZE,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 5,
  },
  selectedDay: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  today: {
    backgroundColor: '#FEF3C7',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  otherMonthDay: {
    color: '#D1D5DB',
  },
  todayText: {
    fontWeight: '700',
    color: '#B45309',
  },
  entryIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  entryDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 1,
  },
  moreIndicator: {
    fontSize: 8,
    color: '#6B7280',
    marginLeft: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  entriesScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noEntriesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noEntriesText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  entriesListContainer: {
    paddingVertical: 15,
  },
  entriesListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  entryStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default MonthCalendar;
