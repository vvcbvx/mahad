class PhrasesWidget {
    constructor(options = {}) {
      this.options = {
        containerId: 'phrases-widget-root',
        triggerId: 'phrases-trigger',
        jsonUrl: 'phrases.json',
        ...options
      };
  
      // تهيئة العناصر
      this.initElements();
      // تحميل البيانات
      this.loadPhrases();
    }
  
    initElements() {
      // إنشاء العنصر الجذري إذا لم يكن موجوداً
      if (!document.getElementById(this.options.containerId)) {
        const root = document.createElement('div');
        root.id = this.options.containerId;
        document.body.appendChild(root);
      }
  
      // إنشاء أيقونة التشغيل
      if (!document.getElementById(this.options.triggerId)) {
        const trigger = document.createElement('div');
        trigger.id = this.options.triggerId;
        trigger.innerHTML = `
       <i class="fa-solid fa-book-quran fa-xl" style="color: #f7f7f8;"></i>
          <span>العبارات</span>
        `;
        document.body.appendChild(trigger);
      }
  
      // إنشاء هيكل HTML الأساسي
      const root = document.getElementById(this.options.containerId);
      root.innerHTML = `
        <div class="phrases-widget-overlay" id="phrases-overlay">
          <div class="phrases-widget-container">
            <div class="phrases-widget-header">
              <div class="logo">
                <i class="fas fa-quote-left"></i>
                <h2>العبارات الملهمة</h2>
              </div>
              <button class="close-btn" id="phrases-close-btn">&times;</button>
            </div>
            <div class="phrases-widget-content" id="phrases-content">
              <div class="loading">جاري تحميل العبارات...</div>
            </div>
          </div>
        </div>
      `;
  
      // إضافة الأنماط
      this.addStyles();
  
      // إعداد أحداث النقر
      this.setupEvents();
    }
  
    addStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* أيقونة التشغيل */
        #${this.options.triggerId} {
         position: fixed;
          top: 90%;
          right: 3%;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          z-index: 999;
          transition: all 0.3s ease;
        }
        
        #${this.options.triggerId}:hover {
          transform: scale(1.1);
        }
        
        #${this.options.triggerId} i {
          font-size: 1.5rem;
        }
        
        #${this.options.triggerId} span {
          font-size: 0.7rem;
          margin-top: 16px;
        }
        
        /* نافذة العبارات */
        .phrases-widget-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 75%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .phrases-widget-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        .phrases-widget-container {
          background-color: white;
          width: 90%;
          max-width: 800px;
          height: 80vh;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transform: translateY(20px);
          transition: all 0.3s ease;
        }
        
        .phrases-widget-overlay.active .phrases-widget-container {
          transform: translateY(0);
        }
        
        .phrases-widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
        }
        
        .phrases-widget-header .logo {
          display: flex;
          align-items: center;
        }
        
        .phrases-widget-header .logo i {
          font-size: 1.8rem;
          margin-left: 10px;
        }
        
        .phrases-widget-header .logo h2 {
          font-size: 1.3rem;
          margin: 0;
        }
        
        .phrases-widget-header .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          padding: 5px;
          line-height: 1;
        }
        
        .phrases-widget-content {
          padding: 20px;
          height: calc(100% - 65px);
          overflow-y: auto;
        }
        
        /* محتوى العبارات */
        .phrases-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .phrase-item {
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 4px solid #6a11cb;
        }
        
        .phrase-item:hover {
          background-color: #f0f0f0;
          transform: translateY(-3px);
        }
        
        .phrase-item i {
          color: #6a11cb;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }
        
        .phrase-item h3 {
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .phrase-item p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
        
        .loading, .empty-message, .error {
          text-align: center;
          padding: 50px 20px;
          color: #666;
        }
        
        .empty-message i {
          font-size: 3rem;
          color: #ccc;
          margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
          .phrases-list {
            grid-template-columns: 1fr;
          }
          
          .phrases-widget-container {
            width: 95%;
            height: 90vh;
          }
        }
      `;
      document.head.appendChild(style);
    }
  
    setupEvents() {
      // حدث النقر على أيقونة التشغيل
      document.getElementById(this.options.triggerId).addEventListener('click', () => {
        this.openWidget();
      });
      
      // حدث النقر على زر الإغلاق
      document.getElementById('phrases-close-btn').addEventListener('click', () => {
        this.closeWidget();
      });
      
      // إغلاق بالنقر خارج المحتوى
      document.getElementById('phrases-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('phrases-overlay')) {
          this.closeWidget();
        }
      });
      
      // إغلاق بالزر Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('phrases-overlay').classList.contains('active')) {
          this.closeWidget();
        }
      });
    }
  
    openWidget() {
      document.getElementById('phrases-overlay').classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  
    closeWidget() {
      document.getElementById('phrases-overlay').classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  
    loadPhrases() {
      const contentElement = document.getElementById('phrases-content');
      
      fetch(this.options.jsonUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('حدث خطأ في جلب البيانات');
          }
          return response.json();
        })
        .then(data => {
          if (data.length === 0) {
            this.showEmptyMessage();
          } else {
            this.displayPhrases(data);
          }
        })
        .catch(error => {
          this.showError(error.message);
        });
    }
  
    displayPhrases(phrases) {
      const contentElement = document.getElementById('phrases-content');
      contentElement.innerHTML = `
        <div class="phrases-list" id="phrases-list"></div>
      `;
      
      const listElement = document.getElementById('phrases-list');
      
      phrases.forEach(phrase => {
        const phraseElement = document.createElement('div');
        phraseElement.className = 'phrase-item';
        phraseElement.innerHTML = `
          <i class="${phrase.icon || 'fas fa-quote-left'}"></i>
          <h3>${phrase.title}</h3>
          <p>${phrase.text}</p>
          ${phrase.author ? `<p class="author">- ${phrase.author}</p>` : ''}
        `;
        
        listElement.appendChild(phraseElement);
      });
    }
  
    showEmptyMessage() {
      const contentElement = document.getElementById('phrases-content');
      contentElement.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-inbox"></i>
          <p>لا توجد أي عبارات متاحة حالياً</p>
        </div>
      `;
    }
  
    showError(message) {
      const contentElement = document.getElementById('phrases-content');
      contentElement.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-triangle"></i>
          <p>حدث خطأ في تحميل العبارات: ${message}</p>
        </div>
      `;
    }
  }
  
  // جعل المكون متاحاً بشكل عام
  window.PhrasesWidget = PhrasesWidget;