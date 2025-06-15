// Maximum file size (512KB)
export const MAX_FILE_SIZE = 512 * 1024;

// Allowed file types
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// Validate image file
export const validateImage = (file) => {
  if (!file) {
    return { isValid: false, error: "الرجاء اختيار ملف" };
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: "نوع الملف غير مدعوم. يرجى تحميل صورة بصيغة JPG أو PNG" 
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: "حجم الملف كبير جداً. الحد الأقصى هو 512 كيلوبايت" 
    };
  }

  return { isValid: true, error: null };
}; 