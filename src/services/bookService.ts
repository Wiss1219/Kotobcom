
import { supabase } from '@/integrations/supabase/client';

export interface BookData {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  coverImage: string;
  category: string;
  language: string;
  publisher: string;
  rating: number;
  inStock: boolean;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  pages: number;
  publication_date: string;
  isbn: string;
  stock: number;
  reviews: any[];
}

export const fetchBooks = async (): Promise<BookData[]> => {
  try {
    const { data: dbBooks, error } = await supabase
      .from('books')
      .select('*');

    if (error) {
      console.error("Error fetching books:", error);
      throw error;
    }

    if (!dbBooks) {
      console.warn("No books found in the database.");
      return [];
    }

    const books: BookData[] = dbBooks.map(dbBook => {
      const book: BookData = {
        id: dbBook.id,
        title: dbBook.title || '',
        author: dbBook.author || '',
        price: dbBook.price || 0,
        description: dbBook.description || '',
        coverImage: dbBook.cover_image || '',
        category: dbBook.category || '',
        language: dbBook.language || '',
        publisher: dbBook.publisher || '',
        rating: dbBook.rating || 0,
        inStock: dbBook.in_stock || false,
        featured: dbBook.featured || false,
        newArrival: dbBook.new_arrival || false,
        bestSeller: dbBook.best_seller || false,
        pages: 0, // Default value since it might not be in the database
        publication_date: '', // Default value
        isbn: '', // Default value
        stock: dbBook.in_stock ? 1 : 0,
        reviews: []
      };

      return book;
    });

    return books;
  } catch (error) {
    console.error("Error processing book data:", error);
    return [];
  }
};

export const fetchQuranBooks = async (): Promise<BookData[]> => {
  try {
    const { data: dbBooks, error } = await supabase
      .from('quran_books')
      .select('*');

    if (error) {
      console.error("Error fetching quran books:", error);
      throw error;
    }

    if (!dbBooks) {
      console.warn("No quran books found in the database.");
      return [];
    }

    const books: BookData[] = dbBooks.map(dbBook => ({
      id: dbBook.id,
      title: dbBook.title || '',
      author: dbBook.author || '',
      price: dbBook.price || 0,
      description: dbBook.description || '',
      coverImage: dbBook.cover_image || '',
      category: "Quran",
      language: dbBook.language || '',
      publisher: dbBook.publisher || '',
      rating: dbBook.rating || 0,
      inStock: dbBook.in_stock || false,
      featured: dbBook.featured || false,
      newArrival: dbBook.new_arrival || false,
      bestSeller: dbBook.best_seller || false,
      pages: 0, // Default value
      publication_date: '', // Default value
      isbn: '', // Default value
      stock: dbBook.in_stock ? 1 : 0,
      reviews: []
    }));

    return books;
  } catch (error) {
    console.error("Error processing quran book data:", error);
    return [];
  }
};

