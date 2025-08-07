

function toggleSection(sectionId) {
    const content = document.getElementById(sectionId + 'Content');
    
    if (openSection && openSection !== content) {
        openSection.style.display = 'none';
    }
    
    if (content.style.display === 'flex') {
        content.style.display = 'none';
        openSection = null;
    } else {
        content.style.display = 'flex';
        openSection = content;
    }
}

function closeSection(sectionId) {
    const content = document.getElementById(sectionId + 'Content');
    content.style.display = 'none';
    openSection = null;
}

// إغلاق النافذة عند النقر خارج المحتوى
window.onclick = function(event) {
    if (event.target.classList.contains('section-content')) {
        event.target.style.display = 'none';
        openSection = null;
    }
}
let openSection = null;
const JSONBIN_API_KEY = '$2a$10$3bvwkFEhQyUebdIpUA0VT.pATBpC.x.wfgo3qFQ/e2K5cu4gdCSAG';
const BRANCHES_BIN_ID = '688329e8f7e7a370d1eda081';
const STUDENTS_BIN_ID = '688322e77b4b8670d8a700c5';
let currentGrade = '';
let branchesData = [];
let studentsData = [];
let currentBranch = null;
let currentExams = [];
let currentFilter = 'all';
let currentSubjectFilter = 'all';
let currentQuizzes = []; // أضف هذا هنا
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizResults = null;

const JSONBIN_API_KEYS = {
    EXAMS: {
        BIN_ID: '6891f6f0ae596e708fc21e60',
        API_KEY: '$2a$10$3bvwkFEhQyUebdIpUA0VT.pATBpC.x.wfgo3qFQ/e2K5cu4gdCSAG'
    }
};

const QUIZZES_BIN_ID = '6891f6f0ae596e708fc21e60';
const QUIZZES_API_KEY = '$2a$10$3bvwkFEhQyUebdIpUA0VT.pATBpC.x.wfgo3qFQ/e2K5cu4gdCSAG';

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const themeToggle = document.getElementById('themeToggle');
    const isDark = document.body.classList.contains('dark-mode');
    
    themeToggle.innerHTML = isDark 
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// تحميل الوضع المحفوظ
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// تشغيل عند التحميل
window.addEventListener('load', () => {
    loadTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
});









        // Sample data for branches and students
       
        // Current selected grade and branch
       

        // Show branches for selected grade
       
        // Show details for selected branch
     

        // Back to grades selection
        function backToGrades() {
            hideAllSections();
            document.getElementById('grades').style.display = 'block';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Back to branches list
        function backToBranches() {
            hideAllSections();
            document.getElementById('branchesSection').style.display = 'block';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Show/Hide sections functions
        function hideAllSections() {
           
            document.getElementById('home').style.display = 'none';
            document.getElementById('grades').style.display = 'none';
            document.getElementById('branchesSection').style.display = 'none';
            document.getElementById('branchDetails').style.display = 'none';
            document.getElementById('about').style.display = 'none';
            document.getElementById('contact').style.display = 'none';
            document.getElementById('teachers').style.display = 'none';
            document.getElementById('exams').style.display = 'none';
            document.getElementById('zr').style.display = 'none';
            document.getElementById('showFees').style.display = 'none';
            

        }

        function showHome() {
            hideAllSections();
            document.getElementById('home').style.display = 'flex';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeSidebar();

            document.getElementById("qou").style.display="block";

        }

        function showGrades() {
            hideAllSections();
            document.getElementById('grades').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeSidebar();
        }

        function showAbout() {
            hideAllSections();
            document.getElementById('about').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeSidebar();
        }

        function showContact() {
            hideAllSections();
            document.getElementById('contact').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeSidebar();
        }

        // Mobile Menu Toggle
        const menuBtn = document.getElementById('menuBtn');
        const closeBtn = document.getElementById('closeBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        function openSidebar() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        menuBtn.addEventListener('click', openSidebar);
        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        // Telegram Bot Integration
        const messageForm = document.getElementById('messageForm');
        const formMessage = document.getElementById('form-message');

        messageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;
            
            if (!name || !message) {
                formMessage.textContent = 'الرجاء تعبئة جميع الحقول';
                formMessage.style.color = 'red';
                return;
            }
            
            const telegramBotToken = '7388387809:AAHgsBR0z-avEVjjN2boGyXXwO2TR_T7hXA';
const chatId = '6068899411';

            const text = `رسالة جديدة من موقع المعهد:\nالاسم: ${name}\nالرسالة: ${message}`;
            
            try {
                const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: text
                    })
                });
                
                const result = await response.json();
                
                if (result.ok) {
                    formMessage.textContent = 'تم إرسال رسالتك بنجاح!';
                    formMessage.style.color = 'green';
                    messageForm.reset();
                } else {
                    formMessage.textContent = 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً';
                    formMessage.style.color = 'red';
                }
            } catch (error) {
                formMessage.textContent = 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً';
                formMessage.style.color = 'red';
                console.error('Error:', error);
            }
        });

// JavaScript

const courses = [
    {
        name: "دفعة الصف التاسع الجديدة",
        startDate: new Date('2024-09-15'),
        fees: { SYP: 380000, USD: 420 },
        duration: "6 أشهر",
        code: "T9-2024"
    },
    {
        name: "تحضير البكالوريا المكثف",
        startDate: new Date('2024-10-01'),
        fees: { SYP: 450000, USD: 500 },
        duration: "8 أشهر",
        code: "BAC-2024"
    }
];

// إنشاء بطاقات التسجيل
function createRegistrationCards() {
    const container = document.querySelector('.registration-cards');
    
    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'registration-card';
        card.innerHTML = `
            <div class="course-header">
                <h4>${course.name}</h4>
                <span class="course-code">${course.code}</span>
            </div>
            
            <div class="countdown-timer" data-start="${course.startDate.toISOString()}">
                <div class="timer-item">
                    <div class="timer-number days">00</div>
                    <div class="timer-label">أيام</div>
                </div>
                <div class="timer-item">
                    <div class="timer-number hours">00</div>
                    <div class="timer-label">ساعات</div>
                </div>
                <div class="timer-item">
                    <div class="timer-number minutes">00</div>
                    <div class="timer-label">دقائق</div>
                </div>
            </div>
            
            <div class="registration-details">
                <p><i class="fas fa-calendar-day"></i> تاريخ البدء: ${course.startDate.toLocaleDateString()}</p>
                <p><i class="fas fa-clock"></i> المدة: ${course.duration}</p>
                <div class="course-fees">
                    <span>الرسوم: </span>
                    <span class="fee">${course.fees.SYP.toLocaleString()} ل.س</span>
                    <span class="fee-separator">|</span>
                    <span class="fee">${course.fees.USD}$</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    startAllTimers();
}

// تشغيل العدادات
function startAllTimers() {
    document.querySelectorAll('.countdown-timer').forEach(timer => {
        const startDate = new Date(timer.dataset.start);
        updateTimer(timer, startDate);
        setInterval(() => updateTimer(timer, startDate), 1000);
    });
}

// تحديث العداد
function updateTimer(timerElement, endDate) {
    const now = new Date();
    const diff = endDate - now;

    if (diff < 0) {
        timerElement.innerHTML = '<div class="timer-ended">بدأت الدورة!</div>';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    timerElement.querySelector('.days').textContent = days.toString().padStart(2, '0');
    timerElement.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
    timerElement.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
}
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("تعرف على معهد بالعلم نرتقي - أفضل معهد تعليمي في دير الزور");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("أنصحك بزيارة موقع معهد بالعلم نرتقي:\n");
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
}

function shareOnTelegram() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://t.me/share/url?url=${url}&text=${title}`, '_blank');
}




// تهيئة عند تحميل الصفحة
window.addEventListener('load', () => {
    createRegistrationCards();
    // ... تهيئات أخرى
});



// تفعيل النقر على بطاقات الواتساب
document.querySelectorAll('.whatsapp-card').forEach(card => {
    card.addEventListener('click', function() {
        const number = this.dataset.number;
        const message = encodeURIComponent("مرحبًا، أود الاستفسار عن:");
        window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    });
});



function openGoogleMaps() {
    // إحداثيات الموقع (يمكن استبدالها بالإحداثيات الفعلية)
    const lat =34.782492186987284 ;
    const lng =  40.72231824491115;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    
    window.open(url, '_blank');
}





// بيانات المعلمين


// عرض قائمة المعلمين

// إغلاق النافذة
function closeTeacherModal() {
    document.getElementById('teacherModal').style.display = 'none';
}

// إغلاق النافذة عند النقر خارجها
window.onclick = function(event) {
    const modal = document.getElementById('teacherModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// تحديث دالة hideAllSections

window.addEventListener('load', () => {
    let progress = 0;
    const progressText = document.querySelector('.progress-text');
    const loader = document.getElementById('loader');
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 300);
        }
        progressText.textContent = Math.min(progress, 100).toFixed(0) + '%';
    }, 200);
});


