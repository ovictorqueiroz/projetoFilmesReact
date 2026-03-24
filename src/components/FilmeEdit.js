import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth, storage } from '../firebaseConfig';
import { ref, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function FilmeEdit({ filme, onClose }) {
  const [titulo, setTitulo] = useState(filme.titulo);
  const [diretor, setDiretor] = useState(filme.diretor)
  const [ano, setAno] = useState(filme.ano);
  const [poster, setPoster] = useState(filme.poster);

  function atualizarFilme() {
    const uid = auth.currentUser.uid;
    set(ref(db, 'filmes/' + uid + "/" + filme.id), {
      titulo: titulo,
      diretor: diretor,
      ano: ano,
      poster: poster
    });
    onClose();
  }

  async function atualizaPoster() {
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
          alert('Pôster carregado com sucesso!')
        });
      });

    } else {
      alert('Você não selecionou uma imagem!')
    }

  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitulo}>✏️ Editando: {filme.titulo}</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        placeholderTextColor="#888"
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Diretor</Text>
      <TextInput
        style={styles.input}
        value={diretor}
        placeholderTextColor="#888"
        onChangeText={setDiretor}
      />
      <Text style={styles.label}>Ano</Text>

      <TextInput
        style={styles.input}
        value={ano}
        placeholderTextColor="#888"
        onChangeText={setAno}
      />

      <View style={styles.botoes}>

        <TouchableOpacity style={styles.botaoSalvar} onPress={atualizaPoster}>
          <Text style={styles.botaoTexto}>Carregar Poster</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoSalvar} onPress={atualizarFilme}>
          <Text style={styles.botaoTexto}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
          <Text style={styles.botaoTexto}>Cancelar</Text>
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
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FAB95B',
  },
  subtitulo: {
    color: '#FAB95B',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
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
    gap: 8,
  },
  botaoCancelar: {
    backgroundColor: '#c0392b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  botaoTexto: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botaoSalvar: {
    backgroundColor: '#FAB95B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },

});