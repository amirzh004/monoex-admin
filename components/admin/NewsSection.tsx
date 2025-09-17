"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { useApi } from "@/hooks/useApi"
import { News } from "@/models"

export function NewsSection() {
  const [isAddingNews, setIsAddingNews] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [viewingNews, setViewingNews] = useState<News | null>(null)
  const [news, setNews] = useState<News[]>([])
  const [newNews, setNewNews] = useState({
    title: "",
    description: "",
    full_text: "",
    status: "not_published"
  })
  const [image, setImage] = useState<File | null>(null)
  const { news: newsApi, loading, error, clearError } = useApi()

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const data = await newsApi.getAll();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка при загрузке новостей:', err);
      setNews([]);
    }
  };

  const handleCreateNews = async (status: string) => {
    clearError()
    
    try {
      // Генерируем уникальную ссылку из заголовка
      const link = newNews.title
        .toLowerCase()
        .replace(/[^a-z0-9а-яё\s]/gi, '')
        .replace(/\s+/g, '_')
      
      // Создаем FormData для отправки
      const formData = new FormData()
      formData.append('title', newNews.title)
      formData.append('description', newNews.description)
      formData.append('full_text', newNews.full_text)
      formData.append('link', link)
      formData.append('status', status)
      
      if (image) {
        formData.append('image', image)
      }
      
      await newsApi.create(formData)
      setIsAddingNews(false)
      setNewNews({
        title: "",
        description: "",
        full_text: "",
        status: "not_published"
      })
      setImage(null)
      loadNews()
    } catch (err) {
      console.error('Ошибка при создании новости:', err)
    }
  }

  const handleUpdateNews = async () => {
    clearError()
    
    if (!editingNews || !editingNews.id) return
    
    try {
      // Подготавливаем данные для отправки в формате JSON
      const updateData = {
        title: editingNews.title,
        description: editingNews.description,
        full_text: editingNews.full_text,
        status: editingNews.status
      }
      
      await newsApi.update(editingNews.id, updateData)
      setEditingNews(null)
      loadNews()
    } catch (err) {
      console.error('Ошибка при обновлении новости:', err)
    }
  }

  const handleDeleteNews = async (id: number) => {
    clearError()
    
    try {
      await newsApi.delete(id)
      loadNews()
    } catch (err) {
      console.error('Ошибка при удалении новости:', err)
    }
  }

  const handlePublishNews = async (id: number) => {
    clearError()
    
    try {
      await newsApi.publish(id)
      loadNews()
    } catch (err) {
      console.error('Ошибка при публикации новости:', err)
    }
  }

  const handleUnpublishNews = async (id: number) => {
    clearError()
    
    try {
      await newsApi.unpublish(id)
      loadNews()
    } catch (err) {
      console.error('Ошибка при снятии с публикации новости:', err)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  // Ensure news is always an array before mapping
  const newsArray = Array.isArray(news) ? news : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "#2c3e50", fontFamily: "Space Grotesk, sans-serif" }}
          >
            Новости
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Управление новостными статьями и публикациями
          </p>
        </div>
        <Dialog open={isAddingNews} onOpenChange={setIsAddingNews}>
          <DialogTrigger asChild>
            <Button
              className="w-full sm:w-auto text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: "#2c3e50",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить новость
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить новую статью</DialogTitle>
              <DialogDescription>Создайте новую новостную статью для публикации на сайте</DialogDescription>
            </DialogHeader>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <div>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="news-title">Заголовок</Label>
                  <Input 
                    id="news-title" 
                    placeholder="Заголовок новости" 
                    value={newNews.title}
                    onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="news-description">Краткое описание</Label>
                  <Textarea 
                    id="news-description" 
                    placeholder="Краткое описание для превью" 
                    value={newNews.description}
                    onChange={(e) => setNewNews({...newNews, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="news-full_text">Полный текст</Label>
                  <Textarea 
                    id="news-full_text" 
                    placeholder="Полный текст статьи" 
                    className="min-h-[120px]" 
                    value={newNews.full_text}
                    onChange={(e) => setNewNews({...newNews, full_text: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="news-image">Изображение</Label>
                  <Input 
                    id="news-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-transparent"
                  onClick={() => handleCreateNews('not_published')}
                  disabled={loading}
                >
                  Сохранить как черновик
                </Button>
                <Button 
                  type="button" 
                  className="w-full sm:w-auto"
                  onClick={() => handleCreateNews('published')}
                  disabled={loading}
                >
                  {loading ? 'Публикация...' : 'Опубликовать'}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit News Dialog */}
      <Dialog open={!!editingNews} onOpenChange={() => setEditingNews(null)}>
        <DialogContent className="sm:max-w-[625px] mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
            <DialogDescription>Внесите изменения в новостную статью</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {editingNews && (
            <div>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-news-title">Заголовок</Label>
                  <Input 
                    id="edit-news-title" 
                    value={editingNews.title} 
                    placeholder="Заголовок новости" 
                    onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-news-description">Краткое описание</Label>
                  <Textarea 
                    id="edit-news-description" 
                    value={editingNews.description} 
                    placeholder="Краткое описание для превью" 
                    onChange={(e) => setEditingNews({...editingNews, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-news-full_text">Полный текст</Label>
                  <Textarea 
                    id="edit-news-full_text" 
                    value={editingNews.full_text} 
                    placeholder="Полный текст статьи" 
                    className="min-h-[120px]" 
                    onChange={(e) => setEditingNews({...editingNews, full_text: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Текущее изображение</Label>
                  {editingNews.image_path && (
                    <div className="flex items-center space-x-2 mt-2">
                      <img
                        src={editingNews.image_path || "/placeholder.svg"}
                        alt="Текущее изображение"
                        className="w-16 h-16 rounded object-cover"
                      />
                      <span className="text-sm text-muted-foreground">Изображение нельзя изменить при редактировании</span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setEditingNews(null)}>
                  Отмена
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-transparent"
                  onClick={() => {
                    setEditingNews({...editingNews, status: 'not_published'});
                    handleUpdateNews();
                  }}
                  disabled={loading}
                >
                  Сохранить как черновик
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setEditingNews({...editingNews, status: 'published'});
                    handleUpdateNews();
                  }}
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Опубликовать'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View News Dialog */}
      <Dialog open={!!viewingNews} onOpenChange={() => setViewingNews(null)}>
        <DialogContent className="sm:max-w-[700px] mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingNews?.title}</DialogTitle>
            <DialogDescription>
              Статус:{" "}
              <Badge variant={viewingNews?.status === "published" ? "default" : "secondary"}>
                {viewingNews?.status === 'published' ? 'Опубликовано' : 'Черновик'}
              </Badge>{" "}
              • Дата: {viewingNews?.created_at ? new Date(viewingNews.created_at).toLocaleDateString('ru-RU') : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {viewingNews?.image_path && (
              <img
                src={viewingNews.image_path || "/placeholder.svg"}
                alt={viewingNews.title}
                className="w-full h-48 rounded-lg object-cover mb-4"
              />
            )}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Краткое описание:</h4>
                <p className="text-muted-foreground">{viewingNews?.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Полный текст:</h4>
                <p className="text-muted-foreground">{viewingNews?.full_text}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingNews(null)}>
              Закрыть
            </Button>
            <Button
              onClick={() => {
                setViewingNews(null)
                setEditingNews(viewingNews)
              }}
            >
              Редактировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle style={{ color: "#2c3e50", fontFamily: "Space Grotesk, sans-serif" }}>Список новостей</CardTitle>
          <CardDescription style={{ fontFamily: "DM Sans, sans-serif" }}>
            Все новостные статьи и публикации
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
                  <TableHead className="min-w-[250px]">Статья</TableHead>
                  <TableHead className="min-w-[100px]">Статус</TableHead>
                  <TableHead className="min-w-[120px]">Дата</TableHead>
                  <TableHead className="text-right min-w-[120px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsArray.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={article.image_path || "/placeholder.svg"}
                          alt={article.title}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{article.title}</div>
                          <div className="text-sm text-muted-foreground truncate">{article.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.status === "published" ? "default" : "secondary"}>
                        {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(article.created_at).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewingNews(article)} title="Просмотреть">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingNews(article)} title="Редактировать">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {article.status === 'published' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUnpublishNews(article.id)} 
                            title="Снять с публикации"
                          >
                            Снять
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handlePublishNews(article.id)} 
                            title="Опубликовать"
                          >
                            Опубликовать
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" title="Удалить">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить новость "{article.title}"? Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteNews(article.id)}
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
          {newsArray.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Нет добавленных новостей
            </div>
          )}
          {loading && (
            <div className="text-center py-8">
              Загрузка данных...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}