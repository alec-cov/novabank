import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Watermark } from '../../components/Watermark';
import { useBank } from '../../context/BankContext';

interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
}

interface Account {
  id: string;
  alias: string;
  number: string;
  balance: number;
  type: string;
  isBlocked?: boolean; 
}

export default function AccountDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter(); 
  
  const { accounts, transactions = [], toggleCardBlock } = useBank();

  const account = accounts.find((a: Account) => a.id === id);
  const myTransactions = transactions.filter((t: Transaction) => t.accountId === id);

  if (!account) return <View style={styles.container}><Text>Cuenta no encontrada</Text></View>;

  const isCredit = account.type === 'Crédito';
  const isBlocked = account.isBlocked || false;

  const handleToggleBlock = () => {
    toggleCardBlock(account.id);
    if (isBlocked) {
        Alert.alert("Tarjeta Desbloqueada", "Tu tarjeta está activa nuevamente.");
    } else {
        Alert.alert("Tarjeta Bloqueada", "Tarjeta bloqueada temporalmente. No podrás realizar compras.");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
            title: account.alias, 
            headerBackTitle: 'Volver', 
            headerStyle: { backgroundColor: '#072146' }, 
            headerTintColor: '#fff',
        }} 
      />

      <View style={styles.header}>
        <Text style={styles.headerLabel}>Saldo Disponible</Text>
        <Text style={styles.headerBalance}>${account.balance.toLocaleString('es-MX')}</Text>
        <Text style={styles.headerNumber}>{account.type} • {account.number.replace('**', '')}</Text>
        
        {isBlocked && (
            <View style={styles.blockedBadge}>
                <Ionicons name="lock-closed" size={12} color="white" />
                <Text style={styles.blockedText}>BLOQUEADA</Text>
            </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
         {isCredit ? (
            <>
                <ActionButton 
                    icon="card-outline" text="Pagar" primary 
                    onPress={() => router.push('/operations/loans')} 
                />
                <ActionButton 
                    icon={isBlocked ? "lock-closed" : "lock-open-outline"} 
                    text={isBlocked ? "Desbloquear" : "Bloquear"} 
                    danger={isBlocked} 
                    onPress={handleToggleBlock}
                />
                <ActionButton icon="ellipsis-horizontal" text="Más" onPress={() => {}} />
            </>
         ) : (
            <>
                <ActionButton 
                    icon="paper-plane-outline" text="Transferir" primary 
                    onPress={() => router.push('/operations/transfer')}
                />
                <ActionButton 
                    icon="cash-outline" text="Retirar" 
                    onPress={() => router.push('/operations/withdraw')}
                />
                <ActionButton icon="ellipsis-horizontal" text="Más" onPress={() => {}} />
            </>
         )}
      </View>

      <Text style={styles.sectionTitle}>ÚLTIMOS MOVIMIENTOS</Text>

      <FlatList
        data={myTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { flexGrow: 1 }]}
        
        ListEmptyComponent={<Text style={styles.empty}>No hay movimientos recientes.</Text>}
        ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end', marginBottom: 'auto' }}        
        ListFooterComponent={<Watermark />}

        renderItem={({ item }) => {
            const isIncome = item.amount > 0;
            return (
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                    <View style={styles.iconCircle}>
                        <Ionicons 
                            name={isIncome ? "arrow-down" : "arrow-up"} 
                            size={18} 
                            color={isIncome ? "#2dcccd" : "#072146"} 
                        />
                    </View>
                    <View>
                        <Text style={styles.rowDesc}>{item.description}</Text>
                        <Text style={styles.rowDate}>{item.date}</Text>
                    </View>
                </View>

                <Text style={[
                  styles.rowAmount, 
                  isIncome ? styles.positive : styles.negative
                ]}>
                  {isIncome ? '+' : ''} ${Math.abs(item.amount).toLocaleString('es-MX')}
                </Text>
              </View>
            );
        }}
      />
    </View>
  );
}

interface ActionButtonProps {
    icon: any;
    text: string;
    primary?: boolean;
    danger?: boolean;
    onPress: () => void;
}

const ActionButton = ({ icon, text, primary = false, danger = false, onPress }: ActionButtonProps) => (
    <TouchableOpacity style={styles.actionBtnContainer} onPress={onPress}>
        <View style={[
            styles.circleBtn, 
            primary && styles.circleBtnPrimary,
            danger && styles.circleBtnDanger 
        ]}>
            <Ionicons 
                name={icon} 
                size={24} 
                color={primary || danger ? "#fff" : "#072146"} 
            />
        </View>
        <Text style={[
            styles.actionBtnText, 
            danger && { color: '#e74c3c' }
        ]}>{text}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { 
    backgroundColor: '#072146', 
    padding: 20, 
    alignItems: 'center', 
    paddingBottom: 40, 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0 
  },
  headerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  headerBalance: { color: 'white', fontSize: 36, fontWeight: 'bold', marginVertical: 5 },
  headerNumber: { color: '#2DCCCD', fontSize: 16, letterSpacing: 1 },
  blockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10
  },
  blockedText: { color: 'white', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: -25, 
    marginBottom: 15,
  },
  actionBtnContainer: { alignItems: 'center', width: 80 },
  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 5,
  },
  circleBtnPrimary: { backgroundColor: '#2dcccd' },
  circleBtnDanger: { backgroundColor: '#e74c3c' },
  actionBtnText: { fontSize: 11, color: '#072146', fontWeight: '600' },
  sectionTitle: { paddingHorizontal: 20, paddingBottom: 10, color: '#666', fontWeight: 'bold', fontSize: 13 },
  list: { paddingHorizontal: 15, paddingBottom: 20 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },
  row: { 
    backgroundColor: 'white', 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    shadowColor: "#000", 
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    elevation: 1 
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f4f6f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowDesc: { fontSize: 15, color: '#333', fontWeight: '600' },
  rowDate: { fontSize: 12, color: '#888', marginTop: 2 },
  rowAmount: { fontSize: 16, fontWeight: 'bold' },
  negative: { color: '#333' }, 
  positive: { color: '#2dcccd' } 
});