// Destination: src/components/dashboard/EditProfileModal.tsx
"use client";

import { useState, type FormEvent } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-text-soft">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-bg px-3 py-2.5 pr-10 text-sm text-text"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-soft"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export function EditProfileModal({
  name,
  email,
  onClose,
  onUpdated,
}: {
  name: string;
  email: string;
  onClose: () => void;
  onUpdated: (name: string) => void;
}) {
  const [nameValue, setNameValue] = useState(name);
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  async function handleSaveName(e: FormEvent) {
    e.preventDefault();
    if (!nameValue.trim()) {
      setNameError("Name can't be empty.");
      return;
    }
    setSavingName(true);
    setNameError("");
    setNameSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      onUpdated(data.name);
      setNameSuccess(true);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSavingName(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordError("Fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    setSavingPassword(true);
    setPasswordError("");
    setPasswordSuccess(false);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to change password");
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center bg-[var(--overlay)] p-0 sm:items-center sm:p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-2xl bg-surface p-7 shadow-2xl sm:rounded-md">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-accent">
              Account
            </div>
            <h2 className="text-lg font-bold">Edit profile</h2>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-text-soft" />
          </button>
        </div>

        {/* Name + email */}
        <form onSubmit={handleSaveName} className="mb-7">
          <label className="mb-1 block font-mono text-xs text-text-soft">
            Name
          </label>
          <input
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className="mb-3 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm text-text"
          />
          <label className="mb-1 block font-mono text-xs text-text-soft">
            Email
          </label>
          <input
            value={email}
            disabled
            className="w-full rounded-md border border-border bg-surface2 px-3 py-2.5 text-sm text-text-soft"
          />
          {nameError && (
            <p className="mt-2 text-sm text-stamp-rejected">{nameError}</p>
          )}
          {nameSuccess && (
            <p className="mt-2 text-sm text-stamp-offer">Name updated.</p>
          )}
          <button
            type="submit"
            disabled={savingName}
            className="mt-3 flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-mono text-[12px] text-white disabled:opacity-60"
          >
            {savingName && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {savingName ? "Saving..." : "Save name"}
          </button>
        </form>

        {/* Password */}
        <form
          onSubmit={handleChangePassword}
          className="border-t border-border pt-6"
        >
          <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-accent">
            Security
          </div>
          <h3 className="mb-4 text-[15px] font-semibold">Change password</h3>

          <div className="flex flex-col gap-3">
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          {passwordError && (
            <p className="mt-2 text-sm text-stamp-rejected">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="mt-2 text-sm text-stamp-offer">Password changed.</p>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-3 flex items-center gap-2 rounded-md border border-text px-4 py-2 font-mono text-[12px] disabled:opacity-60"
          >
            {savingPassword && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {savingPassword ? "Changing..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}