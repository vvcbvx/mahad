let openSection = null;

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

const JSONBIN_API_KEYS = {
    EXAMS: {
        BIN_ID: '688323717b4b8670d8a70100', // استبدل بمعرف الـ Bin الخاص بك
        API_KEY: '$2a$10$3bvwkFEhQyUebdIpUA0VT.pATBpC.x.wfgo3qFQ/e2K5cu4gdCSAG' // استبدل بمفتاح API الخاص بك
    }
};





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
        function showBranchDetails(branch) {
            currentBranch = branch;
            
            // Update branch details
            document.getElementById('branchDetailTitle').textContent = `${branch.name} - ${currentGrade === 'تاسع' ? 'الصف التاسع' : 'البكالوريا'}`;
            document.getElementById('branchDetailDesc').textContent = branch.description;
            document.getElementById('studentsCount').textContent = branch.studentsCount;
            document.getElementById('startDate').textContent = branch.startDate;
            document.getElementById('completionRate').textContent = `${branch.completionRate}%`;
            document.getElementById('averageGrade').textContent = `${branch.averageGrade}%`;
            document.getElementById('branchProgress').style.width = `${branch.completionRate}%`;
            
            // Update top students
            const topStudentsContainer = document.getElementById('topStudents');
            topStudentsContainer.innerHTML = '';
            
            branch.topStudents.forEach((student, index) => {
                const studentCard = document.createElement('div');
                studentCard.className = 'student-card';
                studentCard.innerHTML = `
                    <div class="student-rank rank-${index + 1}">${index + 1}</div>
                    <img src="${student.avatar}" alt="${student.name}" class="student-avatar">
                    <h4 class="student-name">${student.name}</h4>
                    <div class="student-grade">المعدل: ${student.grade}%</div>
                    <p class="student-achievements">${student.achievements}</p>
                `;
                topStudentsContainer.appendChild(studentCard);
            });
            
            // Update students table
            const studentsTableBody = document.getElementById('studentsTableBody');
            studentsTableBody.innerHTML = '';
            
            branch.students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.average}%</td>
                    <td>${student.attendance}</td>
                    <td>${student.achievements}</td>
                `;
                studentsTableBody.appendChild(row);
            });
            
            // Hide all sections and show branch details
            hideAllSections();
            document.getElementById('branchDetails').style.display = 'block';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

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


function showDeveloper() {
    hideAllSections();
    document.getElementById('developer').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
}

// أضف هذه الدالة إلى دالة hideAllSections
function hideAllSections() {
    // ... الأقسام الأخرى
    document.getElementById('developer').style.display = 'none';
}



// بيانات المعلمين


// عرض قائمة المعلمين
function showTeachers() {
    hideAllSections();
    const container = document.getElementById('teachersContainer');
    container.innerHTML = '';
    
    teachersData.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.innerHTML = `
            <img src="${teacher.avatar}" class="teacher-avatar" alt="${teacher.name}">
            <h3 class="teacher-name">${teacher.name}</h3>
            <p class="teacher-subject">${teacher.subject}</p>
            <div class="teacher-meta">
                <span>${teacher.experience} خبرة</span>
            </div>
        `;
        card.addEventListener('click', () => showTeacherDetails(teacher));
        container.appendChild(card);
    });
    
    document.getElementById('teachers').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
}

// عرض تفاصيل المعلم
function showTeacherDetails(teacher) {
    document.getElementById('modalAvatar').src = teacher.avatar;
    document.getElementById('modalName').textContent = teacher.name;
    document.getElementById('modalAge').textContent = teacher.age;
    document.getElementById('modalSubject').textContent = teacher.subject;
    document.getElementById('modalCertificates').textContent = teacher.certificates;
    document.getElementById('modalExperience').textContent = teacher.experience;
    document.getElementById('modalLectures').textContent = teacher.lectures;
    document.getElementById('modalBio').textContent = teacher.bio;
    
    document.getElementById('teacherModal').style.display = 'block';
}

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
function hideAllSections() {
    // ... الأقسام الأخرى ...
    document.getElementById('teachers').style.display = 'none';
}


// دالة واحدة موحدة لإخفاء جميع الأقسام
function hideAllSections() {
    const sections = [
        'home', 'grades', 'branchesSection', 
        'branchDetails', 'about', 'contact', 
        'developer', 'teachers'
    ];
    
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
}
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
function hideAllSections() {
    const sections = [
        'home', 'grades', 'branchesSection', 
        'branchDetails', 'about', 'contact', 
        'developer', 'teachers', 'exams',
    ];
    
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
}

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
        const filePath = `exams/${encodeURIComponent(exam.file)}`;

        examCard.innerHTML = `
            <div class="exam-header">
                <h3>${exam.title}</h3>
                <span class="exam-badge">${gradeName}</span>
            </div>
            <div class="exam-body">
                <div class="exam-meta">
                    <span><i class="fas fa-book"></i> ${subjectName}</span>
                    <span><i class="fas fa-download"></i> ${exam.downloads}</span>
                </div>
                <div class="exam-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(exam.publishDate)}</span>
                    <span><i class="fas fa-user"></i> ${exam.publisher}</span>
                </div>
                <div class="exam-actions">
                    <a href="${filePath}" class="exam-download" download="${exam.file}">
                        <i class="fas fa-download"></i> تحميل
                    </a>
                </div>
            </div>
            <!-- عنصر التحميل المؤقت -->
            <div class="download-overlay" style="display:none;">
                <div class="download-popup">
                    <i class="fas fa-cloud-download-alt loading-icon"></i>
                    <p>يرجى الانتظار...</p>
                    <button class="cancel-download">إلغاء</button>
                </div>
            </div>
        `;

        const downloadBtn = examCard.querySelector('.exam-download');
        const downloadOverlay = examCard.querySelector('.download-overlay');
        const cancelBtn = examCard.querySelector('.cancel-download');

        // معالجة حدث النقر على زر التحميل
        downloadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // عرض نافذة الانتظار
            downloadOverlay.style.display = 'flex';
            
            try {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error('File not found');
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = exam.file;
                document.body.appendChild(link);
                
                // إخفاء نافذة الانتظار عند بدء التحميل
                link.addEventListener('click', () => {
                    setTimeout(() => {
                        downloadOverlay.style.display = 'none';
                    }, 500);
                });
                
                link.click();
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(link);
                
                // إخفاء النافذة إذا لم يتم تنزيل الملف خلال 10 ثوانٍ
                setTimeout(() => {
                    if (downloadOverlay.style.display !== 'none') {
                        downloadOverlay.style.display = 'none';
                        alert('تعذر بدء التحميل تلقائياً. يرجى المحاولة مرة أخرى');
                    }
                }, 10000);
                
            } catch (error) {
                console.error('فشل التنزيل:', error);
                downloadOverlay.style.display = 'none';
                alert('تعذر العثور على الملف. يرجى مراجعة الإدارة');
            }
        });

        // معالجة حدث النقر على زر الإلغاء
        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadOverlay.style.display = 'none';
        });

        container.appendChild(examCard);
    });
}

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

function renderTeachers(teachers) {
    const container = document.getElementById('teachersContainer');
    container.innerHTML = '';
    
    if (!teachers || teachers.length === 0) {
        container.innerHTML = `
            <div class="no-teachers">
                <i class="fas fa-chalkboard-teacher"></i>
                <p>لا يوجد معلمون متاحون حالياً</p>
            </div>
        `;
        return;
    }
    
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

// متغيرات النظام


// API Keys - استبدلها بمفاتيحك الخاصة


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
                <p>${branch.shortDesc}</p>
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

// عرض تفاصيل الشعبة
function showBranchDetails(branch) {
    currentBranch = branch;
    hideAllSections();
    document.getElementById('branchDetails').style.display = 'block';
    
    // تحديث معلومات الشعبة
    document.getElementById('branchDetailTitle').textContent = `${branch.name} - ${currentGrade === 'تاسع' ? 'الصف التاسع' : 'البكالوريا'}`;
    document.getElementById('branchDetailDesc').textContent = branch.description;
    document.getElementById('studentsCount').textContent = branch.studentsCount;
    document.getElementById('startDate').textContent = branch.startDate;
    document.getElementById('completionRate').textContent = `${branch.completionRate}%`;
    document.getElementById('averageGrade').textContent = `${branch.averageGrade}%`;
    document.getElementById('branchProgress').style.width = `${branch.completionRate}%`;
    
    // تحميل الطلاب
    loadStudents(branch.id);
}

// عرض تفاصيل الطلاب
function renderBranchDetails(branch) {
    if (!studentsData || studentsData.length === 0) {
        document.getElementById('topStudents').innerHTML = `
            <div class="no-students">
                <i class="fas fa-user-graduate"></i>
                <p>لا يوجد طلاب مسجلين في هذه الشعبة حالياً</p>
            </div>
        `;
        
        document.getElementById('studentsTableBody').innerHTML = `
            <tr class="no-students">
                <td colspan="4">
                    <i class="fas fa-user-graduate"></i>
                    <p>لا يوجد طلاب مسجلين في هذه الشعبة حالياً</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // عرض أفضل 3 طلاب
    const topStudents = [...studentsData]
        .sort((a, b) => b.average - a.average)
        .slice(0, 3);
    
    const topStudentsContainer = document.getElementById('topStudents');
    topStudentsContainer.innerHTML = '';
    
    topStudents.forEach((student, index) => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
            <div class="student-rank rank-${index + 1}">${index + 1}</div>
            <img src="${student.avatar || 'default-avatar.jpg'}" alt="${student.name}" class="student-avatar">
            <h4 class="student-name">${student.name}</h4>
            <div class="student-grade">المعدل: ${student.average}%</div>
            <p class="student-achievements">${student.achievements || 'لا توجد إنجازات مسجلة'}</p>
        `;
        topStudentsContainer.appendChild(studentCard);
    });
    
    // عرض جميع الطلاب في الجدول
    const studentsTableBody = document.getElementById('studentsTableBody');
    studentsTableBody.innerHTML = '';
    
    studentsData.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="student-info">
                    <img src="${student.avatar || 'default-avatar.jpg'}" alt="${student.name}" class="student-avatar-small">
                    ${student.name}
                </div>
            </td>
            <td>${student.average}%</td>
            <td>${student.attendance}%</td>
            <td>${student.achievements || '-'}</td>
        `;
        studentsTableBody.appendChild(row);
    });
}

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





