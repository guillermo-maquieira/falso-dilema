import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuestions, useCreateQuestion, useDeleteQuestion, useUpdateQuestion } from "@/hooks/useQuestions";
import { Trash2, Plus, X, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { QuestionEditor } from "./QuestionEditor";
import type { Question } from "@/hooks/useQuestions";

export function AdminPanel() {
  const { data: questions, isLoading } = useQuestions();
  const createQuestion = useCreateQuestion();
  const deleteQuestion = useDeleteQuestion();
  const updateQuestion = useUpdateQuestion();

  const [emoji, setEmoji] = useState("");
  const [answers, setAnswers] = useState([
    { text: "", is_correct: true },
    { text: "", is_correct: false },
  ]);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);

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

    try {
      await createQuestion.mutateAsync({ emoji: emoji.trim(), answers });
      setEmoji("");
      setAnswers([
        { text: "", is_correct: true },
        { text: "", is_correct: false },
      ]);
      toast.success("Pregunta creada");
    } catch {
      toast.error("Error al crear pregunta");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion.mutateAsync(id);
      toast.success("Pregunta eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleUpdate = async (data: {
    id: string;
    emoji: string;
    answers: { id?: string; text: string; is_correct: boolean }[];
  }) => {
    await updateQuestion.mutateAsync(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Nueva Pregunta
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                <Button type="button" variant="ghost" size="sm" onClick={addAnswer}>
                  + Añadir respuesta
                </Button>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={createQuestion.isPending}>
              Crear pregunta
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preguntas ({questions?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : questions?.length === 0 ? (
            <p className="text-muted-foreground">No hay preguntas</p>
          ) : (
            <div className="space-y-3">
              {questions?.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <span className="text-2xl mr-3">{q.emoji}</span>
                    <span className="text-sm text-muted-foreground">
                      {q.answers.length} respuestas
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingQuestion(q)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(q)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(q.id)}
                      disabled={deleteQuestion.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <QuestionEditor
        question={editingQuestion}
        open={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        onSave={handleUpdate}
        isSaving={updateQuestion.isPending}
      />

      {/* View Dialog */}
      {viewingQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewingQuestion(null)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Vista previa</span>
                <Button variant="ghost" size="sm" onClick={() => setViewingQuestion(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <span className="text-6xl">{viewingQuestion.emoji}</span>
              </div>
              <div className="space-y-2">
                {viewingQuestion.answers.map((a) => (
                  <div
                    key={a.id}
                    className={`p-3 rounded-lg border ${
                      a.is_correct
                        ? "bg-success/20 border-success"
                        : "bg-muted border-border"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {a.is_correct && <span className="text-success">✓</span>}
                      {a.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
