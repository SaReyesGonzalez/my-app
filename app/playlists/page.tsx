"use client";
import { useState, useEffect } from "react";
import { PlaylistService, ContentService } from "../../services/contentService";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { Contenido } from "../../types/content";
import ContentCard from "../../components/ui/ContentCard";
import { useSession, signIn } from "next-auth/react";

export default function PlaylistsPage() {
  const { data: session } = useSession();
  const usuarioId = session?.user?.id || "demo";
  const [playlists, setPlaylists] = useState(PlaylistService.getPlaylistsByUser(usuarioId));
  const [nombre, setNombre] = useState("");
  const { playPlaylist } = useAudioPlayer();
  const [contenido, setContenido] = useState<Contenido[]>([]);
  const [showAgregar, setShowAgregar] = useState<{[playlistId: string]: boolean}>({});
  const [agregando, setAgregando] = useState<string | null>(null);

  useEffect(() => {
    ContentService.obtenerContenido().then(setContenido);
  }, []);

  useEffect(() => {
    setPlaylists(PlaylistService.getPlaylistsByUser(usuarioId));
  }, [usuarioId]);

  const handleCrear = () => {
    if (!session) {
      alert("Debes iniciar sesión para crear playlists");
      signIn();
      return;
    }
    if (!nombre.trim()) return;
    PlaylistService.createPlaylist(nombre, usuarioId);
    setPlaylists([...PlaylistService.getPlaylistsByUser(usuarioId)]);
    setNombre("");
  };

  const handleEliminar = (id: string) => {
    if (!session) {
      alert("Debes iniciar sesión para eliminar playlists");
      signIn();
      return;
    }
    PlaylistService.deletePlaylist(id);
    setPlaylists([...PlaylistService.getPlaylistsByUser(usuarioId)]);
  };

  const handleReproducir = (playlistId: string) => {
    const pl = PlaylistService.getPlaylistById(playlistId);
    if (!pl) return;
    const canciones = pl.canciones
      .map(id => contenido.find((c: Contenido) => c.id === id))
      .filter((c): c is Contenido => Boolean(c && (c.urlAudio || c.youtubeId)));
    if (canciones.length > 0) {
      playPlaylist(canciones);
    } else {
      alert("Esta playlist no tiene canciones reproducibles (mp3 o YouTube).");
    }
  };

  const handleToggleAgregar = (playlistId: string) => {
    setShowAgregar(prev => ({ ...prev, [playlistId]: !prev[playlistId] }));
  };

  const handleAgregarCancion = (playlistId: string, cancionId: string) => {
    setAgregando(playlistId + cancionId);
    PlaylistService.addSongToPlaylist(playlistId, cancionId);
    setPlaylists([...PlaylistService.getPlaylistsByUser(usuarioId)]);
    setAgregando(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-2 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-purple-700 flex items-center gap-2">
        <span>📂</span> Tus Playlists
      </h1>
      {!session ? (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-center shadow">
          <span className="font-semibold">Debes iniciar sesión</span> para crear, guardar o eliminar playlists.<br/>
          <span className="text-sm text-gray-500">Inicia sesión para gestionar tus playlists personales.</span>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-8">
            <input
              className="border-2 border-purple-200 rounded px-3 py-2 flex-1 focus:outline-none focus:border-purple-400 text-lg shadow-sm"
              placeholder="Nombre de la nueva playlist"
              value={nombre ?? ""}
              onChange={e => setNombre(e.target.value)}
              disabled={!session}
            />
            <button onClick={handleCrear} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-indigo-600 transition disabled:opacity-50" disabled={!session}>Crear</button>
          </div>
          {playlists.length === 0 && <p className="text-center text-gray-500">No tienes playlists aún. ¡Crea la primera!</p>}
          <div className="space-y-8">
            {playlists.map(pl => {
              const cancionesPlaylist = pl.canciones.map(cid => contenido.find((c: Contenido) => c.id === cid)).filter(Boolean) as Contenido[];
              const cancionesNoIncluidas = contenido.filter(c => !pl.canciones.includes(c.id));
              return (
                <div key={pl.id} className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎶</span>
                      <h2 className="font-bold text-xl text-purple-800">{pl.nombre}</h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleReproducir(pl.id)} className="bg-purple-500 text-white px-4 py-1 rounded-lg font-medium shadow hover:bg-purple-600 transition flex items-center gap-1"><span>▶️</span> Reproducir</button>
                      <button onClick={() => handleEliminar(pl.id)} className="text-red-500 hover:underline font-medium" disabled={!session}><span>🗑️</span> Eliminar</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                    {cancionesPlaylist.length === 0 && <span className="text-sm text-gray-400 col-span-2 italic">Playlist vacía. ¡Agrega canciones!</span>}
                    {cancionesPlaylist.map(c => (
                      <div key={c.id} className="relative group">
                        <ContentCard contenido={c} showFavoriteButton={false} />
                        <button
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100 transition hover:bg-red-600 shadow"
                          title="Quitar de la playlist"
                          onClick={() => {
                            PlaylistService.removeSongFromPlaylist(pl.id, c.id);
                            setPlaylists([...PlaylistService.getPlaylistsByUser(usuarioId)]);
                          }}
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className={`mt-2 mb-2 px-4 py-1 rounded-lg font-medium text-sm transition ${showAgregar[pl.id] ? 'bg-purple-200 text-purple-800' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                    onClick={() => handleToggleAgregar(pl.id)}
                  >
                    {showAgregar[pl.id] ? "Ocultar agregar canciones" : "➕ Agregar canciones"}
                  </button>
                  {showAgregar[pl.id] && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-2 shadow-inner">
                      {cancionesNoIncluidas.length === 0 ? (
                        <span className="text-sm text-gray-400">No hay más canciones para agregar.</span>
                      ) : (
                        <ul className="space-y-2">
                          {cancionesNoIncluidas.map(c => (
                            <li key={c.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm border border-purple-100">
                              <span className="truncate"><span className="font-semibold text-purple-700">{c.titulo}</span> <span className="text-xs text-gray-400">({c.autor})</span></span>
                              <button
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded font-semibold text-xs hover:from-purple-600 hover:to-indigo-600 transition disabled:opacity-50"
                                onClick={() => handleAgregarCancion(pl.id, c.id)}
                                disabled={!!agregando}
                              >
                                {agregando === pl.id + c.id ? "Agregando..." : "Agregar"}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
} 