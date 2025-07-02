"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Cambiar contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassMsg, setChangePassMsg] = useState("");
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Eliminar cuenta
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const validateChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePassMsg("Todos los campos son requeridos");
      return false;
    }
    if (newPassword.length < 6) {
      setChangePassMsg("La nueva contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setChangePassMsg("Las contraseñas nuevas no coinciden");
      return false;
    }
    if (newPassword === currentPassword) {
      setChangePassMsg("La nueva contraseña no puede ser igual a la actual");
      return false;
    }
    setChangePassMsg("");
    return true;
  };

  const handleShowChangeConfirm = () => {
    if (validateChangePassword()) {
      setShowChangeConfirm(true);
    }
  };

  const handleChangePassword = async () => {
    setIsChanging(true);
    setChangePassMsg("");
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar contraseña");
      setChangePassMsg("Contraseña cambiada exitosamente");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      setChangePassMsg(err.message);
    } finally {
      setIsChanging(false);
      setShowChangeConfirm(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteMsg("");
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar cuenta");
      setDeleteMsg("Cuenta eliminada exitosamente");
      setTimeout(() => signOut({ callbackUrl: "/auth/signin" }), 1500);
    } catch (err: any) {
      setDeleteMsg(err.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Mi Cuenta</h1>
        <div className="mb-8">
          <div className="mb-2"><span className="font-semibold text-gray-900">Nombre:</span> <span className="text-gray-800">{session?.user?.name}</span></div>
          <div className="mb-2"><span className="font-semibold text-gray-900">Email:</span> <span className="text-gray-800">{session?.user?.email}</span></div>
        </div>

        {/* Cambiar contraseña */}
        <div className="mb-10">
          <h2 className="font-semibold mb-2 text-gray-900">Cambiar contraseña</h2>
          <input
            type="password"
            placeholder="Contraseña actual"
            className="w-full mb-2 px-3 py-2 border rounded-md text-gray-900"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full mb-2 px-3 py-2 border rounded-md text-gray-900"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            className="w-full mb-2 px-3 py-2 border rounded-md text-gray-900"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {changePassMsg && <div className={`mb-2 text-sm ${changePassMsg.includes("exitosamente") ? "text-green-600" : "text-red-600"}`}>{changePassMsg}</div>}
          {showChangeConfirm ? (
            <div className="mb-2">
              <p className="mb-2 text-sm text-gray-800">¿Estás seguro de que deseas cambiar la contraseña?</p>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded mb-2"
                onClick={handleChangePassword}
                disabled={isChanging}
              >Confirmar</button>
              <button
                className="w-full bg-gray-300 text-gray-800 py-2 rounded"
                onClick={() => setShowChangeConfirm(false)}
              >Cancelar</button>
            </div>
          ) : (
            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={handleShowChangeConfirm}
              disabled={isChanging}
            >Cambiar contraseña</button>
          )}
        </div>

        {/* Eliminar cuenta */}
        <div>
          <h2 className="font-semibold mb-2 text-red-700">Eliminar cuenta</h2>
          <input
            type="password"
            placeholder="Contraseña actual"
            className="w-full mb-2 px-3 py-2 border rounded-md text-gray-900"
            value={deletePassword}
            onChange={e => setDeletePassword(e.target.value)}
          />
          {deleteMsg && <div className={`mb-2 text-sm ${deleteMsg.includes("exitosamente") ? "text-green-600" : "text-red-600"}`}>{deleteMsg}</div>}
          {showDeleteConfirm ? (
            <div className="mb-2">
              <p className="mb-2 text-sm text-gray-800">¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
              <button
                className="w-full bg-red-600 text-white py-2 rounded mb-2"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >Confirmar</button>
              <button
                className="w-full bg-gray-300 text-gray-800 py-2 rounded"
                onClick={() => setShowDeleteConfirm(false)}
              >Cancelar</button>
            </div>
          ) : (
            <button
              className="w-full bg-red-600 text-white py-2 rounded"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >Eliminar cuenta</button>
          )}
        </div>
      </div>
    </div>
  );
} 