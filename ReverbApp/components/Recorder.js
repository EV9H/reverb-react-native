
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Button } from 'react-native';
import React,{ useState } from 'react';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';

export default function Recorder(){
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [message, setMessage] = React.useState("");
    const actx = new AudioContext()

    
    async function startRecording() {
        try {
            console.log('Requesting permissions..');    
            const permission = await Audio.requestPermissionsAsync();
            
            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });
                
                console.log('Starting recording..');
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );

                setRecording(recording);
            } else {
                setMessage("Please grant permission to app to access microphone");
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
      }
    
    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
              allowsRecordingIOS: false,
            }
        );
        
        let updatedRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        // console.log("STAT:", status)
        // console.log("STAT:", sound)
        updatedRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        setRecordings(updatedRecordings);
    }
    
    function getDurationFormatted(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        console.log(minutes, seconds)
        return `${minutesDisplay}:${secondsDisplay}`;
    }
    
    function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
          return (
            <View key={index} style={styles.row}>
                
              <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
              <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
              <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"></Button>
            </View>
          );
        });
    }

      
    return (
        <View style={styles.container}>
            <Text>{message}</Text>
            <Button
            title={recording ? 'Stop Recording' : 'Start Recording'}
            onPress={recording ? stopRecording : startRecording} />
            {getRecordingLines()}
            <StatusBar style="auto" />
        </View>
        );
    
  }



const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fill: {
        margin: 16
    },
    button: {
        margin: 16
    }
});
