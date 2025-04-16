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
        const data = {
            "تاسع": {
                title: "شعب الصف التاسع",
                branches: [
                    {
                        id: 1,
                        name: "الشعبة الأولى",
                        description: "شعبة علمية متميزة",
                        studentsCount: 30,
                        startDate: "01/09/2023",
                        completionRate: 75,
                        averageGrade: 85,
                        topStudents: [
                            {
                                id: 101,
                                name: "هيثم الغنام ",
                                avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                                grade: 98,
                                achievements: "حاصل على المركز الأول في مسابقة الرياضيات"
                            },
                            {
                                id: 102,
                                name: " احمد"  ,
                                avatar: "",
                                grade: 96,
                                achievements: "مهذب"
                            },
                            {
                                id: 103,
                                name: " حسن",
                                avatar: "https://randomuser.me/api/portraits/men/2.jpg",
                                grade: 94,
                                achievements: "فائز بجائزة أفضل "
                            }
                        ],
                        students: [
                            {id: 101, name: "هيثم غنام ", average: 98, attendance: "95%", achievements: "مركز أول"},
                            {id: 102, name: "احمد ", average: 96, attendance: "93%", achievements: "مركز ثاني"},
                            {id: 103, name: " حسن", average: 94, attendance: "90%", achievements: "مركز ثالث"},
                            {id: 104, name: "حسين", average: 92, attendance: "89%", achievements: "تفوق علمي"},
                            {id: 105, name: "عمر ", average: 90, attendance: "88%", achievements: "مشاركة مميزة"}
                        ]
                    },
                    {
                        id: 2,
                        name: "الشعبة الثانية",
                        description: "شعبة أدبية متميزة",
                        studentsCount: 28,
                        startDate: "01/09/2023",
                        completionRate: 80,
                        averageGrade: 82,
                        topStudents: [
                            {
                                id: 201,
                                name: "ناصر",
                                avatar: "",
                                grade: 97,
                                achievements: "حاصل على جائزة أفضل مقال أدبي"
                            },
                            {
                                id: 202,
                                name: "عمر كمال",
                                avatar: "https://randomuser.me/api/portraits/men/3.jpg",
                                grade: 95,
                                achievements: "فائز بمسابقة الخطابة"
                            },
                            {
                                id: 203,
                                name: "محمد السوري",
                                avatar: "",
                                grade: 93,
                                achievements: "مشارك في مؤتمر الأكل العربي"
                            }
                        ],
                        students: [
                            {id: 201, name: " ناصر", average: 97, attendance: "96%", achievements: "مركز أول"},
                            {id: 202, name: "عمر كمال", average: 95, attendance: "94%", achievements: "مركز ثاني"},
                            {id: 203, name: " محمد السوري", average: 93, attendance: "92%", achievements: "مركز ثالث"},
                            {id: 204, name: " خالد", average: 91, attendance: "90%", achievements: "تفوق أدبي"},
                            {id: 205, name: " عبد الرحمن", average: 89, attendance: "88%", achievements: "مشاركة مميزة"}
                        ]
                    }
                ]
            },
            "بكالوريا": {
                title: "شعب مرحلة البكالوريا",
                branches: [
                    {
                        id: 3,
                        name: "الشعبة العلمية",
                        description: "شعبة بكالوريا علمية",
                        studentsCount: 25,
                        startDate: "01/09/2023",
                        completionRate: 85,
                        averageGrade: 88,
                        topStudents: [
                            {
                                id: 301,
                                name: "عبد المجيد ",
                                avatar: "المطور.jpg",
                                grade: 99,
                                achievements: "حاصل على الدرجة النهائية في الرياضيات"
                            },
                            {
                                id: 302,
                                name: "زينب وائل",
                                avatar: "",
                                grade: 97,
                                achievements: "مشاركة في أولمبياد الفيزياء الدولية"
                            },
                            {
                                id: 303,
                                name: "باسل رامي",
                                avatar: "",
                                grade: 95,
                                achievements: "فائز بمسابقة الروبوتات"
                            }
                        ],
                        students: [
                            {id: 301, name: "علي حسين", average: 99, attendance: "98%", achievements: "مركز أول"},
                            {id: 302, name: "زينب وائل", average: 97, attendance: "96%", achievements: "مركز ثاني"},
                            {id: 303, name: "باسل رامي", average: 95, attendance: "94%", achievements: "مركز ثالث"},
                            {id: 304, name: "جنى سامي", average: 93, attendance: "92%", achievements: "تفوق علمي"},
                            {id: 305, name: "وسيم حازم", average: 91, attendance: "90%", achievements: "مشاركة مميزة"}
                        ]
                    },
                    {
                        id: 4,
                        name: "الشعبة الأدبية",
                        description: "شعبة بكالوريا أدبية (غير متاحة حالياً)",
                        studentsCount: 0,
                        startDate: "--/--/----",
                        completionRate: 0,
                        averageGrade: 0,
                        unavailable: true,
                        topStudents: [],
                        students: []
                    }
                ]
            }
        };

        // Current selected grade and branch
        let currentGrade = '';
        let currentBranch = null;

        // Show branches for selected grade
        function showBranches(grade) {
            currentGrade = grade;
            const gradeData = data[grade];
            
            // Update title
            document.getElementById('branchesTitle').textContent = gradeData.title;
            
            // Clear and populate branch cards
            const branchCardsContainer = document.getElementById('branchCards');
            branchCardsContainer.innerHTML = '';
            
            gradeData.branches.forEach(branch => {
                const branchCard = document.createElement('div');
                branchCard.className = 'branch-card';
                
                let unavailableBadge = '';
                if (branch.unavailable) {
                    unavailableBadge = '<div class="unavailable-badge">غير متاحة</div>';
                }
                
                branchCard.innerHTML = `
                    ${unavailableBadge}
                    <div class="branch-card-header">
                        <h3>${branch.name}</h3>
                        <p>${branch.description}</p>
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
                                <i class="fas fa-calendar-alt"></i>
                                <span>تاريخ البدء</span>
                                <strong>${branch.startDate}</strong>
                            </div>
                            <div class="branch-info-item">
                                <i class="fas fa-percentage"></i>
                                <span>الإكتمال</span>
                                <strong>${branch.completionRate}%</strong>
                            </div>
                        </div>
                    </div>
                `;
                
                if (!branch.unavailable) {
                    branchCard.addEventListener('click', () => showBranchDetails(branch));
                } else {
                    branchCard.style.opacity = '0.7';
                    branchCard.style.cursor = 'not-allowed';
                }
                
                branchCardsContainer.appendChild(branchCard);
            });
            
            // Hide all sections and show branches section
            hideAllSections();
            document.getElementById('branchesSection').style.display = 'block';
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

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
const teachersData = [
    {
        id: 1,
        name: "عبد الرزاق الأحمد",
        subject: "الاجتماعيات",
        age: 42,
        experience: "15 سنة",
        certificates: "ماجستير في التاريخ - جامعة دمشق",
        bio: "مدرس متميز بخبرة طويلة في تدريس المواد الاجتماعية",
        avatar: ""
    },
    {
        id: 2,
        name: "عبد القادر",
        subject: "الرياضيات",
        age: 38,
        experience: "12 سنة",
        certificates: "بكالوريوس رياضيات - جامعة حلب",
        bio: "متخصص في الرياضيات التحليلية والهندسية",
        avatar: ""
    },
    {
        id: 3,
        name: "موفق",
        subject: "اللغة الإنجليزية",
        age: 35,
        experience: "10 سنوات",
        certificates: "دبلوم تربوي - جامعة القاهرة",
        bio: "خبير في تعليم اللغة الإنجليزية للمراحل الثانوية",
        avatar: ""
    },
    {
        id: 4,
        name: "أحمد السهو",
        subject: "العلوم العامة",
        age: 40,
        experience: "14 سنة",
        certificates: "ماجستير في العلوم التربوية",
        bio: "مختص في تدريس المنهج العلمي التجريبي",
        avatar: ""
    },
    {
        id: 5,
        name: "ابتسام الدهماش",
        subject: "اللغة العربية",
        age: 45,
        experience: "20 سنة",
        certificates: "دكتوراة في الأدب العربي",
        bio: "مديرة المعهد وخبيرة في المناهج التعليمية",
        avatar: ""
    },
    {
        id: 6,
        name: "هند",
        subject: "اللغة الفرنسية",
        age: 33,
        experience: "8 سنوات",
        certificates: "ليسانس آداب - فرنساوي",
        bio: "متخصصة في تعليم الفرنسية للمبتدئين",
        avatar: ""
    }
];

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





        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            showHome();
        });



