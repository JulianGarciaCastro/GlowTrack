/**
 * QR Code Generator Component
 * Generates QR codes for patient authorizations
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Authorization } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface QRGeneratorProps {
  authorization: Authorization;
  onShare?: () => void;
  onRevoke?: () => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  authorization,
  onShare,
  onRevoke,
}) => {
  const handleShare = async () => {
    try {
      const link = `glowtrack://auth/${authorization.token}`;
      await Share.share({
        message: `Autorización Glow Track\n\nUsa este enlace para registrar tu tratamiento:\n${link}\n\nExpira: ${format(new Date(authorization.expiresAt), "d 'de' MMMM 'a las' HH:mm", { locale: es })}\n\n${authorization.requires2FA ? '⚠️ Requiere verificación 2FA' : ''}`,
        title: 'Compartir autorización',
      });
      onShare?.();
    } catch (error) {
      console.error('Error sharing authorization:', error);
    }
  };

  const getStatusColor = () => {
    switch (authorization.status) {
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

  const getStatusText = () => {
    switch (authorization.status) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Autorización de Acceso</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        <QRCode
          value={authorization.token}
          size={200}
          backgroundColor="white"
          color="black"
        />
      </View>

      {/* Authorization Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tipo:</Text>
          <Text style={styles.detailValue}>
            {authorization.type === 'QR_CODE' ? 'Código QR' : 'Enlace'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expira:</Text>
          <Text style={styles.detailValue}>
            {format(new Date(authorization.expiresAt), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Usos:</Text>
          <Text style={styles.detailValue}>
            {authorization.usedCount} / {authorization.maxUses}
          </Text>
        </View>

        {authorization.requires2FA && (
          <View style={styles.twoFactorNotice}>
            <Text style={styles.twoFactorText}>
              🔒 Requiere verificación de dos factores
            </Text>
          </View>
        )}

        {authorization.twoFactorCode && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Código 2FA:</Text>
            <Text style={styles.codeValue}>{authorization.twoFactorCode}</Text>
          </View>
        )}
      </View>

      {/* Permissions */}
      <View style={styles.permissions}>
        <Text style={styles.permissionsTitle}>Permisos autorizados:</Text>
        {authorization.permissions.canCreateEntry && (
          <Text style={styles.permissionItem}>✓ Crear registros</Text>
        )}
        {authorization.permissions.canViewHistory && (
          <Text style={styles.permissionItem}>✓ Ver historial</Text>
        )}
        {authorization.permissions.canUploadPhotos && (
          <Text style={styles.permissionItem}>✓ Subir fotografías</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {authorization.status === 'ACTIVE' && (
          <>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>📤 Compartir enlace</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.revokeButton} onPress={onRevoke}>
              <Text style={styles.revokeButtonText}>🚫 Revocar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Instrucciones:</Text>
        <Text style={styles.instructionsText}>
          1. Comparte este código QR o enlace con el profesional{'\n'}
          2. El profesional escaneará el código o usará el enlace{'\n'}
          3. {authorization.requires2FA ? 'Proporciona el código 2FA cuando te lo soliciten' : 'La autorización se validará automáticamente'}{'\n'}
          4. El profesional podrá registrar tu tratamiento
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qrContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 20,
  },
  details: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  twoFactorNotice: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  twoFactorText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
  },
  codeContainer: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 12,
    color: '#6366F1',
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4338CA',
    letterSpacing: 4,
  },
  permissions: {
    backgroundColor: '#F0FDF4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  permissionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  permissionItem: {
    fontSize: 14,
    color: '#15803D',
    marginVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  revokeButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  revokeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  instructions: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default QRGenerator;