// دالة خارجية لربط حدث الإغلاق
function setupCloseButton(buttonId, overlayId) {
    const closeBtn = document.getElementById(buttonId);
    const overlay = document.getElementById(overlayId);
    
    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }
}

// استدعاء الدالة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    setupCloseButton('closeFees', 'feesOverlay');
    
    // بقية الكود...
    const showFeesBtn = document.getElementById('showFees');
    const feesOverlay = document.getElementById('feesOverlay');
    
    showFeesBtn.addEventListener('click', () => {
        feesOverlay.style.display = 'flex';
    });

    feesOverlay.addEventListener('click', (e) => {
        if(e.target === feesOverlay) {
            feesOverlay.style.display = 'none';
        }
    });
});


document.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)';
    });
  });
  
  // تأثير للرسالة المخفية
  const hiddenMessage = document.querySelector('.hidden-message');
  hiddenMessage.addEventListener('click', function() {
    this.querySelector('.flower-decoration').style.animation = 'fadeInOut 2s';
    setTimeout(() => {
      this.querySelector('.flower-decoration').style.animation = '';
    }, 2000);
  });
  
  // إضافة حركة بسيطة للزهرة
  const style = document.createElement('style');
  style.innerHTML = `
  @keyframes fadeInOut {
    0% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.2); }
    100% { opacity: 0.1; transform: scale(1); }
  }
  `;
  document.head.appendChild(style);




  document.addEventListener('DOMContentLoaded', function() {
    // تحسين أداء التحميل
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10 + 5;
        if(progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').classList.add('hidden');
            }, 500);
        }
        document.querySelector('.progress-text').textContent = Math.floor(progress) + '%';
    }, 100);

    // تحسين عرض الصور
    document.querySelectorAll('img').forEach(img => {
        if(!img.getAttribute('src')) {
            img.style.display = 'none';
        } else {
            img.loading = 'lazy';
        }
    });

    // تحسين الأداء للهواتف
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('mobile-device');
        // تعطيل بعض التأثيرات على الهواتف
        document.querySelectorAll('.home-icon').forEach(icon => {
            icon.style.transition = 'none';
        });
    }
});


let currentPdf = null;
let currentPage = 1;
let totalPages = 1;










// Exams Section
// متغيرات النظام

// عرض قسم الامتحانات وإخفاء الأقسام الأخرى
function showExams() {
    hideAllSections();
    document.getElementById('exams').style.display = 'block';
    loadExams();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
}

// إخفاء جميع الأقسام

// تحميل بيانات الامتحانات من ملف JSON
// تحميل بيانات الامتحانات من JSONBin.io
async function loadExams() {
    try {
        const binId = '688323717b4b8670d8a70100'; // استبدل بمعرف الـ Bin الخاص بك
        const apiKey = '$2a$10$3bvwkFEhQyUebdIpUA0VT.pATBpC.x.wfgo3qFQ/e2K5cu4gdCSAG'; // استبدل بمفتاح API الخاص بك
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            headers: {
                'X-Master-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch exams');
        }
        
        const data = await response.json();
        currentExams = data.record.exams; // تأكد من أن هيكل البيانات متطابق
        
        renderExams();
        setupFilterButtons();
    } catch (error) {
        console.error('Error loading exams:', error);
        document.getElementById('examsContainer').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل الامتحانات، يرجى المحاولة لاحقاً</p>
            </div>
        `;
    }
}

// عرض الامتحانات في الواجهة

// الحصول على اسم المادة من الكود
function getSubjectName(subjectCode) {
    const subjects = {
        'math': 'الرياضيات',
        'science': 'العلوم',
        'arabic': 'العربية',
        'english': 'الإنجليزية',
        'french': 'الفرنسية',
        'social': 'الاجتماعيات',
        'religion': 'الديانة'
    };
    return subjects[subjectCode] || subjectCode;
}

// تنسيق التاريخ
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

// إعداد أزرار الفلترة
function setupFilterButtons() {
    // فلتر الصفوف (الكل، تاسع، بكالوريا)
    document.querySelectorAll('.exams-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.exams-filter .active').classList.remove('active');
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            
            // إظهار/إخفاء فلتر المواد بناءً على الاختيار
            const subjectFilter = document.getElementById('subjectFilter');
            if (currentFilter === 'all') {
                subjectFilter.style.display = 'none';
                currentSubjectFilter = 'all';
            } else {
                subjectFilter.style.display = 'flex';
            }
            
            filterExams();
        });
    });
    
    // فلتر المواد
    document.querySelectorAll('.subject-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.subject-filter .active')?.classList.remove('active');
            this.classList.add('active');
            currentSubjectFilter = this.dataset.filter;
            filterExams();
        });
    });
}

// تطبيق الفلترة على الامتحانات
function filterExams() {
    let filtered = [...currentExams];
    
    // تطبيق فلتر الصف
    if (currentFilter !== 'all') {
        filtered = filtered.filter(exam => exam.grade === currentFilter);
    }
    
    // تطبيق فلتر المادة إذا لم يكن 'كل المواد'
    if (currentSubjectFilter !== 'all' && currentFilter !== 'all') {
        filtered = filtered.filter(exam => exam.subject === currentSubjectFilter);
    }
    
    renderExams(filtered);
}

// إغلاق القائمة الجانبية (إذا كانت موجودة)

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // يمكنك إضافة أي تهيئة إضافية هنا إذا لزم الأمر
});
// دالة تحميل PDF


// دالة عرض الصفحة



function showTeacherDetails(teacher) {
    document.getElementById('modalAvatar').src = teacher.avatar || 'default-teacher.jpg';
    document.getElementById('modalName').textContent = teacher.name;
    document.getElementById('modalSubject').textContent = getSubjectName(teacher.subject) + " - " + teacher.specialization;
    document.getElementById('modalCertificates').textContent = teacher.certificates;
    document.getElementById('modalExperience').textContent = teacher.experience;
    document.getElementById('modalLectures').textContent = teacher.lectures;
    document.getElementById('modalBio').textContent = teacher.bio;
    
    // إعداد روابط التواصل
    const whatsappBtn = document.getElementById('modalWhatsapp');
    whatsappBtn.href = `https://wa.me/${teacher.contact.whatsapp}`;
    
    const phoneBtn = document.getElementById('modalPhone');
    phoneBtn.href = `tel:${teacher.contact.phone}`;
    
    document.getElementById('teacherModal').style.display = 'block';
}

// إغلاق نافذة المعلم
function closeTeacherModal() {
    document.getElementById('teacherModal').style.display = 'none';
}

// إعداد فلاتر المعلمين
function setupTeacherFilters() {
    document.querySelectorAll('.teachers-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.teachers-filter .active').classList.remove('active');
            this.classList.add('active');
            filterTeachers(this.dataset.filter);
        });
    });
}

// تصفية المعلمين حسب المادة
function filterTeachers(subject) {
    const container = document.getElementById('teachersContainer');
    container.innerHTML = '';
    
    const filteredTeachers = subject === 'all' 
        ? teachersData 
        : teachersData.filter(teacher => teacher.subject === subject);
    
    if (filteredTeachers.length === 0) {
        container.innerHTML = `
            <div class="no-teachers">
                <i class="fas fa-chalkboard-teacher"></i>
                <p>لا يوجد معلمون متاحون لهذه المادة حالياً</p>
            </div>
        `;
        return;
    }
    
    filteredTeachers.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.innerHTML = `
            <div class="teacher-avatar-container">
                <img src="${teacher.avatar || 'default-teacher.jpg'}" class="teacher-avatar" alt="${teacher.name}">
            </div>
            <div class="teacher-info-container">
                <h3 class="teacher-name">${teacher.name}</h3>
                <p class="teacher-subject">${getSubjectName(teacher.subject)}</p>
                <div class="teacher-meta">
                    <span><i class="fas fa-briefcase"></i> ${teacher.experience}</span>
                    <span><i class="fas fa-book-open"></i> ${teacher.lectures}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => showTeacherDetails(teacher));
        container.appendChild(card);
    });
}

// مساعدة: تحويل كود المادة إلى اسم
function getSubjectName(subjectCode) {
    const subjects = {
        'math': 'الرياضيات',
        'science': 'العلوم',
        'arabic': 'اللغة العربية',
        'english': 'الإنجليزية',
        'social': 'الاجتماعيات'
    };
    return subjects[subjectCode] || subjectCode;
}


async function showTeachers() {
    hideAllSections();
    const container = document.getElementById('teachersContainer');
    container.innerHTML = '<div class="loading-teachers">جاري تحميل بيانات المعلمين...</div>';
    
    try {
        const binId = '6883234cae596e708fbb6a7b';
        const apiKey = 'YOUR_API_KEY';
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            headers: {
                'X-Master-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch teachers');
        
        const data = await response.json();
        const teachers = data.record.teachers;
        
        renderTeachers(teachers);
        setupTeacherFilters();
        
    } catch (error) {
        console.error('Error loading teachers:', error);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل بيانات المعلمين</p>
            </div>
        `;
    }
    
    document.getElementById('teachers').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
}



