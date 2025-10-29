/**
 * QR Code Scanner Component
 * Scans QR codes for professional authorization
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { apiClient } from '../../sdk/api';

interface QRScannerProps {
  onSuccess: (authorizationToken: string) => void;
  onCancel: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onSuccess, onCancel }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || isValidating) return;

    setScanned(true);
    setIsValidating(true);

    try {
      // Validate the authorization token
      const response = await apiClient.validateAuthorization(data);

      if (response.success && response.data) {
        const authorization = response.data as any;

        // Check if 2FA is required
        if (authorization.requires2FA && !authorization.twoFactorVerifiedAt) {
          // Show 2FA input
          Alert.prompt(
            'Verificación 2FA',
            'Ingresa el código de verificación proporcionado por el paciente',
            [
              {
                text: 'Cancelar',
                onPress: () => {
                  setScanned(false);
                  setIsValidating(false);
                },
                style: 'cancel',
              },
              {
                text: 'Verificar',
                onPress: async (twoFactorCode) => {
                  if (!twoFactorCode) {
                    Alert.alert('Error', 'Debes ingresar el código de verificación');
                    setScanned(false);
                    setIsValidating(false);
                    return;
                  }

                  // Validate with 2FA
                  const twoFAResponse = await apiClient.validateAuthorization(data, twoFactorCode);

                  if (twoFAResponse.success) {
                    onSuccess(data);
                  } else {
                    Alert.alert(
                      'Error',
                      twoFAResponse.error?.message || 'Código de verificación inválido'
                    );
                    setScanned(false);
                    setIsValidating(false);
                  }
                },
              },
            ],
            'plain-text'
          );
        } else {
          // No 2FA required, proceed
          onSuccess(data);
        }
      } else {
        Alert.alert('Error', response.error?.message || 'Código QR inválido o expirado');
        setScanned(false);
        setIsValidating(false);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo validar el código QR');
      setScanned(false);
      setIsValidating(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permiso para usar la cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          No tienes permiso para usar la cámara. Por favor habilita el acceso en la configuración.
        </Text>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Escanea el código QR</Text>
          <Text style={styles.subtitle}>
            Escanea el código QR proporcionado por el paciente para acceder a su autorización
          </Text>
        </View>

        <View style={styles.scanAreaContainer}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
        </View>

        <View style={styles.footer}>
          {scanned && (
            <View style={styles.validatingContainer}>
              <Text style={styles.validatingText}>
                {isValidating ? 'Validando...' : 'Código escaneado'}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          {scanned && !isValidating && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanButtonText}>Escanear de nuevo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 20,
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#6366F1',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  footer: {
    padding: 30,
    paddingBottom: 50,
  },
  validatingContainer: {
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  validatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  rescanButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
  },
  rescanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 40,
  },
});

export default QRScanner;
