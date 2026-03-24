import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth, storage } from '../firebaseConfig';
import { ref, push, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function FilmeForm() {
  const [titulo, setTitulo] = useState('');
  const [diretor, setDiretor] = useState('');
  const [ano, setAno] = useState('');
  const [assistido, setAssistido] = useState(false);
  const [poster, setPoster] = useState('');

    ;

  function salvarFilme() {
    const uid = auth.currentUser.uid;
    push(ref(db, 'filmes/' + uid), {
      titulo: titulo,
      diretor: diretor,
      ano: ano,
      assistido: assistido,
      poster: poster
    });
    setTitulo('');
    setDiretor('');
    setAno('');
    setAssistido(false);
    setPoster(url)
  }

  async function carregarPoster() {
    const uid = auth.currentUser.uid;
    const imgInput = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.7
    })

    if (!imgInput.canceled) {
      console.log(imgInput);
      const posterRef = storageRef(storage, 'posters/' + uid + '/' + titulo);
      const imgBlob = await fetch(imgInput.assets[0].uri).then(r => r.blob());

      uploadBytes(posterRef, imgBlob).then(snapshot => {
        console.log('Imagem carregada!');
        getDownloadURL(snapshot.ref).then(url => {
          setPoster(url);
        }); 
      });

      alert('Imagem carregada com sucesso!')
    } else {
      alert('Você não selecionou uma imagem!')
    }

  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Star Wars"
        placeholderTextColor="#888"
        value={titulo}
        onChangeText={setTitulo}
      />
      <Text style={styles.label}>Diretor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: George Lucas"
        placeholderTextColor="#888"
        value={diretor}
        onChangeText={setDiretor}
      />

      <Text style={styles.label}>Ano de Estreia</Text>
      <TextInput
        style={styles.input}
        placeholder='Ex: 1977'
        placeholderTextColor="#888"
        value={ano}
        onChangeText={setAno}

      />

      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botaoSalvar}>
          <Text style={styles.botaoTexto} onPress={carregarPoster}>⬆ Carregar pôster</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarFilme}>
          <Text style={styles.botaoTexto}>🎬 Salvar Filme</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d2d44',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FAB95B',
  },
  label: {
    color: '#FAB95B',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#444',
  },

  botoes: {
    flexDirection: 'row',
    gap: 8
  },

  botaoSalvar: {
    backgroundColor: '#FAB95B',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    width: 150,
  },
  botaoTexto: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 15
  },
});