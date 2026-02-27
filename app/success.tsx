import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { withdrawCode, securityCode } = params;
  const wCode = Array.isArray(withdrawCode) ? withdrawCode[0] : withdrawCode;
  const sCode = Array.isArray(securityCode) ? securityCode[0] : securityCode;
  const isWithdrawal = !!wCode;
  const folio = Math.floor(100000 + Math.random() * 900000);
  const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleShare = async () => {
    try {
      let message = `Comprobante NovaBank\nOperación: ${params.type}\nMonto: $${params.amount}\nFolio: ${folio}\nFecha: ${fecha}`;
      
      if (isWithdrawal) {
          message += `\n\nCÓDIGO DE RETIRO: ${wCode}\nSEGURIDAD: ${sCode}`;
      }

      await Share.share({ message });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#2DCCCD" />
        <Text style={styles.successText}>
            {isWithdrawal ? '¡Código Generado!' : '¡Operación Exitosa!'}
        </Text>
        <Text style={styles.dateText}>{fecha}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Importe</Text>
          <Text style={styles.amount}>${Number(params.amount).toLocaleString('es-MX')}</Text>
        </View>
        
        <View style={styles.divider} />

        {isWithdrawal ? (
            // Retiro sin tarjeta
            <View style={styles.withdrawSection}>
                <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>CLAVE DE RETIRO (12 Dígitos)</Text>
                    <Text style={styles.bigCode}>
                        {wCode?.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                    </Text>
                </View>

                <View style={styles.securityRow}>
                    <Text style={styles.label}>Código de Seguridad:</Text>
                    <Text style={styles.securityCode}>{sCode}</Text>
                </View>

                <View style={styles.warningContainer}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.warningText}>Este código expira en 24 horas</Text>
                </View>
            </View>
        ) : (
            <>
                <View style={styles.row}>
                    <Text style={styles.label}>Tipo</Text>
                    <Text style={styles.value}>{params.type}</Text>
                </View>

                {params.receiver ? (
                    <View style={styles.row}>
                        <Text style={styles.label}>Destino</Text>
                        <Text style={styles.value}>{params.receiver}</Text>
                    </View>
                ) : null}
            </>
        )}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Folio</Text>
          <Text style={styles.value}>{folio}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#072146" />
          <Text style={styles.shareText}>Compartir Comprobante</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mainBtn} 
          onPress={() => {
              router.dismissAll();
              router.replace('/dashboard');
          }}
        >
          <Text style={styles.btnText}>VOLVER AL INICIO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f4f6f8', padding: 20, justifyContent: 'center' },
  iconContainer: { alignItems: 'center', marginBottom: 30 },
  successText: { fontSize: 24, fontWeight: 'bold', color: '#072146', marginTop: 10 },
  dateText: { color: '#888', marginTop: 5 },
  
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, shadowOpacity: 0.1, elevation: 3 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { color: '#666', fontSize: 16 },
  value: { color: '#333', fontSize: 16, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 20 },
  amount: { fontSize: 28, fontWeight: 'bold', color: '#072146' },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },

  withdrawSection: { alignItems: 'center', width: '100%', marginBottom: 10 },
  codeBox: {
      backgroundColor: '#f5f7fa',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      borderStyle: 'dashed' 
  },
  codeLabel: { fontSize: 10, color: '#888', fontWeight: 'bold', marginBottom: 5, letterSpacing: 1 },
  bigCode: { 
      fontSize: 26, 
      fontWeight: 'bold', 
      color: '#072146',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
      letterSpacing: 1 
  },
  securityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  securityCode: { fontSize: 18, fontWeight: 'bold', color: '#2DCCCD', marginLeft: 10 },
  warningContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbe6', padding: 8, borderRadius: 5 },
  warningText: { fontSize: 12, color: '#856404', marginLeft: 5 },

  buttonContainer: { marginTop: 40 },
  
  mainBtn: { 
      backgroundColor: '#072146', 
      padding: 18, 
      borderRadius: 10, 
      alignItems: 'center', 
      shadowOpacity: 0.2, 
      elevation: 5 
  },
  btnText: { color: '#2DCCCD', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  
  shareBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, padding: 10 },
  shareText: { color: '#072146', fontWeight: '600', marginLeft: 10, fontSize: 16 }
});