// دالة عامة لتحميل البيانات من JSONBin
async function loadJsonData(binId) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        return data.record;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// دالة لتحميل بيانات الشعب
async function loadBranches(grade) {
    try {
        // عرض مؤشر التحميل
        document.getElementById('branchCards').innerHTML = `
            <div class="loading-branches">
                <div class="loader"></div>
                <p>جاري تحميل الشعب...</p>
            </div>
        `;
        
        const data = await loadJsonData(BRANCHES_BIN_ID);
        if (!data || !data.branches) throw new Error('No branches data');
        
        branchesData = data.branches.filter(branch => branch.grade === grade);
        renderBranches(grade);
    } catch (error) {
        console.error('Error loading branches:', error);
        document.getElementById('branchCards').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل الشعب. يرجى المحاولة لاحقاً</p>
            </div>
        `;
    }
}

// دالة لتحميل بيانات الطلاب
async function loadStudents(branchId) {
    try {
        // عرض مؤشر التحميل
        document.getElementById('studentsTableBody').innerHTML = `
            <tr class="loading-students">
                <td colspan="4">
                    <div class="loader small"></div>
                    <p>جاري تحميل قائمة الطلاب...</p>
                </td>
            </tr>
        `;
        
        document.getElementById('topStudents').innerHTML = `
            <div class="loading-students">
                <div class="loader small"></div>
                <p>جاري تحميل الطلاب المميزين...</p>
            </div>
        `;
        
        const data = await loadJsonData(STUDENTS_BIN_ID);
        if (!data || !data.students) throw new Error('No students data');
        
        studentsData = data.students.filter(student => student.branchId === branchId);
        renderBranchDetails(currentBranch);
    } catch (error) {
        console.error('Error loading students:', error);
        document.getElementById('studentsTableBody').innerHTML = `
            <tr class="error-message">
                <td colspan="4">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>حدث خطأ في تحميل الطلاب. يرجى المحاولة لاحقاً</p>
                </td>
            </tr>
        `;
        
        document.getElementById('topStudents').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل الطلاب المميزين</p>
            </div>
        `;
    }
}

// عرض الشعب حسب المرحلة
function showBranches(grade) {
    currentGrade = grade;
    hideAllSections();
    document.getElementById('branchesSection').style.display = 'block';
    document.getElementById('branchesTitle').textContent = `شعب ${grade === 'تاسع' ? 'الصف التاسع' : 'مرحلة البكالوريا'}`;
    loadBranches(grade);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
}

// عرض قائمة الشعب

// عرض تفاصيل الشعبة

// عرض تفاصيل الطلاب

// العودة لقائمة المراحل
function backToGrades() {
    hideAllSections();
    document.getElementById('grades').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// العودة لقائمة الشعب
function backToBranches() {
    hideAllSections();
    document.getElementById('branchesSection').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// إخفاء جميع الأقسام
function hideAllSections() {
    const sections = [
        'home', 'grades', 'branchesSection', 
        'branchDetails', 'about', 'contact', 
        'developer', 'teachers', 'exams'
    ];
    
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
}
// في مكان القائمة (قبل تحميل الصفحة)
function updateNavForAuth() {
    const user = localStorage.getItem('savedUser');
    const dashboardLink = document.querySelector('.nav-item .nav-link[href="dashboard.html"]');
    
    if (user) {
        // إذا كان مسجل دخول
        dashboardLink.innerHTML = `
            <i class="fas fa-tachometer-alt"></i>
            <span>لوحتي</span>
        `;
    } else {
        // إذا لم يكن مسجل دخول
        dashboardLink.innerHTML = `
            <i class="fas fa-tachometer-alt"></i>
            <span>تسجيل الدخول</span>
        `;
    }
}

// استدعاء الدالة عند تحميل الصفحة
window.addEventListener('load', updateNavForAuth);

// في ملف script.js
document.querySelectorAll('a[href="dashboard.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const user = localStorage.getItem('savedUser');
        
        if (!user) {
            e.preventDefault();
            showLoader();
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    });
});

function showLoader() {
    // يمكنك إضافة شاشة تحميل مؤقتة هنا
    document.body.innerHTML += `
        <div id="page-loader" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; display:flex; justify-content:center; align-items:center;">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">جاري التحميل...</span>
            </div>
        </div>
    `;
}
        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            showHome();
        });


        async function showTeachers() {
            hideAllSections();
            document.getElementById('teachers').style.display = 'block';
            
            const container = document.getElementById('teachersContainer');
            const loader = document.getElementById('teachersLoader');
            
            // إظهار مؤشر التحميل
            loader.style.display = 'flex';
            container.innerHTML = '<div class="loading-teachers">جاري تحميل بيانات المعلمين...</div>';
            
            try {
                const binId = '6883234cae596e708fbb6a7b'; // استبدل بمعرف الـ Bin الخاص بك
                const apiKey = '$2a$10$3bvwkFEhQyUebdIpUA0VT.pATBpC.x.wfgo3qFQ/e2K5cu4gdCSAG'; // استبدل بمفتاح API الخاص بك
                
                const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
                    headers: {
                        'X-Master-Key': apiKey,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch teachers');
                
                const data = await response.json();
                const teachers = data.record.teachers;
                
                if (!teachers || teachers.length === 0) {
                    throw new Error('No teachers data available');
                }
                
                renderTeachers(teachers);
                setupTeacherFilters();
                
            } catch (error) {
                console.error('Error loading teachers:', error);
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>حدث خطأ في تحميل بيانات المعلمين. يرجى المحاولة لاحقاً</p>
                        <button onclick="showTeachers()" class="retry-btn">إعادة المحاولة</button>
                    </div>
                `;
            } finally {
                // إخفاء مؤشر التحميل في كل الحالات
                loader.style.display = 'none';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeSidebar();
            }
        }
        function renderTeachers(teachers) {
            const container = document.getElementById('teachersContainer');
            container.innerHTML = '';
            
            teachers.forEach(teacher => {
                const card = document.createElement('div');
                card.className = 'teacher-card';
                card.innerHTML = `
                    <div class="teacher-avatar-container">
                        <img src="${teacher.avatar || 'default-teacher.jpg'}" class="teacher-avatar" alt="${teacher.name}">
                    </div>
                    <div class="teacher-info-container">
                        <h3 class="teacher-name">${teacher.name}</h3>
                        <p class="teacher-subject">${getSubjectName(teacher.subject)}</p>
                        <div class="teacher-meta">
                            <span><i class="fas fa-briefcase"></i> ${teacher.experience}</span>
                            <span><i class="fas fa-book-open"></i> ${teacher.lectures}</span>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => showTeacherDetails(teacher));
                container.appendChild(card);
            });
        }







        async function loadExams() {
            const container = document.getElementById('examsContainer');
            const loader = document.getElementById('examsLoader');
            
            // إظهار مؤشر التحميل
            loader.style.display = 'flex';
            container.innerHTML = '';
            
            try {
                const binId = '688323717b4b8670d8a70100';
                const apiKey = '$2a$10$3bvwkFEhQyUebdIpUA0VT.pATBpC.x.wfgo3qFQ/e2K5cu4gdCSAG';
                
                const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
                    headers: {
                        'X-Master-Key': apiKey,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch exams');
                
                const data = await response.json();
                currentExams = data.record.exams;
                
                if (!currentExams || currentExams.length === 0) {
                    throw new Error('No exams available');
                }
                
                renderExams();
                setupFilterButtons();
                
            } catch (error) {
                console.error('Error loading exams:', error);
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>حدث خطأ في تحميل الامتحانات. يرجى المحاولة لاحقاً</p>
                        <button onclick="loadExams()" class="retry-btn">إعادة المحاولة</button>
                    </div>
                `;
            } finally {
                // إخفاء مؤشر التحميل في كل الحالات
                loader.style.display = 'none';
            }
        }

       // في script.js - إضافة هذه الأكواد لقسم المطور
function initDeveloperSection() {
    // مخطط المهارات
    const ctx = document.getElementById('skillsChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['HTML/CSS', 'JavaScript', 'Python', 'قواعد البيانات', 'UI/UX', 'الأمان'],
            datasets: [{
                label: 'مستوى المهارة',
                data: [95, 85, 80, 75, 90, 70],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    // تأثير العد للإنجازات
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target;
        }
    });

    // تأثيرات خاصة للبطاقات
    document.querySelectorAll('.philosophy-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });

    // عرض الأدوات عند التمرير
    document.querySelectorAll('.tech-badge').forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tech-tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            this.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }, 10);
        });
        
        badge.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tech-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// استدعاء الدالة عند تحميل الصفحة
window.addEventListener('load', () => {
    if (document.getElementById('developer').style.display === 'block') {
        initDeveloperSection();
    }
}); 
// دالة لعرض قسم المطور
function showDeveloper() {
    hideAllSections();
    document.getElementById('developer').style.display = 'block';
    initDeveloperSection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
}

// دالة لتهيئة قسم المطور
function initDeveloperSection() {
    // تأثير تحميل شريط المهارات
    document.querySelectorAll('.skill-level').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });

    // تأثيرات عند التمرير
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item, .project-card').forEach(el => {
        observer.observe(el);
    });
}

// تأكد من إضافة قسم المطور إلى دالة hideAllSections



// دالة لعرض قسم المطور

// دالة لتهيئة قسم المطور
function initDeveloperSection() {
    // تأثير تحميل شريط المهارات
    document.querySelectorAll('.skill-level').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });

    // تأثير العد للإحصائيات
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            stat.textContent = Math.floor(current);
        }, 10);
    });

    // تأثيرات عند التمرير
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}




function renderExams(filteredExams = null) {
    const examsToRender = filteredExams || currentExams;
    const container = document.getElementById('examsContainer');
    
    if (examsToRender.length === 0) {
        container.innerHTML = `
            <div class="no-exams">
                <i class="fas fa-file-circle-question"></i>
                <p>لا توجد امتحانات متاحة لهذا التصنيف</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    examsToRender.forEach(exam => {
        const examCard = document.createElement('div');
        examCard.className = 'exam-card';
        
        const gradeName = exam.grade === 't9' ? 'تاسع' : 'بكالوريا';
        const subjectName = getSubjectName(exam.subject);
        const fileName = exam.originalFileName || exam.file;

        examCard.innerHTML = `
            <div class="exam-header">
                <h3>${exam.title}</h3>
                <span class="exam-badge">${gradeName}</span>
            </div>
            <div class="exam-body">
                <div class="exam-file-info">
                    <i class="fas fa-file-pdf"></i>
                    <span>${fileName}</span>
                </div>
                <div class="exam-meta">
                    <span><i class="fas fa-book"></i> ${subjectName}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(exam.publishDate)}</span>
                </div>
                <div class="exam-meta">
                    <span><i class="fas fa-download"></i> ${exam.downloads || 0} تحميل</span>
                    <span><i class="fas fa-user"></i> ${exam.publisher}</span>
                </div>
                <div class="exam-actions">
                    <button onclick="downloadExam('${exam.id}', '${fileName}')" class="exam-download">
                        <i class="fas fa-download"></i> تحميل
                    </button>
                    <button onclick="viewExam('${exam.id}')" class="exam-view">
                        <i class="fas fa-eye"></i> عرض
                    </button>
                </div>
            </div>
        `;

        container.appendChild(examCard);
    });
}

async function downloadExam(id, fileName) {
    const exam = currentExams.find(e => e.id === id);
    if (!exam) return;

    try {
        // زيادة عدد التحميلات
        exam.downloads = (exam.downloads || 0) + 1;
        
        // تحديث البيانات على الخادم
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.EXAMS.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.EXAMS.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ exams: currentExams })
        });
        
        if (!response.ok) throw new Error('Failed to update downloads count');
        
        // بدء التحميل
        const link = document.createElement('a');
        link.href = exam.downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error('Error downloading exam:', error);
        alert('حدث خطأ أثناء تحميل الامتحان. يرجى المحاولة لاحقاً');
    }
}

