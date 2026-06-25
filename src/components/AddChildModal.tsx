import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import React, { useState, useCallback } from "react";
import { Child } from "../types";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (child: Child) => void;
}

export default function AddChildModal({
  isOpen,
  onClose,
  onAdd,
}: AddChildModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age.trim()) return;

    // Create new child
    onAdd({
      name: name.trim(),
      age: parseInt(age, 10) || 0,
      initial: name.trim().charAt(0).toUpperCase(),
    });

    // Reset and close
    setName("");
    setAge("");
    onClose();
  }, [name, age, onAdd, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-all"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] bg-white rounded-tr-[36px] shadow-modal z-50 overflow-hidden font-sans"
          >
            <div className="flex items-center justify-between px-7 pt-7 pb-4">
              <div>
                <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-1.5 block">
                  Workspace
                </span>
                <h2 className="text-[1.4rem] font-sans font-medium text-[var(--color-thread-heading)] tracking-tight leading-none">
                  Add Child Profile
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--color-thread-off-white)] flex items-center justify-center text-[var(--color-thread-gray)] hover:bg-[var(--color-thread-cream)] hover:text-[var(--color-thread-dark-slate)] transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-7 pb-7 pt-2">
              <div className="space-y-5">
                <div>
                  <label className="text-[0.8rem] font-semibold text-[var(--color-thread-dark-slate)] mb-2 block tracking-tight">
                    Child's First Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[0.8rem] font-semibold text-[var(--color-thread-dark-slate)] mb-2 block tracking-tight">
                    Age
                  </label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 9"
                    min="0"
                    max="30"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-black/5 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="muted"
                  className="px-5 py-2.5 text-[0.9rem]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!name.trim() || !age.trim()}
                  variant="forest"
                  className="px-6 py-2.5 text-[0.9rem]"
                >
                  Add Profile
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
