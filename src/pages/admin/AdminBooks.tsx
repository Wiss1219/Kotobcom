import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
  BookData,
  fetchQuranBooks,
  createQuranBook,
  updateQuranBook,
  deleteQuranBook
} from '@/services/bookService';
import BackToDashboardButton from '@/components/admin/BackToDashboardButton';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Trash2, Pencil, LayoutDashboardIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminBooks = () => {
  const [books, setBooks] = useState<BookData[]>([]);
  const [quranBooks, setQuranBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<BookData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('regular');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: 0,
    description: '',
    coverImage: '',
    category: '',
    language: '',
    publisher: '',
    rating: 5,
    inStock: true,
    featured: false,
    newArrival: false,
    bestSeller: false,
    pages: 0,
    publication_date: '',
    isbn: ''
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const [regularBooks, quranBooksData] = await Promise.all([
        fetchBooks(),
        fetchQuranBooks()
      ]);
      setBooks(regularBooks);
      setQuranBooks(quranBooksData);
    } catch (error) {
      console.error('Error loading books:', error);
      toast({
        title: 'Error',
        description: 'Failed to load books. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' || name === 'pages'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      price: 0,
      description: '',
      coverImage: '',
      category: '',
      language: '',
      publisher: '',
      rating: 5,
      inStock: true,
      featured: false,
      newArrival: false,
      bestSeller: false,
      pages: 0,
      publication_date: '',
      isbn: ''
    });
    setIsEditing(false);
    setCurrentBook(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (book: BookData) => {
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      description: book.description,
      coverImage: book.coverImage,
      category: book.category,
      language: book.language,
      publisher: book.publisher,
      rating: book.rating,
      inStock: book.inStock,
      featured: book.featured,
      newArrival: book.newArrival,
      bestSeller: book.bestSeller,
      pages: book.pages,
      publication_date: book.publication_date,
      isbn: book.isbn
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (book: BookData) => {
    setCurrentBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && currentBook) {
        // Update existing book
        const isQuranBook = activeTab === 'quran';
        const updateFn = isQuranBook ? updateQuranBook : updateBook;

        const updatedBook = await updateFn(currentBook.id, formData);

        if (updatedBook) {
          toast({
            title: 'Success',
            description: `${formData.title} has been updated.`,
          });

          // Update the books list
          if (isQuranBook) {
            setQuranBooks(prev => prev.map(book =>
              book.id === updatedBook.id ? updatedBook : book
            ));
          } else {
            setBooks(prev => prev.map(book =>
              book.id === updatedBook.id ? updatedBook : book
            ));
          }
        }
      } else {
        // Create new book
        const isQuranBook = activeTab === 'quran';
        const createFn = isQuranBook ? createQuranBook : createBook;

        const newBook = await createFn(formData);

        if (newBook) {
          toast({
            title: 'Success',
            description: `${formData.title} has been added to the catalog.`,
          });

          // Add the new book to the list
          if (isQuranBook) {
            setQuranBooks(prev => [...prev, newBook]);
          } else {
            setBooks(prev => [...prev, newBook]);
          }
        }
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: 'Error',
        description: 'Failed to save book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentBook) return;

    setLoading(true);
    try {
      const isQuranBook = activeTab === 'quran';
      const deleteFn = isQuranBook ? deleteQuranBook : deleteBook;

      const success = await deleteFn(currentBook.id);

      if (success) {
        toast({
          title: 'Success',
          description: `${currentBook.title} has been deleted.`,
        });

        // Remove the book from the list
        if (isQuranBook) {
          setQuranBooks(prev => prev.filter(book => book.id !== currentBook.id));
        } else {
          setBooks(prev => prev.filter(book => book.id !== currentBook.id));
        }
      }

      setIsDeleteDialogOpen(false);
      setCurrentBook(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete book. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-6 overflow-auto pt-16 lg:pt-6">
        <BackToDashboardButton className="mb-4" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Book Management</h1>
            <p className="text-sm lg:text-base text-muted-foreground">Manage your books and Quran editions</p>
          </div>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <Plus size={16} />
            Add New Book
          </Button>
        </div>

        <Tabs defaultValue="regular" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="regular">Regular Books</TabsTrigger>
            <TabsTrigger value="quran">Quran Books</TabsTrigger>
          </TabsList>

          <TabsContent value="regular">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                      <TableHead className="hidden sm:table-cell">Price</TableHead>
                      <TableHead className="hidden lg:table-cell">Category</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No books found. Add your first book!
                        </TableCell>
                      </TableRow>
                    ) : (
                      books.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-10 w-8 sm:h-12 sm:w-10 object-cover rounded"
                              />
                            ) : (
                              <div className="h-10 w-8 sm:h-12 sm:w-10 bg-muted rounded flex items-center justify-center text-xs">
                                No Image
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium max-w-[120px] sm:max-w-none truncate">
                            <div className="truncate">{book.title}</div>
                            <div className="text-xs text-muted-foreground md:hidden truncate">{book.author}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">${book.price.toFixed(2)}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{book.author}</TableCell>
                          <TableCell className="hidden sm:table-cell">${book.price.toFixed(2)}</TableCell>
                          <TableCell className="hidden lg:table-cell">{book.category}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              book.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {book.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(book)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Pencil size={14} className="sm:hidden" />
                                <Pencil size={16} className="hidden sm:block" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(book)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 size={14} className="sm:hidden" />
                                <Trash2 size={16} className="hidden sm:block" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="quran">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                      <TableHead className="hidden sm:table-cell">Price</TableHead>
                      <TableHead className="hidden lg:table-cell">Language</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quranBooks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No Quran books found. Add your first Quran book!
                        </TableCell>
                      </TableRow>
                    ) : (
                      quranBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-10 w-8 sm:h-12 sm:w-10 object-cover rounded"
                              />
                            ) : (
                              <div className="h-10 w-8 sm:h-12 sm:w-10 bg-muted rounded flex items-center justify-center text-xs">
                                No Image
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium max-w-[120px] sm:max-w-none truncate">
                            <div className="truncate">{book.title}</div>
                            <div className="text-xs text-muted-foreground md:hidden truncate">{book.author}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">${book.price.toFixed(2)}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{book.author}</TableCell>
                          <TableCell className="hidden sm:table-cell">${book.price.toFixed(2)}</TableCell>
                          <TableCell className="hidden lg:table-cell">{book.language}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              book.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {book.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(book)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Pencil size={14} className="sm:hidden" />
                                <Pencil size={16} className="hidden sm:block" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(book)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 size={14} className="sm:hidden" />
                                <Trash2 size={16} className="hidden sm:block" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add/Edit Book Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {activeTab === 'regular' && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Biography">Biography</SelectItem>
                        <SelectItem value="Self-Help">Self-Help</SelectItem>
                        <SelectItem value="Children">Children</SelectItem>
                        <SelectItem value="Islamic">Islamic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    name="language"
                    value={formData.language}
                    onValueChange={(value) => handleSelectChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Urdu">Urdu</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    min="0"
                    value={formData.pages}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publication_date">Publication Date</Label>
                  <Input
                    id="publication_date"
                    name="publication_date"
                    type="date"
                    value={formData.publication_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('inStock', checked as boolean)
                    }
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('featured', checked as boolean)
                    }
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newArrival"
                    checked={formData.newArrival}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('newArrival', checked as boolean)
                    }
                  />
                  <Label htmlFor="newArrival">New Arrival</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bestSeller"
                    checked={formData.bestSeller}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('bestSeller', checked as boolean)
                    }
                  />
                  <Label htmlFor="bestSeller">Best Seller</Label>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update' : 'Add'} Book
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="p-4 sm:p-6 max-w-[90vw] sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg sm:text-xl">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                This will permanently delete {currentBook?.title}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
              <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="w-full sm:w-auto bg-destructive text-destructive-foreground"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default AdminBooks;
