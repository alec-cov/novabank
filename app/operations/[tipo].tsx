import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Watermark } from '../../components/Watermark';
import { useBank } from '../../context/BankContext';

interface Account {
  id: string;
  type: string;
  alias: string;
  number: string;
  balance: number;
}

export default function OperacionScreen() {
  const { tipo } = useLocalSearchParams();
  const router = useRouter();
  const { accounts, processTransaction } = useBank();
  const sourceAccounts = useMemo(() => {
    return tipo === 'loans' 
      ? accounts.filter((a: Account) => a.type !== 'Crédito') 
      : accounts;
  }, [accounts, tipo]);

  const targetCreditCard = accounts.find((a: Account) => a.type === 'Crédito');

  const [selectedAccount, setSelectedAccount] = useState(sourceAccounts[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [destinatario, setDestinatario] = useState(''); 
  const [provider, setProvider] = useState(''); 

  useEffect(() => {
    setAmount('');
    setDestinatario('');
    setProvider('');
    if (sourceAccounts.length > 0) {
        setSelectedAccount(sourceAccounts[0].id);
    }
  }, [tipo, sourceAccounts]);

  const getTitle = () => {
    switch(tipo) {
      case 'transfer': return 'Transferencia';
      case 'loans': return 'Pago de Tarjeta';
      case 'services': return 'Pago de Servicios';
      case 'airtime': return 'Recarga Saldo';
      case 'withdraw': return 'Retiro sin Tarjeta';
      default: return 'Operación';
    }
  };

  const getMiniCardColors = (accId: string): [string, string, ...string[]] => {
    const acc = accounts.find((a: Account) => a.id === accId);
    if (acc?.type === 'Crédito') return ['#ebb70f', '#F7D669'];
    return ['#1e3c72', '#2a5298'];
  };

  const handleTransaction = () => {
    const valor = parseFloat(amount.replace(/[^0-9.]/g, '')); 
    
    if (!valor || valor <= 0) {
      Alert.alert("Error", "Ingresa una cantidad válida");
      return;
    }

    if (!destinatario && tipo !== 'withdraw' && tipo !== 'loans') {
        Alert.alert("Error", "Faltan datos del destinatario/referencia");
        return;
    }

    const cuentaOrigen = accounts.find((a: Account) => a.id === selectedAccount);
    
    if (cuentaOrigen && cuentaOrigen.type !== 'Crédito' && cuentaOrigen.balance < valor) {
      Alert.alert("Fondos insuficientes", "No tienes saldo suficiente.");
      return;
    }

    const descripcionFinal = tipo === 'loans' 
        ? `Pago a Tarjeta ${targetCreditCard?.alias || 'Oro'}` 
        : (provider ? `${getTitle()} - ${provider}` : getTitle());

    processTransaction(selectedAccount, valor, descripcionFinal);
    if (tipo === 'loans' && targetCreditCard) {
        processTransaction(targetCreditCard.id, -valor, "Abono / Pago Recibido");
    }

    let withdrawCode = '';
    let securityCode = '';
    if (tipo === 'withdraw') {
        withdrawCode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        securityCode = Math.floor(1000 + Math.random() * 9000).toString();
    }

    router.replace({
      pathname: '/success',
      params: { 
        amount: amount, 
        type: getTitle(),
        receiver: tipo === 'withdraw' 
            ? 'Cajero Automático' 
            : (tipo === 'loans' ? `Tarjeta ${targetCreditCard?.alias}` : (provider ? `${provider} - ${destinatario}` : destinatario || 'Pago Realizado')),
        withdrawCode, 
        securityCode
      }
    });
  };

  const renderDynamicFields = () => {
    switch(tipo) {
      case 'loans':
        const creditLimit = 50000; 
        const available = targetCreditCard?.balance || 0;
        const debt = creditLimit - available; 
        const usedPercentage = Math.min(100, Math.max(0, (debt / creditLimit) * 100));

        return (
            <View style={styles.dynamicSection}>
                <Text style={styles.label}>Tarjeta a Pagar</Text>
                
                <View style={styles.creditStatusCard}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
                        <Ionicons name="card" size={24} color="#ebb70f" style={{marginRight: 10}} />
                        <View>
                            <Text style={{fontWeight: 'bold', color: '#072146', fontSize: 16}}>
                                {targetCreditCard?.alias || 'Tarjeta Oro'}
                            </Text>
                            <Text style={{color: '#666', fontSize: 12}}>
                                •••• {targetCreditCard?.number.slice(-4) || '0000'}
                            </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                        <Text style={{color: '#666', fontSize: 12}}>Crédito Utilizado</Text>
                        <Text style={{color: '#072146', fontWeight: 'bold'}}>{usedPercentage.toFixed(1)}%</Text>
                    </View>
                    
                    <View style={styles.progressBarBg}>
                        <LinearGradient 
                            colors={['#ebb70f', '#F7D669']} 
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={{width: `${usedPercentage}%`, height: '100%', borderRadius: 5}} 
                        />
                    </View>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                        <Text style={styles.creditInfoText}>Deuda Total: ${debt.toLocaleString('es-MX')}</Text>
                        <Text style={styles.creditInfoText}>Límite: ${creditLimit.toLocaleString('es-MX')}</Text>
                    </View>
                </View>

                <Text style={styles.label}>Opciones de Pago</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                    <TouchableOpacity 
                        style={styles.quickPayBtn}
                        onPress={() => {
                            const minPay = debt > 0 ? debt * 0.05 : 0;
                            setAmount(minPay.toFixed(2));
                        }}
                    >
                        <Text style={styles.quickPayLabel}>Pago Mínimo</Text>
                        <Text style={styles.quickPayAmount}>
                            ${(debt * 0.05).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.quickPayBtn}
                        onPress={() => {
                            setAmount(debt.toFixed(2));
                        }}
                    >
                        <Text style={styles.quickPayLabel}>Para no generar intereses</Text>
                        <Text style={styles.quickPayAmount}>
                            ${debt.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );

      case 'airtime':
        return (
          <View style={styles.dynamicSection}>
            <Text style={styles.label}>Selecciona Compañía</Text>
            <View style={styles.providerGrid}>
              {['Telcel', 'Movistar', 'AT&T'].map((p) => (
                <TouchableOpacity 
                  key={p} 
                  style={[styles.providerBtn, provider === p && styles.providerSelected, 
                          p === 'Telcel' && { borderColor: '#002E5D' },
                          p === 'Movistar' && { borderColor: '#5BC500' },
                          p === 'AT&T' && { borderColor: '#009FDB' }
                  ]}
                  onPress={() => setProvider(p)}
                >
                  <Ionicons name="cellular" size={24} color={provider === p ? 'white' : '#555'} />
                  <Text style={[styles.providerText, provider === p && { color: 'white' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Número Celular</Text>
            <TextInput 
              style={styles.input} 
              placeholder="10 dígitos" 
              placeholderTextColor="#ccc"
              keyboardType="number-pad"
              maxLength={10}
              value={destinatario}
              onChangeText={setDestinatario}
            />
          </View>
        );

      case 'services':
        return (
          <View style={styles.dynamicSection}>
             <Text style={styles.label}>Servicio a pagar</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollChips}>
                {['CFE', 'SIAPA', 'Telmex', 'Sky', 'Netflix'].map((serv) => (
                  <TouchableOpacity 
                    key={serv} 
                    style={[styles.chip, provider === serv && styles.chipSelected]}
                    onPress={() => setProvider(serv)}
                  >
                    <Text style={[styles.chipText, provider === serv && { color: 'white' }]}>{serv}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
             <Text style={styles.label}>Referencia</Text>
             <View style={styles.inputWithIcon}>
                <TextInput 
                  style={[styles.input, {flex:1, marginBottom:0, borderWidth:0, backgroundColor: 'transparent'}]} 
                  placeholder="Escribe la referencia o convenio..." 
                  placeholderTextColor="#ccc"
                  value={destinatario}
                  onChangeText={setDestinatario}
                />
                <Ionicons name="qr-code-outline" size={24} color="#072146" style={{marginRight: 10}}/>
             </View>
          </View>
        );

      case 'transfer':
        return (
          <View style={styles.dynamicSection}>
            <Text style={styles.label}>Cuenta Destino</Text>
            <TextInput 
              style={styles.input} 
              placeholder="CLABE (18 dígitos) o Tarjeta" 
              placeholderTextColor="#ccc"
              keyboardType="number-pad"
              maxLength={18}
              value={destinatario}
              onChangeText={setDestinatario}
            />
             <Text style={styles.label}>Banco Destino</Text>
             <TextInput 
               style={styles.input} 
               placeholder="Ej. BBVA, Santander..." 
               placeholderTextColor="#ccc"
               value={provider} 
               onChangeText={setProvider}
             />
          </View>
        );

      case 'withdraw':
        return (
            <View style={styles.dynamicSection}>
                <View style={styles.withdrawInfo}>
                    <Ionicons name="information-circle-outline" size={20} color="#072146" />
                    <Text style={styles.withdrawInfoText}>
                        Código válido por 24 horas en cajeros NovaBank.
                    </Text>
                </View>
                <Text style={styles.label}>Selecciona Monto</Text>
                <View style={styles.cashGrid}>
                    {[100, 200, 500, 1000, 2000, 5000].map((val) => (
                         <TouchableOpacity 
                            key={val}
                            style={[styles.cashBtn, amount === val.toString() && styles.cashBtnSelected]}
                            onPress={() => setAmount(val.toString())}
                        >
                            <Text style={[styles.cashBtnText, amount === val.toString() && {color: 'white'}]}>
                                ${val}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );

      default:
        return null; 
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
    >
      <View style={styles.mainContainer}>
        <Stack.Screen 
            options={{ 
                title: getTitle(), 
                headerBackTitle: '',
                headerStyle: { backgroundColor: '#072146' }, 
                headerTintColor: '#fff',
                headerShadowVisible: false,
            }} 
        />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.blueHeader}>
            <Text style={styles.sectionHeaderWhite}>
                {tipo === 'loans' ? 'Pagar desde (Origen)' : 'Cuenta de retiro'}
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountScroll}>
                {sourceAccounts.map((acc: Account) => {
                  const isSelected = selectedAccount === acc.id;
                  return (
                    <TouchableOpacity 
                        key={acc.id} 
                        activeOpacity={0.8}
                        onPress={() => setSelectedAccount(acc.id)}
                        style={[styles.accountCardWrapper, isSelected && styles.accountCardSelectedWrapper]}
                    >
                        <LinearGradient
                            colors={isSelected ? getMiniCardColors(acc.id) : ['#f0f2f5', '#e1e3e6']}
                            style={styles.accountCardGradient}
                        >
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={[styles.accAlias, isSelected ? {color:'white'} : {color:'#333'}]}>{acc.alias}</Text>
                                {isSelected && <Ionicons name="checkmark-circle" size={16} color="#2DCCCD" />}
                            </View>
                            <Text style={[styles.accBalance, isSelected ? {color:'white'} : {color:'#333'}]}>${acc.balance.toLocaleString('es-MX')}</Text>
                            <Text style={[styles.accNumber, isSelected ? {color:'rgba(255,255,255,0.7)'} : {color:'#888'}]}>• {acc.number.slice(-4)}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>

          <View style={styles.whiteSheet}>
            {renderDynamicFields()}

            <View style={styles.amountSection}>
               <Text style={styles.labelCenter}>
                   {tipo === 'withdraw' ? 'Monto seleccionado' : '¿Cuánto quieres pagar?'}
               </Text>
               <View style={styles.amountContainer}>
                   <Text style={[styles.currencySymbol, !amount && {color:'#ccc'}]}>$</Text>
                   <TextInput 
                     style={styles.amountInput} 
                     placeholder="0.00" 
                     placeholderTextColor="#ccc"
                     keyboardType="numeric"
                     value={amount}
                     onChangeText={setAmount}
                     editable={true} 
                   />
               </View>
            </View>

            <TouchableOpacity 
                style={[styles.btnConfirmar, { marginTop: 40 }]} 
                onPress={handleTransaction}
            >
              <Text style={styles.btnText}>
                  {tipo === 'withdraw' ? 'GENERAR CÓDIGO' : 'CONTINUAR'}
              </Text>
            </TouchableOpacity>
            
            
            <View style={{height: 'auto'}} />
            <Watermark />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#072146' },
  blueHeader: { paddingBottom: 25 },
  sectionHeaderWhite: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginLeft: 20, marginTop: 10, marginBottom: 10, fontWeight: '600' },
  accountScroll: { paddingLeft: 20 },
  accountCardWrapper: { marginRight: 15, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  accountCardSelectedWrapper: { transform: [{scale: 1.05}], shadowOpacity: 0.4, elevation: 6 },
  accountCardGradient: { width: 150, height: 90, padding: 12, borderRadius: 12, justifyContent: 'space-between' },
  accAlias: { fontSize: 13, fontWeight: 'bold' },
  accBalance: { fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  accNumber: { fontSize: 11 },
  whiteSheet: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, padding: 25, flex: 1, minHeight: 450 },
  dynamicSection: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  labelCenter: { fontSize: 14, color: '#666', marginBottom: 10, textAlign: 'center', fontWeight: '500' },
  input: { backgroundColor: '#f5f7fa', padding: 15, borderRadius: 12, fontSize: 16, color: '#072146', marginBottom: 15, borderWidth: 1, borderColor: '#e1e3e6' },
  inputWithIcon: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f7fa', borderRadius: 12, borderWidth: 1, borderColor: '#e1e3e6', marginBottom: 15 },
  
  providerGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  providerBtn: { width: '31%', paddingVertical: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee', alignItems: 'center', backgroundColor: 'white', shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  providerSelected: { backgroundColor: '#072146', borderColor: '#072146' },
  providerText: { marginTop: 8, fontWeight: 'bold', fontSize: 12, color: '#333' },
  
  scrollChips: { flexDirection: 'row', marginBottom: 20 },
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: '#f0f2f5', marginRight: 10, borderWidth: 1, borderColor: 'transparent' },
  chipSelected: { backgroundColor: '#072146', borderColor: '#072146' },
  chipText: { color: '#666', fontWeight: '600' },
  
  amountSection: { alignItems: 'center', marginBottom: 30 },
  amountContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  currencySymbol: { fontSize: 32, color: '#072146', fontWeight: 'bold', marginRight: 5 },
  amountInput: { fontSize: 42, color: '#072146', fontWeight: 'bold', minWidth: 100, textAlign: 'center', padding: 0 },
  btnConfirmar: { backgroundColor: '#072146', padding: 18, borderRadius: 12, alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, marginBottom: 10 },
  btnText: { color: '#2DCCCD', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },

  // Estilos TDC
  creditStatusCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#eee', shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  progressBarBg: { height: 12, backgroundColor: '#f0f0f0', borderRadius: 6, width: '100%', overflow: 'hidden' },
  creditInfoText: { fontSize: 12, color: '#666', fontWeight: '500' },
  quickPayBtn: { width: '48%', backgroundColor: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, alignItems: 'center' },
  quickPayLabel: { fontSize: 10, color: '#888', marginBottom: 5, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  quickPayAmount: { fontSize: 16, fontWeight: 'bold', color: '#072146' },

  // Retiro s/tarjeta
  withdrawInfo: { flexDirection: 'row', backgroundColor: '#e8f4f8', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  withdrawInfoText: { flex: 1, marginLeft: 10, color: '#072146', fontSize: 12 },
  cashGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cashBtn: { width: '31%', aspectRatio: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  cashBtnSelected: { backgroundColor: '#072146', borderColor: '#072146' },
  cashBtnText: { fontSize: 18, fontWeight: 'bold', color: '#333' }
});