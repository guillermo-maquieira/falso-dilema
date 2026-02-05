import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Question } from "@/hooks/useQuestions";

interface QuestionEditorProps {
  question: Question | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    id: string;
    emoji: string;
    answers: { id?: string; text: string; is_correct: boolean }[];
  }) => Promise<void>;
  isSaving: boolean;
}

export function QuestionEditor({
  question,
  open,
  onClose,
  onSave,
  isSaving,
}: QuestionEditorProps) {
  const [emoji, setEmoji] = useState("");
  const [answers, setAnswers] = useState<
    { id?: string; text: string; is_correct: boolean }[]
  >([]);

  useEffect(() => {
    if (question) {
      setEmoji(question.emoji);
      setAnswers(
        question.answers.map((a) => ({
          id: a.id,
          text: a.text,
          is_correct: a.is_correct,
        }))
      );
    }
  }, [question]);

  const addAnswer = () => {
    if (answers.length < 3) {
      setAnswers([...answers, { text: "", is_correct: false }]);
    }
  };

  const removeAnswer = (index: number) => {
    if (answers.length > 2) {
      const newAnswers = answers.filter((_, i) => i !== index);
      if (!newAnswers.some((a) => a.is_correct)) {
        newAnswers[0].is_correct = true;
      }
      setAnswers(newAnswers);
    }
  };

  const updateAnswer = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = text;
    setAnswers(newAnswers);
  };

  const setCorrect = (index: number) => {
    setAnswers(answers.map((a, i) => ({ ...a, is_correct: i === index })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emoji.trim() || answers.some((a) => !a.text.trim())) {
      toast.error("Completa todos los campos");
      return;
    }

    if (!question) return;

    try {
      await onSave({ id: question.id, emoji: emoji.trim(), answers });
      toast.success("Pregunta actualizada");
      onClose();
    } catch {
      toast.error("Error al actualizar");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Pregunta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Emojis</label>
            <Input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🍕🍔🍟"
              className="text-2xl h-14"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Respuestas</label>
            {answers.map((answer, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={answer.text}
                  onChange={(e) => updateAnswer(i, e.target.value)}
                  placeholder={`Respuesta ${i + 1}`}
                />
                <Button
                  type="button"
                  variant={answer.is_correct ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCorrect(i)}
                  className="shrink-0"
                >
                  ✓
                </Button>
                {answers.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAnswer(i)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {answers.length < 3 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addAnswer}
              >
                + Añadir respuesta
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
