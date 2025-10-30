/**
 * Professional Entries Screen
 * Shows list of entries created/managed by the professional
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Entry, EntryType, EntryStatus } from '../../types';
import { useAuth } from '../../services/auth';
import { apiClient } from '../../sdk/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const EntriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
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
      const response = await apiClient.getProfessionalEntries(user.id);
      
      if (response.success && response.data) {
        setEntries(response.data as Entry[]);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEntryCard = ({ item }: { item: Entry }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => navigation.navigate('EntryDetail', { entryId: item.id })}
    >
      <View style={styles.entryHeader}>
        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
        <View style={styles.entryInfo}>
          <Text style={styles.entryTitle}>{item.title}</Text>
          <Text style={styles.patientName}>Paciente: {item.patientId}</Text>
          <Text style={styles.entryDate}>
            {format(new Date(item.scheduledDate), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      {item.description && (
        <Text style={styles.entryDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {item.center && (
        <Text style={styles.centerName}>
          🏥 {item.center.name}
        </Text>
      )}

      {(item.medications.length > 0 || item.devices.length > 0) && (
        <View style={styles.detailsRow}>
          {item.medications.length > 0 && (
            <Text style={styles.detailsText}>💊 {item.medications.length} medicamento(s)</Text>
          )}
          {item.devices.length > 0 && (
            <Text style={styles.detailsText}>🔬 {item.devices.length} dispositivo(s)</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis intervenciones</Text>
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => navigation.navigate('NewEntry')}
        >
          <Text style={styles.newEntryButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={entries}
        renderItem={renderEntryCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No hay intervenciones registradas</Text>
            <Text style={styles.emptyStateSubtext}>
              Comienza registrando un nuevo tratamiento
            </Text>
          </View>
        }
      />
    </View>
  );
};

const getTypeColor = (type: EntryType) => {
  switch (type) {
    case EntryType.TREATMENT:
      return '#8B5CF6';
    case EntryType.INTERVENTION:
      return '#F59E0B';
    case EntryType.SURGERY:
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const getStatusColor = (status: EntryStatus) => {
  switch (status) {
    case EntryStatus.COMPLETED:
      return '#10B981';
    case EntryStatus.SCHEDULED:
      return '#3B82F6';
    case EntryStatus.IN_PROGRESS:
      return '#F59E0B';
    case EntryStatus.CANCELLED:
      return '#6B7280';
    default:
      return '#9CA3AF';
  }
};

const getStatusText = (status: EntryStatus) => {
  switch (status) {
    case EntryStatus.COMPLETED:
      return 'Completado';
    case EntryStatus.SCHEDULED:
      return 'Programado';
    case EntryStatus.IN_PROGRESS:
      return 'En curso';
    case EntryStatus.CANCELLED:
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  newEntryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  newEntryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    padding: 15,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  typeIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  entryDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
    lineHeight: 20,
  },
  centerName: {
    fontSize: 13,
    color: '#111827',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailsText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default EntriesScreen;
