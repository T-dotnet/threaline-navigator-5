import * as React from "react";
import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Plus, Send } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AICopilotBarProps {
  currentChildName: string;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function AICopilotBar({
  currentChildName,
  placeholder,
  className,
  id = "ai-copilot-container",
}: AICopilotBarProps) {
  const [aiInput, setAiInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() && !attachedFile) return;

    setIsSubmitting(true);
    setShowResponse(true);

    const userQuery = aiInput.toLowerCase();
    let response = `I've analyzed your request for ${currentChildName}. Let me prepare a tailored recommendation for you...`;

    if (
      userQuery.includes("letter") ||
      userQuery.includes("school") ||
      userQuery.includes("teacher")
    ) {
      response = `Drafted a school advocacy outline for ${currentChildName} regarding transition support. This asks teachers to offer clear visual warnings 3 minutes before any major routine changes. Ready in resources.`;
    } else if (
      userQuery.includes("routine") ||
      userQuery.includes("morning") ||
      userQuery.includes("at home")
    ) {
      response = `Recommended action: Create a structured routine grid of early morning stages for ${currentChildName}, utilising visual timers or tick-off charts.`;
    } else if (userQuery.includes("focus") || userQuery.includes("attention")) {
      response = `Instruction strategy: Introduce brief, 5-minute play-based co-regulation tactics for ${currentChildName} to anchor focus prior to high-performance tasks.`;
    } else {
      response = `AI analysis active: Preparing proactive behavioral and academic adjustments based on ${currentChildName}'s current clinical patterns.`;
    }

    setResponseMessage("Drafting recommendations...");

    setTimeout(() => {
      setResponseMessage(response);
      setIsSubmitting(false);
    }, 1200);

    setAiInput("");
  };

  return (
    <div id={id} className={cn("sticky bottom-6 left-0 right-0 z-40 mt-14", className)}>
      {showResponse && (
        <motion.div
          id="ai-copilot-response"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-[640px] mx-auto mb-4 bg-white/95 backdrop-blur border border-black/5 rounded-tl-[32px] p-5 shadow-[0_12px_40px_-10px_rgba(22,36,60,0.12)] relative"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            id="ai-copilot-close-btn"
            onClick={() => setShowResponse(false)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 cursor-pointer text-[1.2rem]"
          >
            ×
          </motion.button>
          <div className="text-[0.66rem] tracking-[0.14em] uppercase text-[var(--color-thread-mid-green)] font-bold mb-1.5">
            Co-Pilot Assistant
          </div>
          <p
            id="ai-copilot-response-text"
            className={cn(
              "text-[0.94rem] leading-relaxed transition-opacity duration-200",
              isSubmitting
                ? "text-slate-400 italic font-normal"
                : "text-slate-700",
            )}
          >
            {responseMessage}
          </p>
        </motion.div>
      )}

      <form
        id="ai-copilot-form"
        onSubmit={handleAISubmit}
        className="bg-white rounded-full p-2 pl-4 pr-2 flex items-center gap-2.5 shadow-[0_12px_40px_-8px_rgba(22,36,60,0.15),_0_0_20px_2px_rgba(108,122,114,0.06)] border border-black/5 max-w-[640px] mx-auto hover:border-black/10 hover:shadow-[0_16px_48px_-8px_rgba(22,36,60,0.18),_0_0_24px_4px_rgba(108,122,114,0.08)] transition-all duration-300"
      >
        <input
          type="file"
          id="ai-file-upload"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          id="ai-file-upload-trigger"
          onClick={triggerFileUpload}
          className="flex-shrink-0 w-11 h-11 rounded-full bg-slate-50 hover:bg-[var(--color-thread-off-white)] text-[var(--color-thread-muted-green)] hover:text-[var(--color-thread-mid-green)] flex items-center justify-center transition-all cursor-pointer relative"
          title="Attach file"
        >
          <Plus className="w-[19px] h-[19px] stroke-[2]" />
          {attachedFile && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--color-thread-mid-green)] rounded-full" />
          )}
        </motion.button>

        <input
          type="text"
          id="ai-copilot-input-field"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder={placeholder || `Ask AI or draft a letter for ${currentChildName}...`}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[0.98rem] text-slate-800 placeholder:text-slate-400 py-1.5 focus:outline-none"
        />

        <motion.button
          whileTap={aiInput.trim() || attachedFile ? { scale: 0.92 } : undefined}
          type="submit"
          id="ai-copilot-submit-btn"
          disabled={!aiInput.trim() && !attachedFile}
          className={cn(
            "flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer",
            aiInput.trim() || attachedFile
              ? "bg-[var(--color-thread-mid-green)] text-white hover:opacity-90 shadow-sm"
              : "bg-slate-100 text-slate-300 cursor-not-allowed",
          )}
        >
          <Send className="w-[17px] h-[17px] stroke-[2.2]" />
        </motion.button>
      </form>
      {attachedFile && (
        <div id="ai-copilot-attachment-status" className="max-w-[640px] mx-auto mt-2.5 px-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="inline-flex items-center gap-2 bg-[var(--color-thread-light-green)]/40 border border-[var(--color-thread-mid-green)]/20 px-3 py-1 rounded-full text-[0.82rem] text-[var(--color-thread-mid-green)] font-medium">
            <span className="truncate max-w-[200px]">
              {attachedFile.name}
            </span>
            <button
              type="button"
              id="ai-copilot-remove-attachment-btn"
              onClick={() => setAttachedFile(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200/20 text-[1.2rem] leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
