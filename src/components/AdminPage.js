import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Animated, Pressable
} from 'react-native';
import { db, auth } from '../firebaseConfig';
import { ref, onValue, update, remove } from 'firebase/database';
import { signOut } from 'firebase/auth';

export default function AdminPage({ onNavegar }) {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [sidebarAberta, setSidebarAberta] = useState(false);

  function renderAba() {
    if (abaAtiva === 'dashboard') return <AbaDashboard />;
    if (abaAtiva === 'flags') return <AbaFeatureFlags />;
    if (abaAtiva === 'usuarios') return <AbaUsuarios />;
  }

  return (
    <View style={styles.root}>

      {/* Sidebar overlay (fundo escurecido) */}
      {sidebarAberta && (
        <Pressable style={styles.overlay} onPress={() => setSidebarAberta(false)} />
      )}

      {/* Sidebar */}
      <View style={[styles.sidebar, sidebarAberta && styles.sidebarAberta]}>
        <Text style={styles.sidebarTitulo}>Menu</Text>

        <View style={styles.sidebarLinks}>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => { onNavegar('perfil'); setSidebarAberta(false); }}
          >
            <Text style={styles.sidebarItemTexto}>👤 Seu Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sidebarItem, styles.sidebarItemAtivo]}
            onPress={() => setSidebarAberta(false)}
          >
            <Text style={[styles.sidebarItemTexto, styles.sidebarItemTextoAtivo]}>⚙️ Painel Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sidebarBotaoSair}
          onPress={() => signOut(auth)}
        >
          <Text style={styles.sidebarBotaoSairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.container}>

        {/* Header com hambúrguer */}
        <View style={styles.header}>
          <Text style={styles.titulo}>⚙️ Painel Admin</Text>
          <TouchableOpacity
            style={styles.hamburguer}
            onPress={() => setSidebarAberta(!sidebarAberta)}
          >
            <View style={styles.hamburguerLinha} />
            <View style={styles.hamburguerLinha} />
            <View style={styles.hamburguerLinha} />
          </TouchableOpacity>
        </View>

        {/* Abas */}
        <View style={styles.abas}>
          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'dashboard' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('dashboard')}
          >
            <Text style={[styles.abaTexto, abaAtiva === 'dashboard' && styles.abaTextoAtivo]}>
              📊 Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'flags' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('flags')}
          >
            <Text style={[styles.abaTexto, abaAtiva === 'flags' && styles.abaTextoAtivo]}>
              🚩 Flags
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'usuarios' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('usuarios')}
          >
            <Text style={[styles.abaTexto, abaAtiva === 'usuarios' && styles.abaTextoAtivo]}>
              👥 Usuários
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divisor} />

        {renderAba()}

      </ScrollView>
    </View>
  );
}

// ─── Aba 1: Dashboard ────────────────────────────────────────────────────────

function AbaDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [filmesPorUsuario, setFilmesPorUsuario] = useState({});
  const [totalFilmes, setTotalFilmes] = useState(0);
  const [totalAssistidos, setTotalAssistidos] = useState(0);
  const [totalNaoAssistidos, setTotalNaoAssistidos] = useState(0);

  useEffect(() => {
    const usuariosRef = ref(db, 'usuarios');
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val() || {};
      const lista = Object.entries(data).map(([uid, dados]) => ({ uid, ...dados }));
      setUsuarios(lista);
    });

    const filmesRef = ref(db, 'filmes');
    onValue(filmesRef, (snapshot) => {
      const data = snapshot.val() || {};
      let total = 0;
      let assistidos = 0;
      const contagem = {};

      Object.entries(data).forEach(([uid, filmes]) => {
        const lista = Object.values(filmes);
        contagem[uid] = lista.length;
        total += lista.length;
        assistidos += lista.filter((f) => f.assistido).length;
      });

      setFilmesPorUsuario(contagem);
      setTotalFilmes(total);
      setTotalAssistidos(assistidos);
      setTotalNaoAssistidos(total - assistidos);
    });
  }, []);

  const pctAssistidos = totalFilmes > 0 ? Math.round((totalAssistidos / totalFilmes) * 100) : 0;

  return (
    <View>
      <Text style={styles.subtitulo}>Visão geral da plataforma</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{usuarios.length}</Text>
          <Text style={styles.statLabel}>Usuários</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{totalFilmes}</Text>
          <Text style={styles.statLabel}>Filmes cadastrados</Text>
        </View>
        <View style={[styles.statCard, styles.statCardVerde]}>
          <Text style={styles.statNumero}>{totalAssistidos}</Text>
          <Text style={styles.statLabel}>Assistidos ✅</Text>
        </View>
        <View style={[styles.statCard, styles.statCardVermelho]}>
          <Text style={styles.statNumero}>{totalNaoAssistidos}</Text>
          <Text style={styles.statLabel}>Não assistidos ❌</Text>
        </View>
      </View>

      {totalFilmes > 0 && (
        <View style={styles.progressoContainer}>
          <Text style={styles.progressoLabel}>{pctAssistidos}% dos filmes assistidos</Text>
          <View style={styles.progressoFundo}>
            <View style={[styles.progressoPreenchido, { width: pctAssistidos + '%' }]} />
          </View>
        </View>
      )}

      <Text style={[styles.subtitulo, { marginTop: 20 }]}>Filmes por usuário</Text>
      {usuarios.map((usuario) => {
        const qtd = filmesPorUsuario[usuario.uid] || 0;
        return (
          <View key={usuario.uid} style={styles.card}>
            <View style={styles.usuarioInfo}>
              <Text style={styles.usuarioNome}>{usuario.nome}</Text>
              <Text style={styles.usuarioEmail}>{usuario.email}</Text>
            </View>
            <View style={styles.filmesContador}>
              <Text style={styles.filmesNumero}>{qtd}</Text>
              <Text style={styles.filmesLabel}>{qtd === 1 ? 'filme' : 'filmes'}</Text>
            </View>
          </View>
        );
      })}
      {usuarios.length === 0 && (
        <Text style={styles.vazio}>Nenhum dado encontrado.</Text>
      )}
    </View>
  );
}

// ─── Aba 2: Feature Flags ────────────────────────────────────────────────────

function AbaFeatureFlags() {
  const [flags, setFlags] = useState({});

  useEffect(() => {
    const flagsRef = ref(db, 'featureFlags');
    onValue(flagsRef, (snapshot) => {
      setFlags(snapshot.val() || {});
    });
  }, []);

  function toggleFlag(nome, valorAtual) {
    update(ref(db, 'featureFlags'), { [nome]: !valorAtual });
  }

  return (
    <View>
      <Text style={styles.subtitulo}>Feature Flags ativas</Text>
      {Object.entries(flags).map(([nome, valor]) => (
        <View key={nome} style={styles.card}>
          <Text style={styles.flagNome}>{nome}</Text>
          <Switch
            value={!!valor}
            onValueChange={() => toggleFlag(nome, valor)}
            thumbColor={valor ? '#FAB95B' : '#888'}
            trackColor={{ false: '#444', true: '#7a5c2e' }}
          />
        </View>
      ))}
      {Object.keys(flags).length === 0 && (
        <Text style={styles.vazio}>Nenhuma flag encontrada.</Text>
      )}
    </View>
  );
}

// ─── Aba 3: Gerenciar Usuários ───────────────────────────────────────────────

function AbaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const usuariosRef = ref(db, 'usuarios');
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val() || {};
      const lista = Object.entries(data).map(([uid, dados]) => ({ uid, ...dados }));
      setUsuarios(lista);
    });
  }, []);

  function promoverAdmin(uid) {
    if (window.confirm('Tem certeza que deseja promover este usuário a Admin?')) {
      update(ref(db, 'usuarios/' + uid), { isAdmin: true });
    }
  }

  function revogarAdmin(uid) {
    if (window.confirm('Tem certeza que deseja revogar o acesso Admin deste usuário?')) {
      update(ref(db, 'usuarios/' + uid), { isAdmin: false });
    }
  }

  function excluirUsuario(uid, nome) {
    if (window.confirm(`Tem certeza que deseja excluir "${nome}"? Todos os filmes dele também serão apagados.`)) {
      remove(ref(db, 'usuarios/' + uid));
      remove(ref(db, 'filmes/' + uid));
    }
  }

  const meuUid = auth.currentUser?.uid;

  return (
    <View>
      <Text style={styles.subtitulo}>Usuários cadastrados</Text>
      {usuarios.map((usuario) => (
        <View key={usuario.uid} style={styles.card}>
          <View style={styles.usuarioInfo}>
            <Text style={styles.usuarioNome}>{usuario.nome}</Text>
            <Text style={styles.usuarioEmail}>{usuario.email}</Text>
            {usuario.isAdmin && (
              <Text style={styles.badgeAdmin}>👑 Admin</Text>
            )}
          </View>

          {usuario.uid !== meuUid && (
            <View style={styles.botoesUsuario}>
              {!usuario.isAdmin ? (
                <TouchableOpacity
                  style={styles.botaoPromover}
                  onPress={() => promoverAdmin(usuario.uid)}
                >
                  <Text style={styles.botaoTextoEscuro}>Promover a Admin</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.botaoRevogar}
                  onPress={() => revogarAdmin(usuario.uid)}
                >
                  <Text style={styles.botaoTextoClaro}>Revogar Admin</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => excluirUsuario(usuario.uid, usuario.nome)}
              >
                <Text style={styles.botaoTextoClaro}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      {usuarios.length === 0 && (
        <Text style={styles.vazio}>Nenhum usuário encontrado.</Text>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#222831',
  },

  // Overlay
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },

  // Sidebar
  sidebar: {
    position: 'absolute',
    top: 0,
    right: -260,
    width: 240,
    height: '100%',
    backgroundColor: '#1a1a2e',
    zIndex: 20,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderLeftWidth: 2,
    borderLeftColor: '#FAB95B',
    justifyContent: 'space-between',
    transition: 'right 0.3s',
  },
  sidebarAberta: {
    right: 0,
  },
  sidebarTitulo: {
    color: '#FAB95B',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  sidebarLinks: {
    flex: 1,
    gap: 8,
  },
  sidebarItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  sidebarItemAtivo: {
    backgroundColor: '#FAB95B',
    borderColor: '#FAB95B',
  },
  sidebarItemTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sidebarItemTextoAtivo: {
    color: '#1a1a2e',
  },
  sidebarBotaoSair: {
    backgroundColor: '#c0392b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  sidebarBotaoSairTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FAB95B',
  },

  // Hambúrguer
  hamburguer: {
    padding: 8,
    gap: 5,
    justifyContent: 'center',
  },
  hamburguerLinha: {
    width: 24,
    height: 3,
    backgroundColor: '#FAB95B',
    borderRadius: 2,
  },

  // Container
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  abas: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#2d2d44',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  abaAtiva: {
    backgroundColor: '#FAB95B',
    borderColor: '#FAB95B',
  },
  abaTexto: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 12,
  },
  abaTextoAtivo: {
    color: '#1a1a2e',
  },
  divisor: {
    borderBottomWidth: 2.5,
    borderBottomColor: '#FAB95B',
    marginVertical: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FAB95B',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FAB95B',
    padding: 16,
    alignItems: 'center',
  },
  statCardVerde: {
    borderColor: '#27ae60',
  },
  statCardVermelho: {
    borderColor: '#c0392b',
  },
  statNumero: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FAB95B',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  progressoContainer: {
    marginBottom: 8,
  },
  progressoLabel: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
  },
  progressoFundo: {
    backgroundColor: '#444',
    borderRadius: 4,
    height: 10,
    overflow: 'hidden',
  },
  progressoPreenchido: {
    backgroundColor: '#27ae60',
    height: 10,
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#2d2d44',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FAB95B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flagNome: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  usuarioInfo: {
    flex: 1,
    marginRight: 10,
  },
  usuarioNome: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  usuarioEmail: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  badgeAdmin: {
    color: '#FAB95B',
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  filmesContador: {
    alignItems: 'center',
    minWidth: 50,
  },
  filmesNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FAB95B',
  },
  filmesLabel: {
    color: '#aaa',
    fontSize: 11,
  },
  botoesUsuario: {
    flexDirection: 'column',
    gap: 6,
  },
  botaoPromover: {
    backgroundColor: '#FAB95B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  botaoRevogar: {
    backgroundColor: '#7a5c2e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  botaoExcluir: {
    backgroundColor: '#c0392b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  botaoTextoEscuro: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 12,
  },
  botaoTextoClaro: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  vazio: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