function viewExam(id) {
    const exam = currentExams.find(e => e.id === id);
    if (!exam) return;

    const modal = document.createElement('div');
    modal.className = 'exam-modal';
    modal.innerHTML = `
        <div class="exam-modal-content">
            <div class="exam-modal-header">
                <h3>${exam.title}</h3>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="exam-modal-body">
                <iframe src="https://docs.google.com/gview?url=${encodeURIComponent(exam.downloadUrl)}&embedded=true" 
                        style="width:100%; height:80vh;" frameborder="0"></iframe>
            </div>
            <div class="exam-modal-footer">
                <button onclick="downloadExam('${exam.id}', '${exam.originalFileName || exam.file}')" class="btn btn-download">
                    <i class="fas fa-download"></i> تحميل الملف
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function showBranches(grade) {
    currentGrade = grade;
    hideAllSections();
    document.getElementById('branchesSection').style.display = 'block';
    document.getElementById('branchesTitle').textContent = `شعب ${grade === 'تاسع' ? 'الصف التاسع' : 'مرحلة البكالوريا'}`;
    
    try {
        // عرض مؤشر تحميل
        document.getElementById('branchCards').innerHTML = `
            <div class="loading-branches">
                <div class="loader"></div>
                <p>جاري تحميل الشعب...</p>
            </div>
        `;
        
        // جلب البيانات من JSONBin
        const data = await loadJsonData(BRANCHES_BIN_ID);
        if (!data || !data.branches) throw new Error('No branches data');
        
        branchesData = data.branches.filter(branch => branch.grade === (grade === 'تاسع' ? 't9' : 'bac'));
        renderBranches(grade);
    } catch (error) {
        console.error('Error loading branches:', error);
        document.getElementById('branchCards').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل الشعب. يرجى المحاولة لاحقاً</p>
            </div>
        `;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
}


function renderBranches(grade) {
    const container = document.getElementById('branchCards');
    
    if (!branchesData || branchesData.length === 0) {
        container.innerHTML = `
            <div class="no-branches">
                <i class="fas fa-book"></i>
                <p>لا توجد شعب متاحة لهذه المرحلة حالياً</p>
                <button onclick="showGrades()" class="btn">العودة للمراحل</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    branchesData.forEach(branch => {
        const branchCard = document.createElement('div');
        branchCard.className = `branch-card ${branch.isActive ? '' : 'unavailable'}`;
        branchCard.onclick = branch.isActive ? () => showBranchDetails(branch) : null;
        
        branchCard.innerHTML = `
            <div class="branch-card-header">
                <h3>${branch.name}</h3>
                <p>${branch.shortDesc || branch.description || 'لا يوجد وصف'}</p>
                ${!branch.isActive ? '<span class="unavailable-badge">غير متاح</span>' : ''}
                
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${branch.completionRate}%"></div>
                </div>
            </div>
            <div class="branch-card-body">
                <div class="branch-info">
                    <div class="branch-info-item">
                        <i class="fas fa-users"></i>
                        <span>الطلاب</span>
                        <strong>${branch.studentsCount}</strong>
                    </div>
                    <div class="branch-info-item">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <span>المعلم</span>
                        <strong>${branch.teacher}</strong>
                    </div>
                    <div class="branch-info-item">
                        <i class="fas fa-percentage"></i>
                        <span>الإكتمال</span>
                        <strong>${branch.completionRate}%</strong>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(branchCard);
    });
}



function renderBranchDetails(branch) {
    const students = branch.students || [];
    
    // تحسين عرض الطلاب المميزين
    const topStudentsContainer = document.getElementById('topStudents');
    topStudentsContainer.innerHTML = '';
    
    if (students.length === 0) {
        topStudentsContainer.innerHTML = `
            <div class="no-students">
                <i class="fas fa-user-graduate"></i>
                <h4>لا يوجد طلاب مسجلين</h4>
                <p>لم يتم تسجيل أي طلاب في هذه الشعبة بعد</p>
            </div>
        `;
        
        document.getElementById('studentsTableBody').innerHTML = `
            <tr class="no-students">
                <td colspan="4">
                    <div class="mobile-no-students">
                        <i class="fas fa-user-graduate"></i>
                        <p>لا يوجد طلاب مسجلين</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // عرض أفضل 3 طلاب (معدل ترتيبي)
    const topStudents = [...students]
        .sort((a, b) => b.average - a.average)
        .slice(0, 3);
    
    topStudents.forEach((student, index) => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
            <div class="student-rank rank-${index + 1}">
                ${index + 1}
            </div>
            <div class="student-avatar-container">
                <img src="${student.avatar || 'default-avatar.jpg'}" 
                     alt="${student.name}" 
                     class="student-avatar">
            </div>
            <div class="student-info">
                <h4 class="student-name">${student.name}</h4>
                <div class="student-stats">
                    <div class="stat-item">
                        <i class="fas fa-percentage"></i>
                        <span>${student.average}%</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-calendar-check"></i>
                        <span>${student.attendance}%</span>
                    </div>
                </div>
                <p class="student-achievements">
                    ${student.achievements || 'لا توجد إنجازات مسجلة'}
                </p>
            </div>
        `;
        topStudentsContainer.appendChild(studentCard);
    });
    
    // تحسين جدول الطلاب للهواتف
    const studentsTableBody = document.getElementById('studentsTableBody');
    studentsTableBody.innerHTML = '';
    
    students.forEach(student => {
        // صف للشاشات الكبيرة
        const row = document.createElement('tr');
        row.className = 'desktop-row';
        row.innerHTML = `
            <td>
                <div class="student-info">
                    <img src="${student.avatar || 'default-avatar.jpg'}" 
                         alt="${student.name}" 
                         class="student-avatar-small">
                    ${student.name}
                </div>
            </td>
            <td>${student.average}%</td>
            <td>${student.attendance}%</td>
            <td>${student.achievements || '-'}</td>
        `;
        studentsTableBody.appendChild(row);
        
        // صف للهواتف
        const mobileRow = document.createElement('tr');
        mobileRow.className = 'mobile-row';
        mobileRow.innerHTML = `
            <td colspan="4">
                <div class="mobile-student-card">
                    <div class="mobile-student-header">
                        <img src="${student.avatar || 'default-avatar.jpg'}" 
                             alt="${student.name}" 
                             class="mobile-student-avatar">
                        <h4>${student.name}</h4>
                    </div>
                    <div class="mobile-student-stats">
                        <div class="stat-item">
                            <span>المعدل:</span>
                            <strong>${student.average}%</strong>
                        </div>
                        <div class="stat-item">
                            <span>الحضور:</span>
                            <strong>${student.attendance}%</strong>
                        </div>
                    </div>
                    <div class="mobile-student-achievements">
                        <span>الإنجازات:</span>
                        <p>${student.achievements || '-'}</p>
                    </div>
                </div>
            </td>
        `;
        studentsTableBody.appendChild(mobileRow);
    });
}