function showBranchDetails(branch) {
    currentBranch = branch;
    
    // تحديث تفاصيل الشعبة
    document.getElementById('branchDetailTitle').textContent = `${branch.name} - ${currentGrade === 'تاسع' ? 'الصف التاسع' : 'البكالوريا'}`;
    document.getElementById('branchDetailDesc').textContent = branch.description;
    document.getElementById('studentsCount').textContent = branch.studentsCount;
    document.getElementById('startDate').textContent = branch.startDate;
    document.getElementById('completionRate').textContent = `${branch.completionRate}%`;
    document.getElementById('averageGrade').textContent = `${branch.averageGrade}%`;
    document.getElementById('branchProgress').style.width = `${branch.completionRate}%`;
    
    // تحديث الطلاب المميزين
    const topStudentsContainer = document.getElementById('topStudents');
    topStudentsContainer.innerHTML = '';
    
    // التحقق من وجود الطلاب قبل التصفية
    const students = branch.students || [];
    const distinguishedStudents = students.filter(student => student.isDistinguished);
    
    if (distinguishedStudents.length > 0) {
        distinguishedStudents.forEach((student, index) => {
            const studentCard = document.createElement('div');
            studentCard.className = 'student-card distinguished';
            studentCard.innerHTML = `
                <div class="student-rank">
                    <i class="fas fa-star"></i>
                    <span>${index + 1}</span>
                </div>
                <div class="student-avatar-container">
                    <img src="${student.avatar || 'default-avatar.jpg'}" alt="${student.name}" class="student-avatar">
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
                    <p class="student-achievements">${student.achievements || 'لا توجد إنجازات مسجلة'}</p>
                </div>
                <div class="student-badge">
                    <i class="fas fa-crown"></i>
                    <span>مميز</span>
                </div>
            `;
            topStudentsContainer.appendChild(studentCard);
        });
    } else {
        topStudentsContainer.innerHTML = `
            <div class="no-distinguished">
                <i class="fas fa-star"></i>
                <h4>لا يوجد طلاب مميزين حالياً</h4>
                <p>لم يتم اختيار أي طلاب كمميزين في هذه الشعبة</p>
            </div>
        `;
    }
    
    // تحديث جدول جميع الطلاب
    const studentsTableBody = document.getElementById('studentsTableBody');
    studentsTableBody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.className = student.isDistinguished ? 'distinguished-row' : '';
        row.innerHTML = `
            <td>
                <div class="student-info">
                    <img src="${student.avatar || 'default-avatar.jpg'}" alt="${student.name}" class="student-avatar-small">
                    ${student.name}
                    ${student.isDistinguished ? '<span class="distinguished-badge"><i class="fas fa-star"></i> مميز</span>' : ''}
                </div>
            </td>
            <td>${student.average}%</td>
            <td>${student.attendance}%</td>
            <td>${student.achievements || '-'}</td>
        `;
        studentsTableBody.appendChild(row);
    });
    
    // إخفاء جميع الأقسام وإظهار تفاصيل الشعبة
    hideAllSections();
    document.getElementById('branchDetails').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
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