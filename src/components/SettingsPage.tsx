import { motion } from "motion/react";
import { Plus, Check, Trash2, X, ShieldCheck, ShieldHalf } from "lucide-react";
import { Child, Page } from "../types";
import { cn } from "../lib/utils";
import { useState } from "react";
import { getChildSubheading } from "../lib/childStatus";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Switch } from "./ui/Switch";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import {
  useSecondaryUsers,
  SECONDARY_USER_ROLES,
  AccessLevel,
} from "../context/SecondaryUsersContext";

interface SettingsPageProps {
  onPageChange: (page: Page) => void;
  onAddChildRequest: () => void;
}

export default function SettingsPage({
  onAddChildRequest,
}: SettingsPageProps) {
  const { currentChild, childrenList, setChild, deleteChild } = useCurrentChild();
  const [nickname, setNickname] = useState("Sarah");
  const [email, setEmail] = useState("sarah@example.com");
  const [receiveNotifications, setReceiveNotifications] = useState(true);

  // Secondary user access (partner, teacher, carer, etc.) — persisted via context.
  const {
    secondaryUsers,
    addSecondaryUser,
    removeSecondaryUser,
    setSecondaryUserAccess,
  } = useSecondaryUsers();
  const secondaryRoles = SECONDARY_USER_ROLES;
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState(secondaryRoles[0]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserAccess, setNewUserAccess] = useState<AccessLevel>("full");

  const resetNewUserForm = () => {
    setNewUserName("");
    setNewUserRole(secondaryRoles[0]);
    setNewUserEmail("");
    setNewUserAccess("full");
    setShowAddUser(false);
  };

  const handleAddSecondaryUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    addSecondaryUser({
      name: newUserName.trim(),
      role: newUserRole,
      email: newUserEmail.trim(),
      access: newUserAccess,
    });
    resetNewUserForm();
  };

  const handleRemoveSecondaryUser = (id: string) => {
    removeSecondaryUser(id);
  };

  const getNextReview = (child: Child) => {
    if (child.isNew) return getChildSubheading(child);
    const name = child.name;
    if (name === "Maya") return "12 September";
    if (name === "Liam") return "12 December";
    if (name === "Noah") return "8 October";
    if (name === "Sophia") return "24 September";
    return "12 September";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pt-16 pb-24"
    >
      <PageContainer>
        <div className="mb-24">
        <span className="text-[0.66rem] tracking-[0.2em] uppercase text-slate-500 font-medium mb-3 block">
          Account & Workspace Configs
        </span>
        <h1 className="font-medium text-[2rem] leading-tight tracking-tight mb-3">
          Settings
        </h1>
        <p className="text-[1.05rem] text-slate-500 max-w-[50ch]">
          Manage active profiles, family access settings, clinical workspace
          credentials, and UI configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mb-16 border-b border-black/10 pb-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Parent Metadata
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Update your contact details and how you'd like to be addressed in
            the application.
          </p>
        </div>
        <div className="bg-white rounded-tr-[36px] p-8 shadow-premium-light">
          <div className="mb-6">
            <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
              Primary Parent Nickname
            </label>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="mb-8" id="notification-settings-section">
            <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
              Contact Notification Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <div className="flex items-center justify-between py-2 border-t border-black/5 mt-6 mb-2">
              <span className="text-[0.85rem] text-slate-700 font-medium">
                Receive email notifications
              </span>
              <Switch
                checked={receiveNotifications}
                onCheckedChange={setReceiveNotifications}
              />
            </div>

            <div className="flex justify-start pt-2 pb-1">
              <Button variant="link" className="px-0 py-0 text-slate-500 hover:text-slate-900 border-none hover:opacity-100">
                Manage notification preferences
              </Button>
            </div>
          </div>
          <Button variant="slate">
            Save Parent Profile
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
      <div className="order-2 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mt-16 border-t border-black/10 pt-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Registered Children Profiles
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Manage the children in your workspace. Switch between active
            profiles to view their specific timelines and resources.
          </p>
        </div>
        <div>
          <button
            onClick={onAddChildRequest}
            className="flex items-center gap-2.5 mb-6 text-slate-600 hover:text-slate-900 font-medium text-[0.9rem] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-black/20 bg-white transition-colors">
              <Plus className="w-4 h-4 stroke-[2]" />
            </div>
            Add new child profile
          </button>

          <div className="space-y-4">
            {childrenList.map((child, i) => {
              const isActive = currentChild.name === child.name;
              const cornerClasses = [
                "rounded-tl-[32px]",
                "rounded-tr-[32px]",
                "rounded-br-[32px]",
                "rounded-bl-[32px]",
              ];
              const cornerClass = cornerClasses[i % cornerClasses.length];

              return (
                <div
                  key={`${child.name}-${i}`}
                  className={cn(
                    "bg-white p-6 transition-all flex items-center justify-between gap-6",
                    isActive
                      ? "shadow-sm shadow-[var(--color-thread-mid-green)]/20"
                      : "shadow-premium-light hover:shadow-md",
                    cornerClass,
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[46px] h-[46px] rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center font-medium text-[1.2rem] font-serif flex-shrink-0">
                      {child.initial}
                    </div>
                    <div>
                      <h3 className="font-medium text-[1.1rem] text-slate-900 tracking-tight">
                        {child.name}
                      </h3>
                      <p className="text-[0.84rem] text-slate-500 mt-0.5">
                        {getChildSubheading(child)}
                        {!child.isNew && ` · Next Review on ${getNextReview(child)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <div className="flex items-center gap-2 text-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/40 px-3.5 py-1.5 rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="text-[0.74rem] font-medium tracking-wide uppercase">
                          Currently Active
                        </span>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setChild(child)}
                        className="text-[0.84rem] font-medium text-slate-600 hover:text-slate-900 bg-[var(--color-thread-off-white)] hover:bg-[var(--color-thread-light-green)] border border-black/5 px-5 py-3 rounded-full transition-colors whitespace-nowrap min-h-[44px]"
                      >
                        Switch Active
                      </motion.button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteChild(child.id || '')}
                      className="inline-flex items-center gap-2 text-[0.84rem] font-medium text-slate-500 hover:text-rose-600 bg-[var(--color-thread-off-white)] hover:bg-rose-50 border border-black/5 px-4 py-3 rounded-full transition-colors whitespace-nowrap min-h-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Users & Access Section */}
      <div className="order-1 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 mt-16 border-t border-black/10 pt-16">
        <div>
          <h2 className="text-[1.1rem] font-medium text-slate-900 tracking-tight">
            Secondary Users & Access
          </h2>
          <p className="text-[0.9rem] text-slate-500 mt-2 leading-relaxed">
            Invite a partner, teacher, or carer into this workspace and choose how
            much they can see. <span className="font-medium text-slate-700">Full access</span> mirrors your own view;
            <span className="font-medium text-slate-700"> partial access</span> shares only selected areas
            (configurable soon).
          </p>
        </div>
        <div>
          {!showAddUser ? (
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center gap-2.5 mb-6 text-slate-600 hover:text-slate-900 font-medium text-[0.9rem] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-black/20 bg-white transition-colors">
                <Plus className="w-4 h-4 stroke-[2]" />
              </div>
              Add secondary user
            </button>
          ) : (
            <div className="bg-white rounded-tr-[36px] p-8 shadow-premium-light border border-black/5 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-[1.05rem] text-slate-900 tracking-tight">
                  Invite secondary user
                </h3>
                <button
                  type="button"
                  onClick={resetNewUserForm}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-5">
                <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
                  Full name
                </label>
                <Input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. James Whitlock"
                />
              </div>

              <div className="mb-5">
                <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
                  Role
                </label>
                <div className="flex flex-wrap gap-2">
                  {secondaryRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewUserRole(role)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[0.82rem] font-medium border transition-colors min-h-[40px]",
                        newUserRole === role
                          ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/40 text-[var(--color-thread-heading)]"
                          : "border-black/10 text-slate-600 hover:border-black/20 bg-white"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-2.5 block">
                  Invitation email
                </label>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="mb-7">
                <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-500 font-medium mb-3 block">
                  Access level
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setNewUserAccess("full")}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all min-h-[64px]",
                      newUserAccess === "full"
                        ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                        : "border-black/5 hover:border-black/15 bg-slate-50/40 hover:bg-slate-50/90"
                    )}
                  >
                    <ShieldCheck className="w-5 h-5 text-[var(--color-thread-mid-green)] shrink-0 mt-0.5" />
                    <span className="flex flex-col">
                      <span className="font-medium text-[0.95rem] text-slate-900">Full access</span>
                      <span className="text-[0.74rem] text-slate-500 mt-0.5">Sees and manages everything you can</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUserAccess("partial")}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all min-h-[64px]",
                      newUserAccess === "partial"
                        ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                        : "border-black/5 hover:border-black/15 bg-slate-50/40 hover:bg-slate-50/90"
                    )}
                  >
                    <ShieldHalf className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="flex flex-col">
                      <span className="font-medium text-[0.95rem] text-slate-900 flex items-center gap-2">
                        Partial access
                      </span>
                      <span className="text-[0.74rem] text-slate-500 mt-0.5">Limited scope — configurable soon</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="slate" onClick={handleAddSecondaryUser}>
                  Send invitation
                </Button>
                <Button variant="muted" onClick={resetNewUserForm}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {secondaryUsers.length === 0 ? (
              <p className="text-[0.86rem] text-slate-400 italic">
                No secondary users yet. Invite a partner, teacher, or carer to share access.
              </p>
            ) : (
              secondaryUsers.map((user, i) => {
                const cornerClasses = [
                  "rounded-tl-[32px]",
                  "rounded-tr-[32px]",
                  "rounded-br-[32px]",
                  "rounded-bl-[32px]",
                ];
                const cornerClass = cornerClasses[i % cornerClasses.length];
                const initials = user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "bg-white p-6 shadow-premium-light hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5",
                      cornerClass
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-[46px] h-[46px] rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center font-medium text-[1rem] font-serif flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-medium text-[1.1rem] text-slate-900 tracking-tight">
                          {user.name}
                        </h3>
                        <p className="text-[0.84rem] text-slate-500 mt-0.5">
                          {user.role} · {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex bg-slate-100 rounded-xl p-1 border border-black/5">
                        <button
                          type="button"
                          onClick={() => setSecondaryUserAccess(user.id, "full")}
                          className={cn(
                            "px-3.5 py-2 text-[0.78rem] font-medium rounded-lg transition-all min-h-[40px]",
                            user.access === "full"
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          )}
                        >
                          Full
                        </button>
                        <button
                          type="button"
                          onClick={() => setSecondaryUserAccess(user.id, "partial")}
                          className={cn(
                            "px-3.5 py-2 text-[0.78rem] font-medium rounded-lg transition-all min-h-[40px] inline-flex items-center gap-1.5",
                            user.access === "partial"
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          )}
                        >
                          Partial
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSecondaryUser(user.id)}
                        className="inline-flex items-center justify-center text-slate-500 hover:text-rose-600 bg-[var(--color-thread-off-white)] hover:bg-rose-50 border border-black/5 w-11 h-11 rounded-full transition-colors flex-shrink-0"
                        aria-label={`Remove ${user.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      </div>

      </PageContainer>
    </motion.div>
  );
}
