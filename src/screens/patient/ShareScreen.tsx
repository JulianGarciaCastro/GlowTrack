/**
 * Patient Share Screen
 * Manages authorizations via QR code or link
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { QRGenerator } from '../../components/QRCode/QRGenerator';
import { Authorization, AuthorizationType, CreateAuthorizationForm } from '../../types';
import { useAuth } from '../../services/auth';
import { apiClient } from '../../sdk/api';

export const ShareScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAuth, setSelectedAuth] = useState<Authorization | null>(null);

  useEffect(() => {
    if (user) {
      loadAuthorizations();
    }
  }, [user]);

  const loadAuthorizations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await apiClient.getAuthorizations(user.id);
      
      if (response.success && response.data) {
        const auths = response.data as Authorization[];
        setAuthorizations(auths);
        
        // Select first active authorization
        const activeAuth = auths.find(a => a.status === 'ACTIVE');
        if (activeAuth) {
          setSelectedAuth(activeAuth);
        }
      }
    } catch (error) {
      console.error('Failed to load authorizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAuthorization = () => {
    navigation.navigate('CreateAuthorization', {
      onSuccess: loadAuthorizations,
    });
  };

  const handleRevokeAuthorization = async () => {
    if (!selectedAuth) return;

    Alert.alert(
      'Revocar autorización',
      '¿Estás seguro de que deseas revocar esta autorización? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Revocar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiClient.revokeAuthorization(selectedAuth.id);
              if (response.success) {
                Alert.alert('Éxito', 'Autorización revocada correctamente');
                loadAuthorizations();
              } else {
                Alert.alert('Error', response.error?.message || 'No se pudo revocar la autorización');
              }
            } catch (error) {
              Alert.alert('Error', 'Ocurrió un error al revocar la autorización');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Compartir acceso</Text>
        <Text style={styles.subtitle}>
          Genera un código QR o enlace para que un profesional pueda registrar tu tratamiento
        </Text>
      </View>

      {/* Create New Authorization Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateAuthorization}
      >
        <Text style={styles.createButtonText}>+ Nueva autorización</Text>
      </TouchableOpacity>

      {/* Current Authorization */}
      {selectedAuth ? (
        <View style={styles.qrSection}>
          <QRGenerator
            authorization={selectedAuth}
            onRevoke={handleRevokeAuthorization}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No hay autorizaciones activas
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Crea una nueva autorización para compartir acceso con un profesional
          </Text>
        </View>
      )}

      {/* Authorizations History */}
      {authorizations.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Historial de autorizaciones</Text>
          {authorizations.map(auth => (
            <TouchableOpacity
              key={auth.id}
              style={[
                styles.authCard,
                selectedAuth?.id === auth.id && styles.authCardSelected,
              ]}
              onPress={() => setSelectedAuth(auth)}
            >
              <View style={styles.authCardHeader}>
                <Text style={styles.authCardTitle}>
                  {auth.type === AuthorizationType.QR_CODE ? '📱 Código QR' : '🔗 Enlace'}
                </Text>
                <View
                  style={[
                    styles.authStatusBadge,
                    { backgroundColor: getStatusColor(auth.status) },
                  ]}
                >
                  <Text style={styles.authStatusText}>{getStatusText(auth.status)}</Text>
                </View>
              </View>
              <Text style={styles.authCardDate}>
                Creado: {new Date(auth.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.authCardUsage}>
                Usos: {auth.usedCount} / {auth.maxUses}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return '#10B981';
    case 'EXPIRED':
      return '#EF4444';
    case 'REVOKED':
      return '#6B7280';
    case 'USED':
      return '#3B82F6';
    default:
      return '#F59E0B';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Activa';
    case 'EXPIRED':
      return 'Expirada';
    case 'REVOKED':
      return 'Revocada';
    case 'USED':
      return 'Usada';
    default:
      return 'Pendiente';
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  createButton: {
    margin: 20,
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qrSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    textAlign: 'center',
  },
  historySection: {
    padding: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  authCardSelected: {
    borderColor: '#6366F1',
  },
  authCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  authStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  authStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  authCardDate: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  authCardUsage: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default ShareScreen;
