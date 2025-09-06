import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { InputField } from '@/components/InputField';
import { useFinancialStore } from '@/store/useFinancialStore';
import { parseGermanDecimal, formatInputNumber } from '@/utils/formatUtils';
import { Save } from 'lucide-react-native';

export default function InputsScreen() {
  const { inputs, updateInputs, loadData } = useFinancialStore();
  
  const [kontostand, setKontostand] = useState('');
  const [bargeld, setBargeld] = useState('');
  const [bekomme, setBekomme] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setKontostand(formatInputNumber(inputs.kontostand));
    setBargeld(formatInputNumber(inputs.bargeld));
    setBekomme(formatInputNumber(inputs.bekomme));
  }, [inputs]);

  const handleSave = () => {
    const parsedInputs = {
      kontostand: parseGermanDecimal(kontostand),
      bargeld: parseGermanDecimal(bargeld),
      bekomme: parseGermanDecimal(bekomme),
    };

    updateInputs(parsedInputs);
    Alert.alert('Erfolg', 'Eingaben wurden gespeichert!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eingaben</Text>
        <Text style={styles.headerSubtitle}>
          Aktuelle Beträge eingeben
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verfügbare Mittel</Text>
          <Text style={styles.cardDescription}>
            Diese Beträge werden sofort in die Berechnung einbezogen.
          </Text>

          <InputField
            label="Kontostand"
            value={kontostand}
            onChangeText={setKontostand}
            placeholder="0,00"
            suffix="€"
          />

          <InputField
            label="Bargeld"
            value={bargeld}
            onChangeText={setBargeld}
            placeholder="0,00"
            suffix="€"
          />

          <InputField
            label="Bekomme (einmalig diesen Monat)"
            value={bekomme}
            onChangeText={setBekomme}
            placeholder="0,00"
            suffix="€"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={24} color="#ffffff" />
          <Text style={styles.saveButtonText}>Eingaben speichern</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
});