// دالة لعرض تفاصيل الشعبة مع تحسينات للهواتف


// دالة لعرض الطلاب المميزين


// CSS الإضافي المطلوب


async function fetchStudents() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${STUDENTS_BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const data = await response.json();
        return data.record.students || [];
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}


async function showBranchDetails(branch) {
    currentBranch = branch;
    hideAllSections();
    document.getElementById('branchDetails').style.display = 'block';
    
    // تحديث معلومات الشعبة الأساسية
    document.getElementById('branchDetailTitle').textContent = `${branch.name} - ${currentGrade === 'تاسع' ? 'الصف التاسع' : 'البكالوريا'}`;
    document.getElementById('branchDetailDesc').textContent = branch.description || 'لا يوجد وصف متاح';
    document.getElementById('studentsCount').textContent = branch.studentsCount || 0;
    document.getElementById('startDate').textContent = branch.startDate || 'غير محدد';
    document.getElementById('completionRate').textContent = `${branch.completionRate || 0}%`;
    document.getElementById('averageGrade').textContent = `${branch.averageGrade || 0}%`;
    document.getElementById('branchProgress').style.width = `${branch.completionRate || 0}%`;

    try {
        // جلب بيانات الطلاب
        const students = await fetchStudents();
        const branchStudents = students.filter(s => s.branchId === branch.id);
        
        // عرض الطلاب المميزين
        renderDistinguishedStudents(branchStudents);
        
        // عرض جميع الطلاب
        renderAllStudents(branchStudents);
        
    } catch (error) {
        console.error('Error loading students:', error);
        
        // عرض رسالة خطأ للطلاب المميزين
        document.getElementById('topStudents').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل الطلاب المميزين</p>
            </div>
        `;
        
        // عرض رسالة خطأ لجدول الطلاب
        document.getElementById('studentsTableBody').innerHTML = `
            <tr class="error-message">
                <td colspan="4">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>حدث خطأ في تحميل قائمة الطلاب</p>
                </td>
            </tr>
        `;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function renderDistinguishedStudents(students) {
    const topStudentsContainer = document.getElementById('topStudents');
    const distinguishedStudents = students.filter(s => s.isDistinguished);
    
    if (distinguishedStudents.length === 0) {
        topStudentsContainer.innerHTML = `
            <div class="no-distinguished">
                <i class="fas fa-star"></i>
                <h4>لا يوجد طلاب مميزين</h4>
                <p>لم يتم تحديد أي طلاب كمميزين في هذه الشعبة</p>
            </div>
        `;
        return;
    }
    
    topStudentsContainer.innerHTML = '';
    
    distinguishedStudents.forEach((student, index) => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card distinguished';
        studentCard.innerHTML = `
            <div class="student-rank">
                <i class="fas fa-crown"></i>
                <span>${index + 1}</span>
            </div>
            <div class="student-avatar-container">
                ${student.avatar ? 
                    `<img src="${student.avatar}" alt="${student.name}" class="student-avatar">` : 
                    `<div class="student-avatar default"><i class="fas fa-user-graduate"></i></div>`}
            </div>
            <div class="student-info">
                <h4 class="student-name">${student.name}</h4>
                <div class="student-stats">
                    <div class="stat-item">
                        <i class="fas fa-percentage"></i>
                        <span>${student.average || 0}%</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-calendar-check"></i>
                        <span>${student.attendance || 0}%</span>
                    </div>
                </div>
                <p class="student-achievements">
                    ${student.achievements || 'لا توجد إنجازات مسجلة'}
                </p>
            </div>
            <div class="distinguished-badge">
                <i class="fas fa-star"></i>
                <span>مميز</span>
            </div>
        `;
        topStudentsContainer.appendChild(studentCard);
    });
}

function renderAllStudents(students) {
    const studentsTableBody = document.getElementById('studentsTableBody');
    
    if (students.length === 0) {
        studentsTableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="no-students-message">
                        <i class="fas fa-user-graduate"></i>
                        <p>لا يوجد طلاب مسجلين في هذه الشعبة</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    studentsTableBody.innerHTML = '';
    
    students.forEach(student => {
        // صف للشاشات الكبيرة
        const desktopRow = document.createElement('tr');
        desktopRow.className = 'desktop-row';
        desktopRow.innerHTML = `
            <td>
                <div class="student-info ${student.isDistinguished ? 'distinguished' : ''}">
                    ${student.avatar ? 
                        `<img src="${student.avatar}" alt="${student.name}" class="student-avatar-small">` : 
                        `<div class="student-avatar-small default"><i class="fas fa-user-graduate"></i></div>`}
                    ${student.name}
                    ${student.isDistinguished ? '<span class="distinguished-badge"><i class="fas fa-star"></i></span>' : ''}
                </div>
            </td>
            <td>${student.average || 0}%</td>
            <td>${student.attendance || 0}%</td>
            <td>${student.achievements || '-'}</td>
        `;
        studentsTableBody.appendChild(desktopRow);
        
        // صف للهواتف
        const mobileRow = document.createElement('tr');
        mobileRow.className = 'mobile-row';
        mobileRow.innerHTML = `
            <td colspan="4">
                <div class="mobile-student-card ${student.isDistinguished ? 'distinguished' : ''}">
                    <div class="mobile-student-header">
                        ${student.avatar ? 
                            `<img src="${student.avatar}" alt="${student.name}" class="mobile-student-avatar">` : 
                            `<div class="mobile-student-avatar default"><i class="fas fa-user-graduate"></i></div>`}
                        <div>
                            <h4>${student.name}</h4>
                            ${student.isDistinguished ? '<span class="mobile-distinguished-badge"><i class="fas fa-star"></i> مميز</span>' : ''}
                        </div>
                    </div>
                    <div class="mobile-student-details">
                        <div class="detail-item">
                            <span>المعدل:</span>
                            <strong>${student.average || 0}%</strong>
                        </div>
                        <div class="detail-item">
                            <span>الحضور:</span>
                            <strong>${student.attendance || 0}%</strong>
                        </div>
                        <div class="detail-item">
                            <span>الإنجازات:</span>
                            <p>${student.achievements || '-'}</p>
                        </div>
                    </div>
                </div>
            </td>
        `;
        studentsTableBody.appendChild(mobileRow);
    });
}


function renderStudentsAsCards(students) {
    const container = document.getElementById('studentsContainer'); // تأكد من وجود هذا العنصر في HTML
    container.innerHTML = '';
    
    if (students.length === 0) {
        container.innerHTML = `
            <div class="no-students">
                <i class="fas fa-user-graduate"></i>
                <h4>لا يوجد طلاب مسجلين</h4>
                <p>لم يتم تسجيل أي طلاب بعد</p>
            </div>
        `;
        return;
    }
    
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-profile-card';
        card.innerHTML = `
            <div class="card-header ${student.isDistinguished ? 'distinguished' : ''}">
                <div class="avatar-container">
                    ${student.avatar ? 
                        `<img src="${student.avatar}" alt="${student.name}" class="student-avatar">` : 
                        `<div class="default-avatar"><i class="fas fa-user-graduate"></i></div>`}
                </div>
                ${student.isDistinguished ? '<div class="badge"><i class="fas fa-star"></i> مميز</div>' : ''}
            </div>
            <div class="card-body">
                <h3 class="student-name">${student.name}</h3>
                <div class="student-meta">
                    <div class="meta-item">
                        <i class="fas fa-percentage"></i>
                        <span>المعدل: <strong>${student.average || 0}%</strong></span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-calendar-check"></i>
                        <span>الحضور: <strong>${student.attendance || 0}%</strong></span>
                    </div>
                </div>
                <div class="achievements">
                    <h4>الإنجازات:</h4>
                    <p>${student.achievements || 'لا توجد إنجازات مسجلة'}</p>
                </div>
            </div>
            <div class="card-footer">
                <span class="join-date">منضم منذ: ${student.joinDate || 'غير معروف'}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// CSS المطلوب لهذه البطاقات
const studentCardsCSS = `
    .student-profile-card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        margin-bottom: 20px;
    }

    .student-profile-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }

    .card-header {
        position: relative;
        height: 120px;
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 20px;
    }

    .card-header.distinguished {
        background: linear-gradient(135deg, #f83600 0%, #f9d423 100%);
    }

    .avatar-container {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 4px solid white;
        background: white;
        overflow: hidden;
        transform: translateY(50%);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    .student-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .default-avatar {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        color: #666;
        font-size: 40px;
    }

    .badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: #ffc107;
        color: #333;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .card-body {
        padding: 70px 20px 20px;
        text-align: center;
    }

    .student-name {
        margin: 0 0 15px;
        color: #333;
        font-size: 1.4rem;
    }

    .student-meta {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #666;
    }

    .meta-item i {
        color: #4e73df;
    }

    .achievements {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
        text-align: right;
    }

    .achievements h4 {
        margin: 0 0 10px;
        color: #444;
        font-size: 1rem;
    }

    .achievements p {
        margin: 0;
        color: #666;
        line-height: 1.5;
    }

    .card-footer {
        padding: 15px 20px;
        background: #f8f9fa;
        border-top: 1px solid #eee;
        text-align: center;
        color: #666;
        font-size: 0.9rem;
    }

    /* للهواتف */
    @media (max-width: 768px) {
        .student-profile-card {
            margin-bottom: 15px;
        }
        
        .avatar-container {
            width: 80px;
            height: 80px;
        }
        
        .card-body {
            padding: 60px 15px 15px;
        }
        
        .student-meta {
            flex-direction: column;
            gap: 10px;
        }
    }
`;

// إضافة الـ CSS إلى الصفحة (مع التحقق من عدم تكرارها)
function addStudentCardsCSS() {
    const styleId = 'student-cards-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.innerHTML = studentCardsCSS;
        document.head.appendChild(styleElement);
    }
}

// استدعاء الدالة لإضافة أنماط الـ CSS عند الحاجة
addStudentCardsCSS();



// متغيرات الامتحانات السريعة


// عرض قسم الامتحانات السريعة


// عرض الامتحانات السريعة


// بدء الامتحان
function startQuiz(quizId) {
    currentQuiz = currentQuizzes.find(q => q.id === quizId);
    if (!currentQuiz) return;
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // تهيئة واجهة الامتحان
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    
    // عرض السؤال الأول
    showQuestion();
    
    // عرض نافذة الامتحان
    document.getElementById('quizModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// عرض السؤال الحالي
function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    if (!question) return;
    
    // تحديث رقم السؤال الحالي
    document.getElementById('currentQuestionNum').textContent = currentQuestionIndex + 1;
    
    // عرض نص السؤال
    document.getElementById('questionText').textContent = question.text;
    
    // عرض الخيارات
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option.text;
        optionBtn.setAttribute('data-option-id', option.id);
        
        // إذا كان المستخدم قد اختار هذا الخيار مسبقاً
        const userAnswer = userAnswers[currentQuestionIndex];
        if (userAnswer !== undefined && userAnswer.answer === option.id) {
            optionBtn.classList.add('selected');
            
            // إذا تم الكشف عن الإجابة الصحيحة
            if (userAnswer.revealed) {
                if (option.id === question.correctAnswer) {
                    optionBtn.classList.add('correct');
                } else {
                    optionBtn.classList.add('incorrect');
                }
            }
        }
        
        optionBtn.addEventListener('click', () => selectOption(option.id));
        optionsContainer.appendChild(optionBtn);
    });
    
    // عرض التفسير إذا كان موجوداً وتم الكشف عنه
    const explanationContainer = document.getElementById('explanationContainer');
    const explanationText = document.getElementById('explanationText');
    
    const userAnswer = userAnswers[currentQuestionIndex];
    if (userAnswer && userAnswer.revealed && question.explanation) {
        explanationText.textContent = question.explanation;
        explanationContainer.style.display = 'block';
    } else {
        explanationContainer.style.display = 'none';
    }
    
    // تحديث حالة الأزرار
    updateQuizButtons();
}

