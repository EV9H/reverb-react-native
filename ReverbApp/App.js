import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Recorder from './components/Recorder';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style = {{backgroundColor:'black', color:'white', margin:'16px', padding:'5vw', fontSize:'80px'}}>R E V E R B</Text>
      <StatusBar style="auto" />
      <View>
        <Recorder></Recorder>
    
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
