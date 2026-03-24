import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { update, ref, onValue, remove } from 'firebase/database';
import FilmeEdit from './FilmeEdit';

export default function FilmeList() {
  const [filmes, setFilmes] = useState([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);

  useEffect(() => {
    const uid = auth.currentUser.uid;
    const filmesRef = ref(db, 'filmes/' + uid);

    onValue(filmesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, valor]) => ({
          id,
          ...valor,
        }));
        setFilmes(lista);
      }
      else {
        setFilmes([])
      }
    });
  }, []);

  function deletarFilme(id, titulo) {
    const uid = auth.currentUser.uid;
    if (window.confirm(`Tem certeza que deseja excluir "${titulo}"?`)) {
      remove(ref(db, 'filmes/' + uid + "/" + id));
    }
  }

  function marcarAssistido(id, assistido) {
    const uid = auth.currentUser.uid;
    update(ref(db, 'filmes/' + uid + "/" + id), {
      assistido: !assistido
    });
  }

  return (
    <View>
      <Text style={styles.subtitulo}>FILMES CADASTRADOS:</Text>
      {filmes.map((filme) => (
        <View key={filme.id} style={[styles.card, filme.assistido && styles.cardMarcado]}>
          
          <Text style={[styles.titulo, filme.assistido && styles.tituloAssistido]}> 🎞️ {filme.titulo} | {filme.ano} </Text>

          <Text style={[styles.diretor, filme.assistido && styles.diretorAssistido]}>🎬 {filme.diretor}</Text>

          {filme.poster ? <Image style={styles.img} source={{uri: filme.poster}} /> : null}

          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botaoEditar} onPress={() => setFilmeSelecionado(filme)}>
              <Text style={styles.botaoTexto}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoExcluir} onPress={() => deletarFilme(filme.id, filme.titulo)}>
              <Text style={styles.botaoTexto}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoMarcarAssistido} onPress={() => marcarAssistido(filme.id, filme.assistido)}>
              <Text style={styles.botaoTexto}>{filme.assistido ? 'Já assisti ✅' : 'Ainda não assisti ❌'}</Text>
            </TouchableOpacity>

          </View>
        </View>
      ))}
      {filmeSelecionado && (
        <FilmeEdit filme={filmeSelecionado} onClose={() => setFilmeSelecionado(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FAB95B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#2d2d44',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FAB95B',
  },
  cardMarcado: {
    backgroundColor: 'hsl(240, 20%, 12%)',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'hsl(35, 94%, 45%)',
  },
  titulo: {
    color: 'hsl(0, 0%, 100%)',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  diretor: {
    color: 'hsl(0, 0%, 75%)',
    fontSize: 14,
    marginBottom: 10,
  },
  tituloAssistido: {
    color: 'hsl(0, 0%, 50%)',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  diretorAssistido: {
    color: 'hsl(0, 0%, 50%)',
    fontSize: 14,
    marginBottom: 10,
  },

  botoes: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoEditar: {
    backgroundColor: '#FAB95B',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  botaoExcluir: {
    backgroundColor: '#c0392b',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  botaoTexto: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 12,
  },

  botaoMarcarAssistido: {
    backgroundColor: '#FAB95B',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,

  },

  img:{
    height: 140,
    width: 100,
    margin: 8
  },
});