// اختيار خيار
function selectOption(optionId) {
    // إذا تم الكشف عن الإجابة بالفعل، لا تسمح بتغييرها
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (currentAnswer && currentAnswer.revealed) return;
    
    // حفظ إجابة المستخدم
    userAnswers[currentQuestionIndex] = {
        answer: optionId,
        revealed: false
    };
    
    // إعادة عرض السؤال لتحديث التحديد
    showQuestion();
}

// الكشف عن الإجابة الصحيحة
function revealAnswer() {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer || currentAnswer.revealed) return;
    
    // تحديث حالة الإجابة لتكون مكشوفة
    userAnswers[currentQuestionIndex].revealed = true;
    
    // إعادة عرض السؤال لتحديث الألوان
    showQuestion();
    
    // تحديث حالة الأزرار
    updateQuizButtons();
}

// تحديث أزرار التحكم
function updateQuizButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // زر السابق
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // زر التالي والإرسال
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
    const currentAnswer = userAnswers[currentQuestionIndex];
    
    if (isLastQuestion) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
    
    // إذا كانت الإجابة مكشوفة، لا تسمح بالانتقال إلا بعد الكشف
    if (currentAnswer && currentAnswer.revealed) {
        nextBtn.disabled = false;
        submitBtn.disabled = false;
    } else {
        nextBtn.disabled = currentAnswer === undefined;
        submitBtn.disabled = currentAnswer === undefined;
    }
}

// الانتقال إلى السؤال التالي
function nextQuestion() {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer) return;
    
    // إذا لم تكن الإجابة مكشوفة، اكشفها أولاً
    if (!currentAnswer.revealed) {
        revealAnswer();
        return;
    }
    
    // الانتقال إلى السؤال التالي
    currentQuestionIndex++;
    showQuestion();
}

// العودة إلى السؤال السابق
function prevQuestion() {
    currentQuestionIndex--;
    showQuestion();
}

// إنهاء الامتحان وعرض النتائج
function submitQuiz() {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer) return;
    
    // إذا لم تكن الإجابة مكشوفة، اكشفها أولاً
    if (!currentAnswer.revealed) {
        revealAnswer();
        return;
    }
    
    // حساب النتائج
    calculateResults();
    
    // إغلاق نافذة الامتحان وفتح نافذة النتائج
    closeQuiz();
    showResults();
}

// حساب النتائج
function calculateResults() {
    let correctAnswers = 0;
    let totalMarks = 0;
    let userScore = 0;
    const wrongAnswers = [];
    
    currentQuiz.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        totalMarks += question.marks;
        
        if (userAnswer && userAnswer.answer === question.correctAnswer) {
            correctAnswers++;
            userScore += question.marks;
        } else {
            wrongAnswers.push({
                question: question.text,
                userAnswer: userAnswer ? question.options.find(o => o.id === userAnswer.answer)?.text : 'لم يتم الإجابة',
                correctAnswer: question.options.find(o => o.id === question.correctAnswer)?.text,
                explanation: question.explanation || 'لا يوجد تفسير متاح'
            });
        }
    });
    
    // حساب النسبة المئوية
    const percentage = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    
    // تحديد التعليق بناء على النتيجة
    let feedbackText = '';
    let feedbackMessage = '';
    
    if (percentage >= 90) {
        feedbackText = 'ممتاز!';
        feedbackMessage = 'أحسنت! لديك فهم ممتاز للمادة.';
    } else if (percentage >= 70) {
        feedbackText = 'جيد جداً';
        feedbackMessage = 'أداء جيد، لكن يمكنك تحسينه بالمزيد من الممارسة.';
    } else if (percentage >= 50) {
        feedbackText = 'مقبول';
        feedbackMessage = 'يجب مراجعة المادة والتدرب أكثر.';
    } else {
        feedbackText = 'ضعيف';
        feedbackMessage = 'يجب بذل المزيد من الجهد ومراجعة المادة بدقة.';
    }
    
    // حفظ النتائج
    quizResults = {
        correctAnswers,
        totalQuestions: currentQuiz.questions.length,
        totalMarks,
        userScore,
        percentage,
        feedbackText,
        feedbackMessage,
        wrongAnswers
    };
}

