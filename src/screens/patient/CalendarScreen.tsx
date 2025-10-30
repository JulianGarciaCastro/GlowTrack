/**
 * Patient Calendar Screen
 * Main screen showing monthly calendar with treatments
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { MonthCalendar } from '../../components/Calendar/MonthCalendar';
import { CalendarEntry, Entry } from '../../types';
import { useAuth } from '../../services/auth';
import { apiClient } from '../../sdk/api';

export const CalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await apiClient.getPatientEntries(user.id);
      
      if (response.success && response.data) {
        const calendarEntries = (response.data as any[]).map((entry: Entry) => ({
          id: entry.id,
          date: entry.scheduledDate,
          type: entry.type,
          status: entry.status,
          title: entry.title,
          color: getColorForType(entry.type),
          icon: getIconForType(entry.type),
        }));
        setEntries(calendarEntries);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'TREATMENT':
        return '#8B5CF6';
      case 'INTERVENTION':
        return '#F59E0B';
      case 'SURGERY':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'TREATMENT':
        return '💆';
      case 'INTERVENTION':
        return '💉';
      case 'SURGERY':
        return '🏥';
      default:
        return '📋';
    }
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEntryPress = (entry: CalendarEntry) => {
    navigation.navigate('EntryDetail', { entryId: entry.id });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MonthCalendar
        entries={entries}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        onEntryPress={handleEntryPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default CalendarScreen;
