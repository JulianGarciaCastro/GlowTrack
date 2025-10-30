/**
 * Patient History Screen
 * Shows complete treatment history with filters
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

export const HistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<EntryType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<EntryStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user, filterType, filterStatus]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const params: any = {};
      if (filterType !== 'ALL') params.type = filterType;
      if (filterStatus !== 'ALL') params.status = filterStatus;

      const response = await apiClient.getPatientEntries(user.id, params);
      
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
          <Text style={styles.entryDate}>
            {format(new Date(item.scheduledDate), "d 'de' MMMM, yyyy", { locale: es })}
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

      <View style={styles.entryFooter}>
        <Text style={styles.centerName}>
          🏥 {item.center?.name || 'Centro no especificado'}
        </Text>
        <Text style={styles.professionalName}>
          👨‍⚕️ {item.professional ? `Dr. ${item.professional.lastName}` : 'Profesional no especificado'}
        </Text>
      </View>

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

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {/* Type Filter */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Tipo:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'ALL' && styles.filterButtonActive]}
            onPress={() => setFilterType('ALL')}
          >
            <Text style={[styles.filterButtonText, filterType === 'ALL' && styles.filterButtonTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === EntryType.TREATMENT && styles.filterButtonActive]}
            onPress={() => setFilterType(EntryType.TREATMENT)}
          >
            <Text style={[styles.filterButtonText, filterType === EntryType.TREATMENT && styles.filterButtonTextActive]}>
              Tratamientos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === EntryType.INTERVENTION && styles.filterButtonActive]}
            onPress={() => setFilterType(EntryType.INTERVENTION)}
          >
            <Text style={[styles.filterButtonText, filterType === EntryType.INTERVENTION && styles.filterButtonTextActive]}>
              Intervenciones
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterType === EntryType.SURGERY && styles.filterButtonActive]}
            onPress={() => setFilterType(EntryType.SURGERY)}
          >
            <Text style={[styles.filterButtonText, filterType === EntryType.SURGERY && styles.filterButtonTextActive]}>
              Cirugías
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Filter */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Estado:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'ALL' && styles.filterButtonActive]}
            onPress={() => setFilterStatus('ALL')}
          >
            <Text style={[styles.filterButtonText, filterStatus === 'ALL' && styles.filterButtonTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === EntryStatus.COMPLETED && styles.filterButtonActive]}
            onPress={() => setFilterStatus(EntryStatus.COMPLETED)}
          >
            <Text style={[styles.filterButtonText, filterStatus === EntryStatus.COMPLETED && styles.filterButtonTextActive]}>
              Completados
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === EntryStatus.SCHEDULED && styles.filterButtonActive]}
            onPress={() => setFilterStatus(EntryStatus.SCHEDULED)}
          >
            <Text style={[styles.filterButtonText, filterStatus === EntryStatus.SCHEDULED && styles.filterButtonTextActive]}>
              Programados
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
      {renderFilters()}
      <FlatList
        data={entries}
        renderItem={renderEntryCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No hay registros</Text>
            <Text style={styles.emptyStateSubtext}>
              Tus tratamientos aparecerán aquí
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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterGroup: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
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
    alignItems: 'center',
    marginBottom: 10,
  },
  typeIndicator: {
    width: 4,
    height: 40,
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
  entryDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
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
  entryFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  centerName: {
    fontSize: 13,
    color: '#111827',
    marginBottom: 4,
  },
  professionalName: {
    fontSize: 13,
    color: '#111827',
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
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

export default HistoryScreen;