// عرض النتائج
function showResults() {
    if (!quizResults) return;
    
    // تعبئة البيانات
    document.getElementById('scorePercentage').textContent = `${quizResults.percentage}%`;
    document.getElementById('correctAnswers').textContent = quizResults.correctAnswers;
    document.getElementById('totalQuestionsResult').textContent = quizResults.totalQuestions;
    document.getElementById('totalMarks').textContent = quizResults.totalMarks;
    document.getElementById('userScore').textContent = quizResults.userScore;
    document.getElementById('feedbackText').textContent = quizResults.feedbackText;
    document.getElementById('feedbackMessage').textContent = quizResults.feedbackMessage;
    
    // تعبئة الأسئلة الخاطئة
    const wrongAnswersList = document.getElementById('wrongAnswersList');
    wrongAnswersList.innerHTML = '';
    
    quizResults.wrongAnswers.forEach(item => {
        const wrongAnswerItem = document.createElement('div');
        wrongAnswerItem.className = 'wrong-answer-item';
        wrongAnswerItem.innerHTML = `
            <div class="wrong-answer-question">${item.question}</div>
            <p>إجابتك: <span style="color: #dc3545;">${item.userAnswer}</span></p>
            <p>الإجابة الصحيحة: <span style="color: #28a745;">${item.correctAnswer}</span></p>
            <div class="wrong-answer-explanation">${item.explanation}</div>
        `;
        wrongAnswersList.appendChild(wrongAnswerItem);
    });
    
    // عرض نافذة النتائج
    document.getElementById('resultsModal').style.display = 'flex';
}

// إغلاق نافذة الامتحان
function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// إغلاق نافذة النتائج
function closeResults() {
    document.getElementById('resultsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// إعادة محاولة الامتحان
function retryQuiz() {
    closeResults();
    startQuiz(currentQuiz.id);
}

// إعداد فلاتر الامتحانات السريعة
function setupQuickExamsFilters() {
    document.querySelectorAll('.quick-exams-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.quick-exams-filter .active').classList.remove('active');
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterQuickExams();
        });
    });
}

// تصفية الامتحانات السريعة
function filterQuickExams() {
    let filtered = [...currentQuizzes];
    
    if (currentFilter === 'all') {
        renderQuickExams();
        return;
    }
    
    // تصفية حسب الصف
    if (currentFilter === 't9' || currentFilter === 'bac') {
        filtered = filtered.filter(quiz => quiz.grade === currentFilter);
    }
    
    // تصفية حسب المادة
    if (['math', 'arabic', 'science'].includes(currentFilter)) {
        filtered = filtered.filter(quiz => quiz.subject === currentFilter);
    }
    
    renderQuickExams(filtered);
}

// تحديث دالة hideAllSections لإضافة قسم الامتحانات السريعة


// إضافة مستمعي الأحداث للأزرار
document.addEventListener('DOMContentLoaded', () => {
    // أزرار التحكم في الامتحان
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('submitBtn').addEventListener('click', submitQuiz);
    
    // يمكنك إضافة رابط في القائمة الجانبية للوصول إلى الامتحانات السريعة
    // مثل: <li><a href="#" onclick="showQuickExams()">الامتحانات السريعة</a></li>
});


// متغيرات الامتحانات السريعة


// عرض قسم الامتحانات السريعة
function showQuickExams() {
    hideAllSections();
    document.getElementById('quickExams').style.display = 'block';
    loadQuickExams();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
document.getElementById("qou").style.display="none";



}

// تحميل الامتحانات السريعة من JSONBin.io
async function loadQuickExams() {
    const container = document.getElementById('quickExamsContainer');
    const loader = document.getElementById('quickExamsLoader');
    
    loader.style.display = 'flex';
    container.innerHTML = '';
    
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${QUIZZES_BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': QUIZZES_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        
        const data = await response.json();
        currentQuizzes = data.record.quizzes;
        
        if (!currentQuizzes || currentQuizzes.length === 0) {
            throw new Error('No quizzes available');
        }
        
        renderQuickExams();
        setupQuickExamsFilters();
        
    } catch (error) {
        console.error('Error loading quizzes:', error);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في تحميل الامتحانات السريعة. يرجى المحاولة لاحقاً</p>
                <button onclick="loadQuickExams()" class="retry-btn">إعادة المحاولة</button>
            </div>
        `;
    } finally {
        loader.style.display = 'none';
    }
}

// عرض الامتحانات السريعة
function renderQuickExams(filteredQuizzes = null) {
    const quizzesToRender = filteredQuizzes || currentQuizzes;
    const container = document.getElementById('quickExamsContainer');
    
    if (quizzesToRender.length === 0) {
        container.innerHTML = `
            <div class="no-exams">
                <i class="fas fa-file-circle-question"></i>
                <p>لا توجد امتحانات سريعة متاحة لهذا التصنيف</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    quizzesToRender.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quick-exam-card';
        
        const gradeName = quiz.grade === 't9' ? 'تاسع' : 'بكالوريا';
        const subjectName = getSubjectName(quiz.subject);
        
        quizCard.innerHTML = `
            <div class="quick-exam-header">
                <h3>${quiz.title}</h3>
            </div>
            <div class="quick-exam-body">
                <div class="quick-exam-meta">
                    <span><i class="fas fa-book"></i> ${subjectName}</span>
                    <span><i class="fas fa-graduation-cap"></i> ${gradeName}</span>
                </div>
                <div class="quick-exam-meta">
                    <span><i class="fas fa-question-circle"></i> ${quiz.questions.length} أسئلة</span>
                    <span><i class="fas fa-star"></i> ${quiz.totalMarks} درجة</span>
                </div>
                <div class="quick-exam-actions">
                    <button class="start-quiz-btn" data-quiz-id="${quiz.id}">بدء الامتحان</button>
                </div>
            </div>
        `;
        
        container.appendChild(quizCard);
    });
    
    // إضافة مستمعي الأحداث لأزرار البدء
    document.querySelectorAll('.start-quiz-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const quizId = this.getAttribute('data-quiz-id');
            startQuiz(quizId);
        });
    });
}

// بدء الامتحان
function startQuiz(quizId) {
    currentQuiz = currentQuizzes.find(q => q.id === quizId);
    if (!currentQuiz) return;
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // تهيئة واجهة الامتحان
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    
    // عرض السؤال الأول
    showQuestion();

    
    
    // عرض نافذة الامتحان
    document.getElementById('quizModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeQuiz();
        }
    });
}

// عرض السؤال الحالي
function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    if (!question) return;
    
    // تحديث رقم السؤال الحالي
    document.getElementById('currentQuestionNum').textContent = currentQuestionIndex + 1;
    
    // عرض نص السؤال
    document.getElementById('questionText').textContent = question.text;
    
    // عرض الخيارات
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option.text;
        optionBtn.setAttribute('data-option-id', option.id);
        
        // إذا كان المستخدم قد اختار هذا الخيار مسبقاً
        const userAnswer = userAnswers[currentQuestionIndex];
        if (userAnswer !== undefined && userAnswer.answer === option.id) {
            optionBtn.classList.add('selected');
            
            // إذا تم الكشف عن الإجابة الصحيحة
            if (userAnswer.revealed) {
                if (option.id === question.correctAnswer) {
                    optionBtn.classList.add('correct');
                } else {
                    optionBtn.classList.add('incorrect');
                }
            }
        }
        
        optionBtn.addEventListener('click', () => selectOption(option.id));
        optionsContainer.appendChild(optionBtn);
    });
    
    // عرض التفسير إذا كان موجوداً وتم الكشف عنه
    const explanationContainer = document.getElementById('explanationContainer');
    const explanationText = document.getElementById('explanationText');
    
    const userAnswer = userAnswers[currentQuestionIndex];
    if (userAnswer && userAnswer.revealed && question.explanation) {
        explanationText.textContent = question.explanation;
        explanationContainer.style.display = 'block';
    } else {
        explanationContainer.style.display = 'none';
    }
    
    // تحديث حالة الأزرار
    updateQuizButtons();
    
    // تحديث شريط التقدم
    updateProgressRing();
}

// تحديث شريط التقدم
function updateProgressRing() {
    const progress = ((currentQuestionIndex) / currentQuiz.questions.length) * 100;
    const circle = document.querySelector('.progress-ring-circle');
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (progress / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
}

// اختيار خيار
function selectOption(optionId) {
    // إذا تم الكشف عن الإجابة بالفعل، لا تسمح بتغييرها
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (currentAnswer && currentAnswer.revealed) return;
    
    // حفظ إجابة المستخدم
    userAnswers[currentQuestionIndex] = {
        answer: optionId,
        revealed: false
    };
    
    // إعادة عرض السؤال لتحديث التحديد
    showQuestion();
}

// الكشف عن الإجابة الصحيحة
function revealAnswer() {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer || currentAnswer.revealed) return;
    
    // تحديث حالة الإجابة لتكون مكشوفة
    userAnswers[currentQuestionIndex].revealed = true;
    
    // إعادة عرض السؤال لتحديث الألوان
    showQuestion();
    
    // تحديث حالة الأزرار
    updateQuizButtons();
}

// تحديث أزرار التحكم
function updateQuizButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const revealBtn = document.getElementById('revealBtn');
    
    // زر السابق
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // زر التالي والإرسال
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
    const currentAnswer = userAnswers[currentQuestionIndex];
    
    if (isLastQuestion) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
    
    // إذا كانت الإجابة مكشوفة، لا تسمح بالكشف مرة أخرى
    if (currentAnswer && currentAnswer.revealed) {
        revealBtn.disabled = true;
        nextBtn.disabled = false;
        submitBtn.disabled = false;
    } else {
        revealBtn.disabled = currentAnswer === undefined;
        nextBtn.disabled = currentAnswer === undefined;
        submitBtn.disabled = currentAnswer === undefined;
    }
}

