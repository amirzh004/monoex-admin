// Модель Legislation (Законодательство)
export class Legislation {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.file_path = data.file_path || data.file || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }
  
    static fromApiData(data) {
    return new Legislation(data);
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      file_path: this.file_path,
    };
  }
  
  validate() {
    const errors = [];
    
    if (!this.title.trim()) {
      errors.push('Название обязательно');
    }
    
    if (!this.description.trim()) {
      errors.push('Описание обязательно');
    }
    
    if (!this.file_path.trim()) {
      errors.push('Путь к файлу обязателен');
    }
    
    return errors;
  }
}

// Модель News (Новости)
export class News {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.full_text = data.full_text || '';
    this.image_path = data.image_path || '';
    this.status = data.status || 'draft';
    this.link = data.link || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }
  
    static fromApiData(data) {
    return new News(data);
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      full_text: this.full_text,
      image_path: this.image_path,
      status: this.status,
      link: this.link,
    };
  }
  
  validate() {
    const errors = [];
    
    if (!this.title.trim()) {
      errors.push('Заголовок обязателен');
    }
    
    if (!this.description.trim()) {
      errors.push('Описание обязательно');
    }
    
    if (!this.full_text.trim()) {
      errors.push('Текст новости обязателен');
    }
    
    if (!this.link.trim()) {
      errors.push('Ссылка обязательна');
    }
    
    return errors;
  }
  
  // Генерация ссылки на основе заголовка
  generateLink() {
    return this.title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s]/gi, '')
      .replace(/\s+/g, '_');
  }
}

// Модель Review (Отзывы)
export class Review {
  constructor(data = {}) {
    this.id = data.id || null;
    this.company_name = data.company_name || '';
    this.service_type = data.service_type || '';
    this.description = data.description || '';
    this.pdf_path = data.pdf_path || '';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }
  
    static fromApiData(data) {
    return new Review(data);
  }

  toJSON() {
    return {
      company_name: this.company_name,
      service_type: this.service_type,
      description: this.description,
      pdf_path: this.pdf_path,
    };
  }
  
  validate() {
    const errors = [];
    
    if (!this.company_name.trim()) {
      errors.push('Название компании обязательно');
    }
    
    if (!this.service_type.trim()) {
      errors.push('Тип услуги обязателен');
    }
    
    if (!this.description.trim()) {
      errors.push('Описание обязательно');
    }
    
    if (!this.pdf_path.trim()) {
      errors.push('Путь к PDF обязателен');
    }
    
    return errors;
  }
}

export default {
  Legislation,
  News,
  Review
};