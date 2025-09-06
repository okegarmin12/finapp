import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, Switch } from 'react-native';
import { useFinancialStore } from '@/store/useFinancialStore';
import { RecurringItemForm } from '@/components/RecurringItemForm';
import { RecurringItem } from '@/types/financial';
import { formatEUR } from '@/utils/formatUtils';
import { Plus, CreditCard as Edit, Trash2, RotateCcw } from 'lucide-react-native';

type TabType = 'income' | 'expense';

export default function ManageScreen() {
  const { recurringItems, addRecurringItem, updateRecurringItem, deleteRecurringItem, resetToDefault, loadData } = useFinancialStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = recurringItems.filter(item => item.type === activeTab);

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: RecurringItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Posten löschen',
      'Möchten Sie diesen Posten wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Löschen', 
          style: 'destructive',
          onPress: () => deleteRecurringItem(id)
        }
      ]
    );
  };

  const handleSubmitForm = (item: Omit<RecurringItem, 'id'>) => {
    if (editingItem) {
      updateRecurringItem(editingItem.id, item);
    } else {
      addRecurringItem(item);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleResetToDefault = () => {
    Alert.alert(
      'Auf Standard zurücksetzen',
      'Möchten Sie alle Posten auf die Standardwerte zurücksetzen? Ihre eigenen Posten gehen verloren.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Zurücksetzen', 
          style: 'destructive',
          onPress: resetToDefault
        }
      ]
    );
  };

  const handleToggleActive = (id: string, active: boolean) => {
    updateRecurringItem(id, { active });
  };

  const renderItem = ({ item }: { item: RecurringItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            {item.dayOfMonth}. des Monats • {formatEUR(item.amount)}
          </Text>
        </View>
        <Switch
          value={item.active}
          onValueChange={(active) => handleToggleActive(item.id, active)}
        />
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => handleEdit(item)}
        >
          <Edit size={16} color="#2563eb" />
          <Text style={styles.editButtonText}>Bearbeiten</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDelete(item.id)}
        >
          <Trash2 size={16} color="#dc2626" />
          <Text style={styles.deleteButtonText}>Löschen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (showForm) {
    return (
      <RecurringItemForm
        title={editingItem ? 'Posten bearbeiten' : 'Neuer Posten'}
        onSubmit={handleSubmitForm}
        onCancel={() => setShowForm(false)}
        initialData={editingItem || undefined}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Posten verwalten</Text>
        <Text style={styles.headerSubtitle}>
          Wiederkehrende Ein-/Ausgaben
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'expense' && styles.activeTab]}
            onPress={() => setActiveTab('expense')}
          >
            <Text style={[styles.tabText, activeTab === 'expense' && styles.activeTabText]}>
              Ausgaben ({recurringItems.filter(i => i.type === 'expense').length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'income' && styles.activeTab]}
            onPress={() => setActiveTab('income')}
          >
            <Text style={[styles.tabText, activeTab === 'income' && styles.activeTabText]}>
              Einnahmen ({recurringItems.filter(i => i.type === 'income').length})
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Keine {activeTab === 'income' ? 'Einnahmen' : 'Ausgaben'} vorhanden
            </Text>
          }
        />

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
            <Plus size={24} color="#ffffff" />
            <Text style={styles.addButtonText}>Neuer Posten</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleResetToDefault}>
            <RotateCcw size={20} color="#6b7280" />
            <Text style={styles.resetButtonText}>Auf Standard zurücksetzen</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  list: {
    flexGrow: 1,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  itemDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    borderWidth: 1,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    marginTop: 16,
    gap: 12,
  },
  addButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  resetButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});