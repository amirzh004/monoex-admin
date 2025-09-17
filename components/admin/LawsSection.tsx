"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, Plus, Edit, Trash2, Download } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { Legislation } from "@/models";

export function LawsSection() {
  const [isAddingLaw, setIsAddingLaw] = useState(false);
  const [editingLaw, setEditingLaw] = useState<Legislation | null>(null);
  const [laws, setLaws] = useState<Legislation[]>([]);
  const [newLaw, setNewLaw] = useState(new Legislation());
  const [file, setFile] = useState<File | null>(null);
  const { legislation, loading, error, clearError } = useApi();

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadLaws();
  }, []);

  const loadLaws = async () => {
    try {
      const data = await legislation.getAll();
      console.log("data", data);
      setLaws(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка при загрузке законодательных актов:", err);
      setLaws([]);
    }
  };

  const handleCreateLaw = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      // Создаем FormData
      const formData = new FormData();
      formData.append("title", newLaw.title);
      formData.append("description", newLaw.description);

      if (file) {
        formData.append("file", file);
      }

      await legislation.create(formData);
      setIsAddingLaw(false);
      setNewLaw(new Legislation());
      setFile(null);
      loadLaws();
    } catch (err) {
      console.error("Ошибка при создании законодательного акта:", err);
    }
  };

  const handleUpdateLaw = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!editingLaw || !editingLaw.id) return;

    try {
      // Подготавливаем данные в формате JSON
      const updateData = {
        title: editingLaw.title,
        description: editingLaw.description,
        file_path: editingLaw.file_path
      };

      await legislation.update(editingLaw.id, updateData);
      setEditingLaw(null);
      loadLaws();
    } catch (err) {
      console.error("Ошибка при обновлении законодательного акта:", err);
    }
  };

  const handleDeleteLaw = async (id: number) => {
    clearError();

    try {
      await legislation.delete(id);
      loadLaws();
    } catch (err) {
      console.error("Ошибка при удалении законодательного акта:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  console.log("laws:", laws);

  // Ensure laws is always an array before mapping
  const lawsArray = Array.isArray(laws) ? laws : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{
              color: "#2c3e50",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            Законодательство
          </h2>
          <p
            className="text-gray-600"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Управление юридическими документами и законодательными актами
          </p>
        </div>
        <Dialog
          open={isAddingLaw}
          onOpenChange={(open) => {
            setIsAddingLaw(open);
            if (open) clearError();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="w-full sm:w-auto text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: "#2c3e50",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить документ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить новый документ</DialogTitle>
              <DialogDescription>
                Заполните информацию о новом законодательном документе
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateLaw}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    placeholder="Название документа"
                    value={newLaw.title}
                    onChange={(e) =>
                      setNewLaw({ ...newLaw, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Краткое описание документа"
                    value={newLaw.description}
                    onChange={(e) =>
                      setNewLaw({ ...newLaw, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">Файл документа</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? "Сохранение..." : "Сохранить документ"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Law Dialog */}
      <Dialog
        open={!!editingLaw}
        onOpenChange={(open) => {
          if (!open) setEditingLaw(null);
          clearError();
        }}
      >
        <DialogContent className="sm:max-w-[525px] mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать документ</DialogTitle>
            <DialogDescription>
              Внесите изменения в законодательный документ
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {editingLaw && (
            <form onSubmit={handleUpdateLaw}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Заголовок</Label>
                  <Input
                    id="edit-title"
                    value={editingLaw.title}
                    placeholder="Название документа"
                    onChange={(e) =>
                      setEditingLaw({ ...editingLaw, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Описание</Label>
                  <Textarea
                    id="edit-description"
                    value={editingLaw.description}
                    placeholder="Краткое описание документа"
                    onChange={(e) =>
                      setEditingLaw({
                        ...editingLaw,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Текущий файл</Label>
                  <p className="text-sm text-muted-foreground">
                    {editingLaw.file_path?.split("/").pop()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Для замены файла удалите текущий документ и создайте новый
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingLaw(null)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle
            style={{
              color: "#2c3e50",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            Список документов
          </CardTitle>
          <CardDescription style={{ fontFamily: "DM Sans, sans-serif" }}>
            Все законодательные документы и акты
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Документ</TableHead>
                  <TableHead className="min-w-[150px]">Файл</TableHead>
                  <TableHead className="min-w-[120px]">
                    Дата добавления
                  </TableHead>
                  <TableHead className="text-right min-w-[120px]">
                    Действия
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lawsArray.map((law) => (
                  <TableRow key={law.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{law.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {law.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">
                          {law.file_path?.split("/").pop()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(law.created_at).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = law.file_path;
                            link.download =
                              law.file_path.split("/").pop() || "document.pdf";
                            link.click();
                          }}
                          title="Скачать документ"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingLaw(law)}
                          title="Редактировать"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" title="Удалить">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Удалить документ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить документ "
                                {law.title}"? Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteLaw(law.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {lawsArray.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Нет добавленных документов
            </div>
          )}
          {loading && (
            <div className="text-center py-8">Загрузка данных...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}