export const createBook = async (bookData: Partial<BookData>): Promise<BookData | null> => {
  try {
    const { coverImage, publication_date, inStock, ...rest } = bookData;

    const bookToInsert = {
      title: rest.title || '',
      author: rest.author || '',
      price: rest.price || 0,
      description: rest.description || '',
      cover_image: coverImage || '',
      category: rest.category || 'Fiction',
      language: rest.language || 'English',
      publisher: rest.publisher || 'Unknown',
      rating: rest.rating || 5,
      in_stock: inStock !== undefined ? inStock : true,
      featured: rest.featured || false,
      new_arrival: rest.newArrival || false,
      best_seller: rest.bestSeller || false
    };

    const { data, error } = await supabase
      .from('books')
      .insert(bookToInsert)
      .select();

    if (error) {
      console.error("Error creating book:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn("No data returned after creating book.");
      return null;
    }

    // Convert the returned data to BookData format
    const newBook: BookData = {
      id: data[0].id,
      title: data[0].title || '',
      author: data[0].author || '',
      price: data[0].price || 0,
      description: data[0].description || '',
      coverImage: data[0].cover_image || '',
      category: data[0].category || '',
      language: data[0].language || '',
      publisher: data[0].publisher || '',
      rating: data[0].rating || 0,
      inStock: data[0].in_stock || false,
      featured: data[0].featured || false,
      newArrival: data[0].new_arrival || false,
      bestSeller: data[0].best_seller || false,
      pages: 0, // Default value
      publication_date: '', // Default value
      isbn: '', // Default value
      stock: data[0].in_stock ? 1 : 0,
      reviews: []
    };

    return newBook;
  } catch (error) {
    console.error("Error in createBook:", error);
    return null;
  }
};

export const updateBook = async (id: string, bookData: Partial<BookData>): Promise<BookData | null> => {
  try {
    const { coverImage, publication_date, inStock, ...rest } = bookData;

    const bookToUpdate = {
      ...(rest.title !== undefined && { title: rest.title }),
      ...(rest.author !== undefined && { author: rest.author }),
      ...(rest.price !== undefined && { price: rest.price }),
      ...(rest.description !== undefined && { description: rest.description }),
      ...(coverImage !== undefined && { cover_image: coverImage }),
      ...(rest.category !== undefined && { category: rest.category }),
      ...(rest.language !== undefined && { language: rest.language }),
      ...(rest.publisher !== undefined && { publisher: rest.publisher }),
      ...(rest.rating !== undefined && { rating: rest.rating }),
      ...(inStock !== undefined && { in_stock: inStock }),
      ...(rest.featured !== undefined && { featured: rest.featured }),
      ...(rest.newArrival !== undefined && { new_arrival: rest.newArrival }),
      ...(rest.bestSeller !== undefined && { best_seller: rest.bestSeller }),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('books')
      .update(bookToUpdate)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating book:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn("No data returned after updating book.");
      return null;
    }

    // Convert the returned data to BookData format
    const updatedBook: BookData = {
      id: data[0].id,
      title: data[0].title || '',
      author: data[0].author || '',
      price: data[0].price || 0,
      description: data[0].description || '',
      coverImage: data[0].cover_image || '',
      category: data[0].category || '',
      language: data[0].language || '',
      publisher: data[0].publisher || '',
      rating: data[0].rating || 0,
      inStock: data[0].in_stock || false,
      featured: data[0].featured || false,
      newArrival: data[0].new_arrival || false,
      bestSeller: data[0].best_seller || false,
      pages: 0, // Default value
      publication_date: '', // Default value
      isbn: '', // Default value
      stock: data[0].in_stock ? 1 : 0,
      reviews: []
    };

    return updatedBook;
  } catch (error) {
    console.error("Error in updateBook:", error);
    return null;
  }
};

export const deleteBook = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting book:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteBook:", error);
    return false;
  }
};

