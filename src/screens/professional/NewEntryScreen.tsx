/**
 * New Entry Screen for Professionals
 * Form to create a new treatment/intervention/surgery entry
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { EntryType, CreateEntryForm } from '../../types';
import { useAuth } from '../../services/auth';
import { apiClient } from '../../sdk/api';

export const NewEntryScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { user } = useAuth();
  const { authorizationToken } = route.params || {};

  const [formData, setFormData] = useState<Partial<CreateEntryForm>>({
    type: EntryType.TREATMENT,
    title: '',
    description: '',
    scheduledDate: new Date(),
    centerId: '',
    professionalId: user?.id || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.description) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (!authorizationToken) {
      Alert.alert('Error', 'Se requiere una autorización válida del paciente');
      return;
    }

    try {
      setIsSubmitting(true);

      // Set grant ID for this operation
      apiClient.setGrantId(authorizationToken);

      const response = await apiClient.createEntry(formData);

      if (response.success && response.data) {
        Alert.alert('Éxito', 'Entrada registrada correctamente', [
          {
            text: 'OK',
            onPress: () => {
              apiClient.clearGrantId();
              navigation.navigate('EntryDetail', { entryId: (response.data as any).id });
            },
          },
        ]);
      } else {
        throw new Error(response.error?.message || 'Error al crear la entrada');
      }
    } catch (error) {
      console.error('Failed to create entry:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al registrar la entrada');
    } finally {
      setIsSubmitting(false);
      apiClient.clearGrantId();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nueva intervención</Text>
        <Text style={styles.subtitle}>
          Completa la información del tratamiento o intervención realizada
        </Text>
      </View>

      {/* Entry Type */}
      <View style={styles.section}>
        <Text style={styles.label}>Tipo de intervención *</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === EntryType.TREATMENT && styles.typeButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, type: EntryType.TREATMENT })}
          >
            <Text
              style={[
                styles.typeButtonText,
                formData.type === EntryType.TREATMENT && styles.typeButtonTextActive,
              ]}
            >
              💆 Tratamiento
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === EntryType.INTERVENTION && styles.typeButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, type: EntryType.INTERVENTION })}
          >
            <Text
              style={[
                styles.typeButtonText,
                formData.type === EntryType.INTERVENTION && styles.typeButtonTextActive,
              ]}
            >
              💉 Intervención
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === EntryType.SURGERY && styles.typeButtonActive,
            ]}
            onPress={() => setFormData({ ...formData, type: EntryType.SURGERY })}
          >
            <Text
              style={[
                styles.typeButtonText,
                formData.type === EntryType.SURGERY && styles.typeButtonTextActive,
              ]}
            >
              🏥 Cirugía
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={text => setFormData({ ...formData, title: text })}
          placeholder="Ej: Tratamiento con ácido hialurónico"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={text => setFormData({ ...formData, description: text })}
          placeholder="Describe el procedimiento realizado..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Duration */}
      <View style={styles.section}>
        <Text style={styles.label}>Duración (minutos)</Text>
        <TextInput
          style={styles.input}
          value={formData.duration?.toString() || ''}
          onChangeText={text => setFormData({ ...formData, duration: parseInt(text) || 0 })}
          placeholder="60"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.label}>Notas adicionales</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={text => setFormData({ ...formData, notes: text })}
          placeholder="Observaciones, recomendaciones, etc..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.addMedicationButton]}
          onPress={() => navigation.navigate('AddMedication', { entryFormData: formData })}
        >
          <Text style={styles.addButtonText}>+ Agregar medicamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.addDeviceButton]}
          onPress={() => navigation.navigate('AddDevice', { entryFormData: formData })}
        >
          <Text style={styles.addButtonText}>+ Agregar aparatología</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Guardando...' : 'Guardar intervención'}
        </Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  actions: {
    padding: 20,
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addMedicationButton: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  addDeviceButton: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  submitButton: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#6366F1',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spacer: {
    height: 40,
  },
});

export default NewEntryScreen;
