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
import { FileText, Plus, Edit, Trash2, Download } from "lucide-react"
import { useApi } from "@/hooks/useApi"
import { Review } from "@/models"

export function ReviewsSection() {
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    company_name: "",
    service_type: "",
    description: ""
  })
  const [file, setFile] = useState<File | null>(null)
  const { review: reviewApi, loading, error, clearError } = useApi()

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const data = await reviewApi.getAll()
      setReviews(data)
    } catch (err) {
      console.error('Ошибка при загрузке отзывов:', err)
      setReviews([])
    }
  }

  const handleCreateReview = async () => {
    clearError()
    
    try {
      // Создаем FormData для отправки
      const formData = new FormData()
      formData.append('company_name', newReview.company_name)
      formData.append('service_type', newReview.service_type)
      formData.append('description', newReview.description)
      
      if (file) {
        formData.append('file', file)
      }
      
      await reviewApi.create(formData)
      setIsAddingReview(false)
      setNewReview({
        company_name: "",
        service_type: "",
        description: ""
      })
      setFile(null)
      loadReviews()
    } catch (err) {
      console.error('Ошибка при создании отзыва:', err)
    }
  }

  const handleUpdateReview = async () => {
    clearError()
    
    if (!editingReview || !editingReview.id) return
    
    try {
      // Подготавливаем данные для отправки в формате JSON
      const updateData = {
        company_name: editingReview.company_name,
        service_type: editingReview.service_type,
        description: editingReview.description,
        pdf_path: editingReview.pdf_path
      }
      
      await reviewApi.update(editingReview.id, updateData)
      setEditingReview(null)
      loadReviews()
    } catch (err) {
      console.error('Ошибка при обновлении отзыва:', err)
    }
  }

  const handleDeleteReview = async (id: number) => {
    clearError()
    
    try {
      await reviewApi.delete(id)
      loadReviews()
    } catch (err) {
      console.error('Ошибка при удалении отзыва:', err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "#2c3e50", fontFamily: "Space Grotesk, sans-serif" }}
          >
            Отзывы клиентов
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Управление отзывами и рекомендациями от клиентов
          </p>
        </div>
        <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
          <DialogTrigger asChild>
            <Button
              className="w-full sm:w-auto text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: "#2c3e50",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить отзыв
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить новый отзыв</DialogTitle>
              <DialogDescription>Добавьте отзыв от клиента о предоставленных услугах</DialogDescription>
            </DialogHeader>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <div>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="company-name">Название компании</Label>
                  <Input 
                    id="company-name" 
                    placeholder="ТОО 'Название компании'" 
                    value={newReview.company_name}
                    onChange={(e) => setNewReview({...newReview, company_name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service-type">Тип услуги</Label>
                  <Input 
                    id="service-type" 
                    placeholder="Антимонопольное консультирование" 
                    value={newReview.service_type}
                    onChange={(e) => setNewReview({...newReview, service_type: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="review-description">Краткое описание</Label>
                  <Textarea 
                    id="review-description" 
                    placeholder="Описание предоставленных услуг" 
                    value={newReview.description}
                    onChange={(e) => setNewReview({...newReview, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="review-pdf">PDF документ</Label>
                  <Input 
                    id="review-pdf" 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateReview} 
                  className="w-full sm:w-auto" 
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Сохранить отзыв'}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Review Dialog */}
      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent className="sm:max-w-[525px] mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать отзыв</DialogTitle>
            <DialogDescription>Внесите изменения в отзыв клиента</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {editingReview && (
            <div>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-company-name">Название компании</Label>
                  <Input 
                    id="edit-company-name" 
                    value={editingReview.company_name} 
                    placeholder="ТОО 'Название компании'" 
                    onChange={(e) => setEditingReview({...editingReview, company_name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-service-type">Тип услуги</Label>
                  <Input 
                    id="edit-service-type" 
                    value={editingReview.service_type} 
                    placeholder="Антимонопольное консультирование" 
                    onChange={(e) => setEditingReview({...editingReview, service_type: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-review-description">Краткое описание</Label>
                  <Textarea 
                    id="edit-review-description" 
                    value={editingReview.description} 
                    placeholder="Описание предоставленных услуг" 
                    onChange={(e) => setEditingReview({...editingReview, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Текущий документ</Label>
                  {editingReview.pdf_path && (
                    <div className="flex items-center space-x-2 mt-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {editingReview.pdf_path.split('/').pop()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Документ нельзя изменить при редактировании
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingReview(null)}>
                  Отмена
                </Button>
                <Button 
                  onClick={handleUpdateReview} 
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle style={{ color: "#2c3e50", fontFamily: "Space Grotesk, sans-serif" }}>Список отзывов</CardTitle>
          <CardDescription style={{ fontFamily: "DM Sans, sans-serif" }}>
            Все отзывы и рекомендации от клиентов
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
                  <TableHead className="min-w-[200px]">Компания</TableHead>
                  <TableHead className="min-w-[150px]">Тип услуги</TableHead>
                  <TableHead className="min-w-[150px]">Документ</TableHead>
                  <TableHead className="min-w-[120px]">Дата добавления</TableHead>
                  <TableHead className="text-right min-w-[120px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.company_name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{review.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{review.service_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{review.pdf_path?.split('/').pop()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.created_at ? new Date(review.created_at).toLocaleDateString('ru-RU') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Download functionality
                            const link = document.createElement("a")
                            link.href = review.pdf_path
                            link.download = review.pdf_path.split('/').pop() || 'review.pdf'
                            link.click()
                          }}
                          title="Скачать документ"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingReview(review)}
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
                              <AlertDialogTitle>Удалить отзыв?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить отзыв от "{review.company_name}"? Это действие нельзя
                                отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteReview(review.id)}
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
            {reviews.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Нет добавленных отзывов
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