// Add functions for Quran books management
export const createQuranBook = async (bookData: Partial<BookData>): Promise<BookData | null> => {
  try {
    const { coverImage, publication_date, inStock, ...rest } = bookData;

    const bookToInsert = {
      title: rest.title || '',
      author: rest.author || '',
      price: rest.price || 0,
      description: rest.description || '',
      cover_image: coverImage || '',
      language: rest.language || 'Arabic',
      publisher: rest.publisher || 'Unknown',
      rating: rest.rating || 5,
      in_stock: inStock !== undefined ? inStock : true,
      featured: rest.featured || false,
      new_arrival: rest.newArrival || false,
      best_seller: rest.bestSeller || false
    };

    const { data, error } = await supabase
      .from('quran_books')
      .insert(bookToInsert)
      .select();

    if (error) {
      console.error("Error creating Quran book:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn("No data returned after creating Quran book.");
      return null;
    }

    // Convert the returned data to BookData format
    const newBook: BookData = {
      id: data[0].id,
      title: data[0].title || '',
      author: data[0].author || '',
      price: data[0].price || 0,
      description: data[0].description || '',
      coverImage: data[0].cover_image || '',
      category: "Quran",
      language: data[0].language || '',
      publisher: data[0].publisher || '',
      rating: data[0].rating || 0,
      inStock: data[0].in_stock || false,
      featured: data[0].featured || false,
      newArrival: data[0].new_arrival || false,
      bestSeller: data[0].best_seller || false,
      pages: 0, // Default value
      publication_date: '', // Default value
      isbn: '', // Default value
      stock: data[0].in_stock ? 1 : 0,
      reviews: []
    };

    return newBook;
  } catch (error) {
    console.error("Error in createQuranBook:", error);
    return null;
  }
};

export const updateQuranBook = async (id: string, bookData: Partial<BookData>): Promise<BookData | null> => {
  try {
    const { coverImage, publication_date, inStock, ...rest } = bookData;

    const bookToUpdate = {
      ...(rest.title !== undefined && { title: rest.title }),
      ...(rest.author !== undefined && { author: rest.author }),
      ...(rest.price !== undefined && { price: rest.price }),
      ...(rest.description !== undefined && { description: rest.description }),
      ...(coverImage !== undefined && { cover_image: coverImage }),
      ...(rest.language !== undefined && { language: rest.language }),
      ...(rest.publisher !== undefined && { publisher: rest.publisher }),
      ...(rest.rating !== undefined && { rating: rest.rating }),
      ...(inStock !== undefined && { in_stock: inStock }),
      ...(rest.featured !== undefined && { featured: rest.featured }),
      ...(rest.newArrival !== undefined && { new_arrival: rest.newArrival }),
      ...(rest.bestSeller !== undefined && { best_seller: rest.bestSeller }),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('quran_books')
      .update(bookToUpdate)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating Quran book:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn("No data returned after updating Quran book.");
      return null;
    }

    // Convert the returned data to BookData format
    const updatedBook: BookData = {
      id: data[0].id,
      title: data[0].title || '',
      author: data[0].author || '',
      price: data[0].price || 0,
      description: data[0].description || '',
      coverImage: data[0].cover_image || '',
      category: "Quran",
      language: data[0].language || '',
      publisher: data[0].publisher || '',
      rating: data[0].rating || 0,
      inStock: data[0].in_stock || false,
      featured: data[0].featured || false,
      newArrival: data[0].new_arrival || false,
      bestSeller: data[0].best_seller || false,
      pages: 0, // Default value
      publication_date: '', // Default value
      isbn: '', // Default value
      stock: data[0].in_stock ? 1 : 0,
      reviews: []
    };

    return updatedBook;
  } catch (error) {
    console.error("Error in updateQuranBook:", error);
    return null;
  }
};

export const deleteQuranBook = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quran_books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting Quran book:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteQuranBook:", error);
    return false;
  }
};

// Function to fetch books by category
export const fetchBooksByCategory = async (categoryId: string): Promise<BookData[]> => {
  try {
    console.log(`Fetching books for category: ${categoryId}`);

    // Special case for Quran category
    if (categoryId === 'quran') {
      return await fetchQuranBooks();
    }

    // For other categories, fetch from books table
    const { data: dbBooks, error } = await supabase
      .from('books')
      .select('*')
      .ilike('category', `%${categoryId}%`);

    if (error) {
      console.error(`Error fetching books for category ${categoryId}:`, error);
      throw error;
    }

    if (!dbBooks || dbBooks.length === 0) {
      console.warn(`No books found for category ${categoryId}.`);
      return [];
    }

    // Map database books to BookData format
    const books: BookData[] = dbBooks.map(dbBook => ({
      id: dbBook.id,
      title: dbBook.title || '',
      author: dbBook.author || '',
      price: dbBook.price || 0,
      description: dbBook.description || '',
      coverImage: dbBook.cover_image || '',
      category: dbBook.category || '',
      language: dbBook.language || '',
      publisher: dbBook.publisher || '',
      rating: dbBook.rating || 0,
      inStock: dbBook.in_stock || false,
      featured: dbBook.featured || false,
      newArrival: dbBook.new_arrival || false,
      bestSeller: dbBook.best_seller || false,
      pages: 0, // Default value
      publication_date: '', // Default value
      isbn: '', // Default value
      stock: dbBook.in_stock ? 1 : 0,
      reviews: []
    }));

    return books;
  } catch (error) {
    console.error(`Error processing book data for category ${categoryId}:`, error);
    return [];
  }
};