// الانتقال إلى السؤال التالي
function nextQuestion() {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer) return;
    
    // إذا لم تكن الإجابة مكشوفة، اكشفها أولاً
    if (!currentAnswer.revealed) {
        revealAnswer();
        return;
    }
    
    // الانتقال إلى السؤال التالي
    currentQuestionIndex++;
    showQuestion();
}

// العودة إلى السؤال السابق
function prevQuestion() {
    currentQuestionIndex--;
    showQuestion();
}

// إنهاء الامتحان وعرض النتائج
function submitQuiz() {
    const currentAnswer = userAnswers[currentQuestionIndex];
    if (!currentAnswer) return;
    
    // إذا لم تكن الإجابة مكشوفة، اكشفها أولاً
    if (!currentAnswer.revealed) {
        revealAnswer();
        return;
    }
    
    // حساب النتائج
    calculateResults();
    
    // إغلاق نافذة الامتحان وفتح نافذة النتائج
    closeQuiz();
    showResults();
}

// حساب النتائج
function calculateResults() {
    let correctAnswers = 0;
    let totalMarks = 0;
    let userScore = 0;
    const wrongAnswers = [];
    
    currentQuiz.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        totalMarks += question.marks;
        
        if (userAnswer && userAnswer.answer === question.correctAnswer) {
            correctAnswers++;
            userScore += question.marks;
        } else {
            wrongAnswers.push({
                question: question.text,
                userAnswer: userAnswer ? question.options.find(o => o.id === userAnswer.answer)?.text : 'لم يتم الإجابة',
                correctAnswer: question.options.find(o => o.id === question.correctAnswer)?.text,
                explanation: question.explanation || 'لا يوجد تفسير متاح'
            });
        }
    });
    
    // حساب النسبة المئوية
    const percentage = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    
    // تحديد التعليق بناء على النتيجة
    let feedbackText = '';
    let feedbackMessage = '';
    
    if (percentage >= 90) {
        feedbackText = 'ممتاز!';
        feedbackMessage = 'أحسنت! لديك فهم ممتاز للمادة.';
    } else if (percentage >= 70) {
        feedbackText = 'جيد جداً';
        feedbackMessage = 'أداء جيد، لكن يمكنك تحسينه بالمزيد من الممارسة.';
    } else if (percentage >= 50) {
        feedbackText = 'مقبول';
        feedbackMessage = 'يجب مراجعة المادة والتدرب أكثر.';
    } else {
        feedbackText = 'ضعيف';
        feedbackMessage = 'يجب بذل المزيد من الجهد ومراجعة المادة بدقة.';
    }
    
    // حفظ النتائج
    quizResults = {
        correctAnswers,
        totalQuestions: currentQuiz.questions.length,
        totalMarks,
        userScore,
        percentage,
        feedbackText,
        feedbackMessage,
        wrongAnswers
    };
}

// عرض النتائج
function showResults() {
    if (!quizResults) return;
    
    // تعبئة البيانات
    document.getElementById('scorePercentage').textContent = `${quizResults.percentage}%`;
    document.getElementById('correctAnswers').textContent = quizResults.correctAnswers;
    document.getElementById('totalQuestionsResult').textContent = quizResults.totalQuestions;
    document.getElementById('totalMarks').textContent = quizResults.totalMarks;
    document.getElementById('userScore').textContent = quizResults.userScore;
    document.getElementById('feedbackText').textContent = quizResults.feedbackText;
    document.getElementById('feedbackMessage').textContent = quizResults.feedbackMessage;
    
    // تعبئة الأسئلة الخاطئة
    const wrongAnswersList = document.getElementById('wrongAnswersList');
    wrongAnswersList.innerHTML = '';
    
    quizResults.wrongAnswers.forEach(item => {
        const wrongAnswerItem = document.createElement('div');
        wrongAnswerItem.className = 'wrong-answer-item';
        wrongAnswerItem.innerHTML = `
            <div class="wrong-answer-question">${item.question}</div>
            <p>إجابتك: <span style="color: #dc3545;">${item.userAnswer}</span></p>
            <p>الإجابة الصحيحة: <span style="color: #28a745;">${item.correctAnswer}</span></p>
            <div class="wrong-answer-explanation">${item.explanation}</div>
        `;
        wrongAnswersList.appendChild(wrongAnswerItem);
    });
    
    // عرض نافذة النتائج
    document.getElementById('resultsModal').style.display = 'flex';
}

// إغلاق نافذة الامتحان
function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}
// إغلاق نافذة النتائج
function closeResults() {
    document.getElementById('resultsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// إعادة محاولة الامتحان
function retryQuiz() {
    closeResults();
    startQuiz(currentQuiz.id);
}

// إعداد فلاتر الامتحانات السريعة
function setupQuickExamsFilters() {
    document.querySelectorAll('.quick-exams-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.quick-exams-filter .active').classList.remove('active');
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterQuickExams();
        });
    });
}

// تصفية الامتحانات السريعة
function filterQuickExams() {
    let filtered = [...currentQuizzes];
    
    if (currentFilter === 'all') {
        renderQuickExams();
        return;
    }
    
    // تصفية حسب الصف
    if (currentFilter === 't9' || currentFilter === 'bac') {
        filtered = filtered.filter(quiz => quiz.grade === currentFilter);
    }
    
    // تصفية حسب المادة
    if (['math', 'arabic', 'science'].includes(currentFilter)) {
        filtered = filtered.filter(quiz => quiz.subject === currentFilter);
    }
    
    renderQuickExams(filtered);
}

// الحصول على اسم المادة من الكود
function getSubjectName(subjectCode) {
    const subjects = {
        'math': 'الرياضيات',
        'science': 'العلوم',
        'arabic': 'اللغة العربية',
        'english': 'الإنجليزية',
        'social': 'الاجتماعيات'
    };
    return subjects[subjectCode] || subjectCode;
}

// تحديث دالة hideAllSections لإضافة قسم الامتحانات السريعة




function hideAllSections() {
    const sections = [
        'home', 'grades', 'branchesSection', 
        'branchDetails', 'about', 'contact', 
        'developer', 'teachers', 'exams',
        'quickExams', 'zr', 'showFees'
    ];
    
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });




    closeQuiz();
    closeResults();



}


// بدء الامتحان
function startQuiz(quizId) {
    currentQuiz = currentQuizzes.find(q => q.id === quizId);
    if (!currentQuiz) return;
    
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // تهيئة واجهة الامتحان
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    
    // عرض السؤال الأول
    showQuestion();
    
    // عرض نافذة الامتحان
    const modal = document.getElementById('quizModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // إغلاق عند النقر خارج المحتوى
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeQuiz();
        }
    });
}

// إغلاق نافذة الامتحان
function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}



function renderAllStudents(students) {
    const container = document.getElementById('studentsTableBody');
    container.innerHTML = '';
    
    if (students.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="no-students-message">
                        <i class="fas fa-user-graduate"></i>
                        <p>لا يوجد طلاب مسجلين في هذه الشعبة</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // إنشاء صف جديد للبطاقات
    const cardRow = document.createElement('tr');
    cardRow.className = 'card-row';
    const cardCell = document.createElement('td');
    cardCell.colSpan = 4;
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'students-cards-container';
    
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = `student-card ${student.isDistinguished ? 'distinguished' : ''}`;
        
        card.innerHTML = `
            <div class="student-card-header">
                ${student.avatar ? 
                    `<img src="${student.avatar}" alt="${student.name}" class="student-card-avatar">` : 
                    `<div class="student-card-avatar default"><i class="fas fa-user-graduate"></i></div>`}
                <div class="student-card-title">
                    <h4>${student.name}</h4>
                    ${student.isDistinguished ? '<span class="distinguished-badge"><i class="fas fa-star"></i> مميز</span>' : ''}
                </div>
            </div>
            <div class="student-card-body">
                <div class="student-stat">
                    <i class="fas fa-percentage"></i>
                    <span>المعدل: <strong>${student.average || 0}%</strong></span>
                </div>
                <div class="student-stat">
                    <i class="fas fa-calendar-check"></i>
                    <span>الحضور: <strong>${student.attendance || 0}%</strong></span>
                </div>
                <div class="student-stat">
                    <i class="fas fa-trophy"></i>
                    <span>الإنجازات: <strong>${student.achievements || '-'}</strong></span>
                </div>
            </div>
            <div class="student-card-footer">
                <span class="join-date">منضم منذ: ${student.joinDate || 'غير معروف'}</span>
            </div>
        `;
        
        cardsContainer.appendChild(card);
    });
    
    cardCell.appendChild(cardsContainer);
    cardRow.appendChild(cardCell);
    container.appendChild(cardRow);
}



