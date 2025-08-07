

// حالات النظام
let currentUser = null;
let isAdmin = false;
let currentSection = '';
let editMode = false;
let currentEditId = null;

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء عناصر DOM للوحة التحكم إذا لم تكن موجودة
    createDashboardElements();
    
    // التحقق من وجود مستخدم مسجل
    checkLoggedInUser();
});

// إنشاء عناصر DOM للوحة التحكم
function createDashboardElements() {
    const body = document.body;
    
    // إنشاء قسم تسجيل الدخول إذا لم يكن موجوداً
    if (!document.getElementById('loginSection')) {
        const loginSection = document.createElement('section');
        loginSection.id = 'loginSection';
        loginSection.className = 'dashboard-section';
        loginSection.style.display = 'none';
        loginSection.innerHTML = `






        
            <div class="login-container">
                <div class="login-header">
                    <h2><i class="fas fa-lock"></i> تسجيل الدخول</h2>
                    <p>الرجاء إدخال بيانات الدخول للوصول إلى لوحة التحكم</p>
                </div>
                
                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="username"><i class="fas fa-user"></i> اسم المستخدم</label>
                        <input type="text" id="username" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password"><i class="fas fa-key"></i> كلمة المرور</label>
                        <input type="password" id="password" required>
                    </div>
                    
                    <div class="form-group form-check">
                        <input type="checkbox" id="rememberMe" class="form-check-input">
                        <label for="rememberMe" class="form-check-label">تذكرني</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-sign-in-alt"></i> دخول
                        </button>
                    </div>


                    
                    <div id="loginMessage" class="message"></div>
                </form>
            </div>
        `;
        body.appendChild(loginSection);
        
        // إضافة أحداث النموذج
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        
        // تحميل بيانات تذكرني إذا وجدت
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe) {
            document.getElementById('rememberMe').checked = true;
            const savedUsername = localStorage.getItem('savedUsername');
            if (savedUsername) {
                document.getElementById('username').value = savedUsername;
            }
        }
    }
    
    // إنشاء قسم لوحة التحكم إذا لم يكن موجوداً
    if (!document.getElementById('dashboardSection')) {
        const dashboardSection = document.createElement('section');
        dashboardSection.id = 'dashboardSection';
        dashboardSection.className = 'dashboard-section';
        dashboardSection.style.display = 'none';
        dashboardSection.innerHTML = `
            <div class="dashboard-container">
                <!-- الشريط الجانبي -->
                <aside class="dashboard-sidebar">
                    <div class="user-profile">
                        <div class="avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="user-info">
                            <h3 id="loggedInUsername">مرحباً</h3>
                            <p id="loggedInRole">دور المستخدم</p>
                        </div>
                    </div>
                    
         // في دالة createDashboardElements، تحديث القائمة الجانبية:
nav class="dashboard-nav">
    <ul>
        <li><a href="#" onclick="showDashboardSection('dashboardHome')" class="nav-link"><i class="fas fa-home"></i> الرئيسية</a></li>
        <li><a href="#" onclick="showDashboardSection('manageExams')" class="nav-link"><i class="fas fa-file-pdf"></i> الامتحانات</a></li>
        <li><a href="#" onclick="showDashboardSection('manageQuizzes')" class="nav-link"><i class="fas fa-question-circle"></i> الامتحانات السريعة</a></li>
        <li><a href="#" onclick="showDashboardSection('manageBranches')" class="nav-link" id="adminBranchesLink"><i class="fas fa-graduation-cap"></i> الشعب</a></li>
        <li><a href="#" onclick="showDashboardSection('manageStudents')" class="nav-link" id="adminStudentsLink"><i class="fas fa-users"></i> الطلاب</a></li>
        <li><a href="#" onclick="showDashboardSection('manageTeachers')" class="nav-link" id="adminTeachersLink"><i class="fas fa-chalkboard-teacher"></i> الأساتذة</a></li>
        <li><a href="#" onclick="showDashboardSection('manageUsers')" class="nav-link" id="adminUsersLink"><i class="fas fa-user-cog"></i> المستخدمين</a></li>
    </ul>
</nav>
                    
                    <div class="logout-section">
                        <button onclick="logout()" class="btn btn-logout">
                            <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                        </button>
                    </div>
                </aside>
                
                <!-- المحتوى الرئيسي -->
                <main class="dashboard-content">
                    <!-- سيتم تحميل المحتوى الديناميكي هنا -->
                    <div id="dashboardContent"></div>
                </main>
            </div>
        `;
        body.appendChild(dashboardSection);
    }
}

// التحقق من وجود مستخدم مسجل
function checkLoggedInUser() {
    const savedUser = localStorage.getItem('savedUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            if (currentUser && typeof currentUser === 'object') {
                setupDashboard();
            } else {
                throw new Error('Invalid user data');
            }
        } catch (e) {
            console.error('Error parsing saved user:', e);
            localStorage.removeItem('savedUser');
            showLoginPage();
        }
    } else {
        showLoginPage();
    }
}

// عرض صفحة تسجيل الدخول
function showLoginPage() {
    hideAllSections();
    document.getElementById('loginSection').style.display = 'flex';
}

// معالجة تسجيل الدخول
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const messageElement = document.getElementById('loginMessage');
    
    if (!username || !password) {
        showMessage(messageElement, 'الرجاء إدخال اسم المستخدم وكلمة المرور', 'error');
        return;
    }
    
    try {
        // جلب بيانات المستخدمين من JSONBin
        const users = await fetchUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // حفظ بيانات المستخدم
            currentUser = user;
            localStorage.setItem('savedUser', JSON.stringify(user));
            
            // حفظ تفضيل تذكرني
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedUsername', username);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('savedUsername');
            }
            
            // تهيئة لوحة التحكم
            setupDashboard();
        } else {
            showMessage(messageElement, 'اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage(messageElement, 'حدث خطأ أثناء محاولة الدخول. يرجى المحاولة لاحقاً', 'error');
    }
}

// جلب بيانات المستخدمين من JSONBin
async function fetchUsers() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.USERS.BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.USERS.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const data = await response.json();
        return data.record.users || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

// تهيئة لوحة التحكم بعد تسجيل الدخول
function setupDashboard() {
    hideAllSections();
    
    // تحديث معلومات المستخدم
    document.getElementById('loggedInUsername').textContent = currentUser.name || currentUser.username;
    document.getElementById('loggedInRole').textContent = getRoleName(currentUser.role);
    
    // التحقق من صلاحيات المدير
    isAdmin = currentUser.role === 'admin';
    
    // إظهار/إخفاء عناصر القائمة حسب الصلاحيات
    document.getElementById('adminUsersLink').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('adminBranchesLink').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('adminStudentsLink').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('adminTeachersLink').style.display = isAdmin ? 'block' : 'none';
    
    // عرض لوحة التحكم
    document.getElementById('dashboardSection').style.display = 'flex';
    
    // ضبط أبعاد لوحة التحكم
    const dashboardSection = document.getElementById('dashboardSection');
    dashboardSection.style.position = 'fixed';
    dashboardSection.style.top = '0';
    dashboardSection.style.left = '0';
    dashboardSection.style.width = '100vw';
    dashboardSection.style.height = '100vh';
    dashboardSection.style.overflow = 'auto';
    
    // عرض القسم الافتراضي
    showDashboardSection('dashboardHome');
}

// الحصول على اسم الدور
function getRoleName(role) {
    const roles = {
        'admin': 'مدير النظام',
        'teacher': 'أستاذ',
        'arabic': 'أستاذ اللغة العربية',
        'math': 'أستاذ الرياضيات',
        'science': 'أستاذ العلوم',
        'english': 'أستاذ الإنجليزية',
        'social': 'أستاذ الاجتماعيات'
    };
    return roles[role] || 'مستخدم';
}

// الحصول على اسم المادة
function getSubjectName(subject) {
    const subjects = {
        'math': 'الرياضيات',
        'science': 'العلوم',
        'arabic': 'اللغة العربية',
        'english': 'الإنجليزية',
        'french': 'الفرنسية',
        'social': 'الاجتماعيات',
        'religion': 'الديانة'
    };
    return subjects[subject] || subject;
}

// عرض قسم معين في لوحة التحكم


// عرض رسالة عدم التصريح
function showUnauthorized() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = `
        <div class="unauthorized-message">
            <i class="fas fa-ban"></i>
            <h3>غير مصرح لك بالوصول إلى هذه الصفحة</h3>
            <p>ليست لديك الصلاحيات الكافية للوصول إلى هذا القسم.</p>
            <button onclick="showDashboardSection('dashboardHome')" class="btn btn-primary">
                العودة إلى الرئيسية
            </button>
        </div>
    `;
}

// تحميل الصفحة الرئيسية للوحة التحكم
function loadDashboardHome() {
    const contentElement = document.getElementById('dashboardContent');
    
    let subjectExamsLink = '';
    if (!isAdmin && currentUser.role !== 'teacher') {
        subjectExamsLink = `<a href="#" onclick="showDashboardSection('manageExams')" class="dashboard-card">
            <i class="fas fa-file-pdf"></i>
            <h3>إدارة امتحانات ${getRoleName(currentUser.role)}</h3>
            <p>عرض وإدارة امتحانات المادة الخاصة بك</p>
        </a>`;
    }
    
    contentElement.innerHTML = `



<div class="sidebar-footer">
    <a href="index.html" class="sidebar-btn" id="homeBtn">
        <i class="fas fa-home"></i>
        <span>الرئيسية</span>
    </a>
    <button onclick="logout()" class="sidebar-btn" id="logoutBtn">
        <i class="fas fa-sign-out-alt"></i>
        <span>تسجيل الخروج</span>
    </button>
</div>


        <div class="content-header">
            <h2 class="content-title">لوحة التحكم الرئيسية</h2>
            ${createBackButtons()}
        </div>
        
        <div class="welcome-message">
            <div class="welcome-text">
                <h3>مرحباً ${currentUser.name || currentUser.username}</h3>
                <p>يمكنك من خلال هذه اللوحة إدارة المحتوى التعليمي للمعهد حسب الصلاحيات الممنوحة لك.</p>
            </div>
            <div class="welcome-stats">
                <div class="stat-card">
                    <i class="fas fa-user-tie"></i>
                    <span>دورك</span>
                    <strong>${getRoleName(currentUser.role)}</strong>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calendar-alt"></i>
                    <span>آخر دخول</span>
                    <strong>${new Date().toLocaleDateString('ar-EG')}</strong>
                </div>
            </div>
        </div>
        
        <div class="dashboard-cards">
            ${subjectExamsLink}
            
            ${isAdmin ? `
            <a href="#" onclick="showDashboardSection('manageBranches')" class="dashboard-card">
                <i class="fas fa-graduation-cap"></i>
                <h3>إدارة الشعب</h3>
                <p>إضافة وتعديل وحذف الشعب الدراسية</p>
            </a>
            
            <a href="#" onclick="showDashboardSection('manageStudents')" class="dashboard-card">
                <i class="fas fa-users"></i>
                <h3>إدارة الطلاب</h3>
                <p>إضافة وتعديل وحذف سجلات الطلاب</p>
            </a>
            
            <a href="#" onclick="showDashboardSection('manageTeachers')" class="dashboard-card">
                <i class="fas fa-chalkboard-teacher"></i>
                <h3>إدارة الأساتذة</h3>
                <p>إضافة وتعديل وحذف سجلات الأساتذة</p>
            </a>

              <a href="#" onclick="showDashboardSection('show')" class="dashboard-card">
                <i class="fas fa-user-cog"></i>
                <h3>إدارة المستخدمين</h3>
                <p>إضافة وتعديل وحذف حسابات المستخدمين</p>
            </a>

            <a href="#" onclick="showDashboardSection('manageQuizzes')" class="dashboard-card">
           <i class="fa-solid fa-bolt fa-xl" style="color: #2c9cf2;"></i>
                <h3>الامتحانات السريعه</h3>
                <p>إضافة وتعديل الامتحانات السريعه</p>
            </a>
            ` : ''}
        </div>
        
        <div class="quick-actions">
            <h3><i class="fas fa-bolt"></i> إجراءات سريعة</h3>
            <div class="actions-grid">
                <button onclick="showDashboardSection('manageExams')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الامتحانات
                </button>
                
                ${isAdmin ? `
                <button onclick="showDashboardSection('manageBranches')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الشعب
                </button>
                
                <button onclick="showDashboardSection('manageStudents')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الطلاب
                </button>
                
                <button onclick="showDashboardSection('manageTeachers')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الأساتذة
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

// تحميل قسم إدارة الامتحانات
async function loadManageExams() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل الامتحانات...</p></div>';
    
    try {
        // جلب الامتحانات من JSONBin
        const exams = await fetchExams();
        
        // تصفية الامتحانات حسب الصلاحيات
        let filteredExams = exams;
        if (!isAdmin && currentUser.role !== 'teacher') {
            filteredExams = exams.filter(exam => exam.subject === currentUser.role);
        }
        
        // إنشاء واجهة إدارة الامتحانات
        let examsList = '';
        if (filteredExams.length > 0) {
            examsList = filteredExams.map(exam => `
                <div class="exam-item">
                    <div class="exam-info">
                        <h3>${exam.title}</h3>
                        <div class="exam-meta">
                            <span><i class="fas fa-book"></i> ${getSubjectName(exam.subject)}</span>
                            <span><i class="fas fa-calendar"></i> ${formatDate(exam.publishDate)}</span>
                            <span><i class="fas fa-download"></i> ${exam.downloads || 0} تحميل</span>
                        </div>
                    </div>
                    <div class="exam-actions">
                        <button onclick="editExam('${exam.id}')" class="btn btn-edit">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button onclick="deleteExam('${exam.id}')" class="btn btn-delete">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            examsList = '<div class="no-items">لا توجد امتحانات مسجلة</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل امتحان
        let examForm = '';
        if (isAdmin || currentUser.role === 'teacher' || ['arabic', 'math', 'science', 'english', 'social'].includes(currentUser.role)) {
            examForm = `
                <div class="exam-form">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إضافة'} امتحان</h3>
                    <form id="examForm" enctype="multipart/form-data">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="examTitle">عنوان الامتحان</label>
                                <input type="text" id="examTitle" required>
                            </div>
                            
                            ${isAdmin ? `
                            <div class="form-group">
                                <label for="examSubject">المادة</label>
                                <select id="examSubject" required>
                                    <option value="math">الرياضيات</option>
                                    <option value="science">العلوم</option>
                                    <option value="arabic">اللغة العربية</option>
                                    <option value="english">الإنجليزية</option>
                                    <option value="french">الفرنسية</option>
                                    <option value="social">الاجتماعيات</option>
                                    <option value="religion">الديانة</option>
                                </select>
                            </div>
                            ` : `
                            <input type="hidden" id="examSubject" value="${currentUser.role}">
                            `}
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="examGrade">الصف</label>
                                <select id="examGrade" required>
                                    <option value="t9">تاسع</option>
                                    <option value="bac">بكالوريا</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="examFile">ملف الامتحان (PDF)</label>
                                <input type="file" id="examFile" accept=".pdf" ${editMode ? '' : 'required'}>
                                ${editMode ? '<small>اتركه فارغاً إذا كنت لا تريد تغيير الملف</small>' : ''}
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'}
                            </button>
                        </div>
                    </form>
                </div>
            `;
        }
        
        contentElement.innerHTML = `
            <div class="manage-exams">
                <div class="section-header">
                    <h2><i class="fas fa-file-pdf"></i> إدارة الامتحانات</h2>
                    <p>يمكنك من هنا إضافة وتعديل وحذف الامتحانات حسب الصلاحيات الممنوحة لك</p>
                    ${createBackButtons()}
                </div>
                
                ${examForm}
                
                <div class="exams-list">
                    <h3><i class="fas fa-list"></i> قائمة الامتحانات</h3>
                    ${examsList}
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const examToEdit = exams.find(e => e.id === currentEditId);
            if (examToEdit) {
                document.getElementById('examTitle').value = examToEdit.title;
                if (isAdmin) {
                    document.getElementById('examSubject').value = examToEdit.subject;
                }
                document.getElementById('examGrade').value = examToEdit.grade;
            }
        }
        
        // إضافة أحداث النموذج
        if (document.getElementById('examForm')) {
            document.getElementById('examForm').addEventListener('submit', handleSaveExam);
        }
    } catch (error) {
        console.error('Error loading exams:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الامتحانات</h3>
                <p>${error.message}</p>
                <button onclick="loadManageExams()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// جلب الامتحانات من JSONBin
async function fetchExams() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.EXAMS.BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.EXAMS.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch exams');
        
        const data = await response.json();
        return data.record.exams || [];
    } catch (error) {
        console.error('Error fetching exams:', error);
        throw error;
    }
}



// قراءة ملف كـ base64


// تحديث الامتحانات على JSONBin
async function updateExams(exams) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.EXAMS.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.EXAMS.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ exams: exams })
        });
        
        if (!response.ok) throw new Error('Failed to update exams');
    } catch (error) {
        console.error('Error updating exams:', error);
        throw error;
    }
}

// تحميل قسم إدارة الشعب (للمدير فقط)

// جلب الشعب من JSONBin
async function fetchBranches() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.BRANCHES.BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.BRANCHES.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch branches');
        
        const data = await response.json();
        return data.record.branches || [];
    } catch (error) {
        console.error('Error fetching branches:', error);
        throw error;
    }
}

// معالجة حفظ الشعبة (إضافة/تعديل)
async function handleSaveBranch(e) {
    e.preventDefault();
    
    const name = document.getElementById('branchName').value;
    const grade = document.getElementById('branchGrade').value;
    const teacher = document.getElementById('branchTeacher').value;
    const studentsCount = document.getElementById('branchStudents').value;
    const desc = document.getElementById('branchDesc').value;
    
    if (!name || !grade || !teacher || !studentsCount) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // جلب الشعب الحالية
        const branches = await fetchBranches();
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const branchIndex = branches.findIndex(b => b.id === currentEditId);
            if (branchIndex !== -1) {
                branches[branchIndex] = {
                    ...branches[branchIndex],
                    name: name,
                    grade: grade,
                    teacher: teacher,
                    studentsCount: parseInt(studentsCount),
                    description: desc || 'لا يوجد وصف'
                };
                
                // تحديث البيانات على JSONBin
                await updateBranches(branches);
                
                showMessage('تم تحديث الشعبة بنجاح', 'success');
                loadManageBranches();
            }
        } else {
            // حالة الإضافة
            const newBranch = {
                id: generateId(),
                name: name,
                grade: grade,
                teacher: teacher,
                studentsCount: parseInt(studentsCount),
                description: desc || 'لا يوجد وصف',
                completionRate: 0,
                averageGrade: 0,
                startDate: new Date().toISOString(),
                isActive: true
            };
            
            branches.push(newBranch);
            
            // تحديث البيانات على JSONBin
            await updateBranches(branches);
            
            showMessage('تمت إضافة الشعبة بنجاح', 'success');
            loadManageBranches();
        }
    } catch (error) {
        console.error('Error saving branch:', error);
        showMessage('حدث خطأ أثناء حفظ الشعبة', 'error');
    }
}

// تحديث الشعب على JSONBin
async function updateBranches(branches) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.BRANCHES.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.BRANCHES.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ branches: branches })
        });
        
        if (!response.ok) throw new Error('Failed to update branches');
    } catch (error) {
        console.error('Error updating branches:', error);
        throw error;
    }
}

// تحميل قسم إدارة الطلاب (للمدير فقط)
async function loadManageStudents() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل الطلاب...</p></div>';
    
    try {
        // جلب الطلاب من JSONBin
        const students = await fetchStudents();
        // جلب الشعب لاستخدامها في الفلترة
        const branches = await fetchBranches();
        
        // إنشاء واجهة إدارة الطلاب
        let studentsTable = '';
        if (students.length > 0) {
            studentsTable = `
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>الشعبة</th>
                            <th>المعدل</th>
                            <th>الحضور</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(student => {
                            const branch = branches.find(b => b.id === student.branchId) || {};
                            return `
                                <tr>
                                    <td>
                                        <div class="student-info">
                                            <div class="avatar">
                                                ${student.avatar ? 
                                                    `<img src="data:image/jpeg;base64,${student.avatar}" alt="${student.name}">` : 
                                                    `<i class="fas fa-user-graduate"></i>`}
                                            </div>
                                            ${student.name}
                                        </div>
                                    </td>
                                    <td>${branch.name || 'غير محدد'}</td>
                                    <td>${student.average}%</td>
                                    <td>${student.attendance}%</td>
                                    <td>
                                        <button onclick="editStudent('${student.id}')" class="btn btn-edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deleteStudent('${student.id}')" class="btn btn-delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        } else {
            studentsTable = '<div class="no-items">لا توجد طلاب مسجلين</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل طالب
        contentElement.innerHTML = `
            <div class="manage-students">
                <div class="section-header">
                    <h2><i class="fas fa-users"></i> إدارة الطلاب</h2>
                    <p>يمكنك من هنا إضافة وتعديل وحذف سجلات الطلاب</p>
                    ${createBackButtons()}
                </div>
                
                <div class="students-actions">
                    <div class="search-filter">
                        <input type="text" id="studentSearch" placeholder="بحث باسم الطالب...">
                        <select id="branchFilter">
                            <option value="all">كل الشعب</option>
                            ${branches.map(branch => `
                                <option value="${branch.id}">${branch.name}</option>
                            `).join('')}
                        </select>
                        <button onclick="filterStudents()" class="btn btn-filter">
                            <i class="fas fa-filter"></i> تصفية
                        </button>
                    </div>
                    
                    <button onclick="showStudentForm()" class="btn btn-primary">
                        <i class="fas fa-plus"></i> ${editMode ? 'تعديل' : 'إضافة'} طالب
                    </button>
                </div>
                
                <div class="students-list">
                    ${studentsTable}
                </div>
                
                <div class="student-form" id="studentForm" style="display:${editMode ? 'block' : 'none'}">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إضافة'} طالب</h3>
                    <form id="studentFormElement">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="studentName">اسم الطالب</label>
                                <input type="text" id="studentName" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="studentBranch">الشعبة</label>
                                <select id="studentBranch" required>
                                    ${branches.map(branch => `
                                        <option value="${branch.id}">${branch.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="studentAverage">المعدل</label>
                                <input type="number" id="studentAverage" min="0" max="100" step="0.1" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="studentAttendance">نسبة الحضور</label>
                                <input type="number" id="studentAttendance" min="0" max="100" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="studentAchievements">الإنجازات</label>
                            <textarea id="studentAchievements" rows="2"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="studentAvatar">صورة الطالب (اختياري)</label>
                            <input type="file" id="studentAvatar" accept="image/*">
                            ${editMode ? '<small>اتركه فارغاً إذا كنت لا تريد تغيير الصورة</small>' : ''}
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" onclick="hideStudentForm()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const studentToEdit = students.find(s => s.id === currentEditId);
            if (studentToEdit) {
                document.getElementById('studentName').value = studentToEdit.name;
                document.getElementById('studentBranch').value = studentToEdit.branchId;
                document.getElementById('studentAverage').value = studentToEdit.average;
                document.getElementById('studentAttendance').value = studentToEdit.attendance;
                document.getElementById('studentAchievements').value = studentToEdit.achievements || '';
            }
        }
        
        // إضافة أحداث النموذج
        document.getElementById('studentFormElement').addEventListener('submit', handleSaveStudent);
    } catch (error) {
        console.error('Error loading students:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الطلاب</h3>
                <p>${error.message}</p>
                <button onclick="loadManageStudents()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// جلب الطلاب من JSONBin
async function fetchStudents() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.STUDENTS.BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.STUDENTS.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const data = await response.json();
        return data.record.students || [];
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

// معالجة حفظ الطالب (إضافة/تعديل)
async function handleSaveStudent(e) {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value;
    const branchId = document.getElementById('studentBranch').value;
    const average = document.getElementById('studentAverage').value;
    const attendance = document.getElementById('studentAttendance').value;
    const achievements = document.getElementById('studentAchievements').value;
    const avatarInput = document.getElementById('studentAvatar');
    
    if (!name || !branchId || !average || !attendance) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // جلب الطلاب الحاليين
        const students = await fetchStudents();
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const studentIndex = students.findIndex(s => s.id === currentEditId);
            if (studentIndex !== -1) {
                // معالجة صورة الطالب إذا تم تحميلها
                let avatarBase64 = students[studentIndex].avatar;
                if (avatarInput.files[0]) {
                    avatarBase64 = await readFileAsBase64(avatarInput.files[0]);
                }
                
                students[studentIndex] = {
                    ...students[studentIndex],
                    name: name,
                    branchId: branchId,
                    average: parseFloat(average),
                    attendance: parseInt(attendance),
                    achievements: achievements || 'لا توجد إنجازات',
                    avatar: avatarBase64 || ''
                };
                
                // تحديث البيانات على JSONBin
                await updateStudents(students);
                
                showMessage('تم تحديث الطالب بنجاح', 'success');
                loadManageStudents();
            }
        } else {
            // حالة الإضافة
            // معالجة صورة الطالب إذا تم تحميلها
            let avatarBase64 = '';
            if (avatarInput.files[0]) {
                avatarBase64 = await readFileAsBase64(avatarInput.files[0]);
            }
            
            // إنشاء طالب جديد
            const newStudent = {
                id: generateId(),
                name: name,
                branchId: branchId,
                average: parseFloat(average),
                attendance: parseInt(attendance),
                achievements: achievements || 'لا توجد إنجازات',
                avatar: avatarBase64 || ''
            };
            
            students.push(newStudent);
            
            // تحديث البيانات على JSONBin
            await updateStudents(students);
            
            showMessage('تمت إضافة الطالب بنجاح', 'success');
            loadManageStudents();
        }
    } catch (error) {
        console.error('Error saving student:', error);
        showMessage('حدث خطأ أثناء حفظ الطالب', 'error');
    }
}

// تحديث الطلاب على JSONBin
async function updateStudents(students) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.STUDENTS.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.STUDENTS.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ students: students })
        });
        
        if (!response.ok) throw new Error('Failed to update students');
    } catch (error) {
        console.error('Error updating students:', error);
        throw error;
    }
}

// تحميل قسم إدارة الأساتذة (للمدير فقط)
async function loadManageTeachers() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل الأساتذة...</p></div>';
    
    try {
        // جلب الأساتذة من JSONBin
        const teachers = await fetchTeachers();
        // جلب الشعب لاستخدامها في الفلترة
        const branches = await fetchBranches();
        
        // إنشاء واجهة إدارة الأساتذة
        let teachersList = '';
        if (teachers.length > 0) {
            teachersList = teachers.map(teacher => `
                <div class="teacher-item">
                    <div class="teacher-info">
                        <div class="avatar">
                            ${teacher.avatar ? 
                                `<img src="data:image/jpeg;base64,${teacher.avatar}" alt="${teacher.name}">` : 
                                `<i class="fas fa-user-tie"></i>`}
                        </div>
                        <div class="details">
                            <h3>${teacher.name}</h3>
                            <p><i class="fas fa-book"></i> ${getSubjectName(teacher.subject)}</p>
                            <p><i class="fas fa-graduation-cap"></i> ${teacher.branch || 'جميع الشعب'}</p>
                            <p><i class="fas fa-briefcase"></i> ${teacher.experience}</p>
                        </div>
                    </div>
                    <div class="teacher-actions">
                        <button onclick="editTeacher('${teacher.id}')" class="btn btn-edit">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button onclick="deleteTeacher('${teacher.id}')" class="btn btn-delete">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            teachersList = '<div class="no-items">لا توجد أساتذة مسجلين</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل أستاذ
        contentElement.innerHTML = `
            <div class="manage-teachers">
                <div class="section-header">
                    <h2><i class="fas fa-chalkboard-teacher"></i> إدارة الأساتذة</h2>
                    <p>يمكنك من هنا إضافة وتعديل وحذف سجلات الأساتذة</p>
                    ${createBackButtons()}
                </div>
                
                <div class="teacher-form">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إضافة'} أستاذ</h3>
                    <form id="teacherFormElement">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="teacherName">اسم الأستاذ</label>
                                <input type="text" id="teacherName" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="teacherSubject">المادة</label>
                                <select id="teacherSubject" required>
                                    <option value="math">الرياضيات</option>
                                    <option value="science">العلوم</option>
                                    <option value="arabic">اللغة العربية</option>
                                    <option value="english">الإنجليزية</option>
                                    <option value="social">الاجتماعيات</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="teacherBranch">الشعبة</label>
                                <select id="teacherBranch">
                                    <option value="">جميع الشعب</option>
                                    ${branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="teacherPhone">رقم الهاتف</label>
                                <input type="tel" id="teacherPhone">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="teacherExperience">سنوات الخبرة</label>
                                <input type="number" id="teacherExperience" min="0" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="teacherLectures">عدد المحاضرات الأسبوعية</label>
                                <input type="number" id="teacherLectures" min="1" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="teacherCertificates">الشهادات العلمية</label>
                            <textarea id="teacherCertificates" rows="2"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="teacherBio">نبذة عن الأستاذ</label>
                            <textarea id="teacherBio" rows="3"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="teacherAvatar">صورة الأستاذ (اختياري)</label>
                            <input type="file" id="teacherAvatar" accept="image/*">
                            ${editMode ? '<small>اتركه فارغاً إذا كنت لا تريد تغيير الصورة</small>' : ''}
                        </div>
                        
                        <div class="form-actions">
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="teachers-list">
                    <h3><i class="fas fa-list"></i> قائمة الأساتذة</h3>
                    ${teachersList}
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const teacherToEdit = teachers.find(t => t.id === currentEditId);
            if (teacherToEdit) {
                document.getElementById('teacherName').value = teacherToEdit.name;
                document.getElementById('teacherSubject').value = teacherToEdit.subject;
                document.getElementById('teacherBranch').value = teacherToEdit.branch || '';
                document.getElementById('teacherPhone').value = teacherToEdit.phone || '';
                document.getElementById('teacherExperience').value = parseInt(teacherToEdit.experience) || 0;
                document.getElementById('teacherLectures').value = parseInt(teacherToEdit.lectures) || 0;
                document.getElementById('teacherCertificates').value = teacherToEdit.certificates || '';
                document.getElementById('teacherBio').value = teacherToEdit.bio || '';
            }
        }
        
        // إضافة أحداث النموذج
        document.getElementById('teacherFormElement').addEventListener('submit', handleSaveTeacher);
    } catch (error) {
        console.error('Error loading teachers:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الأساتذة</h3>
                <p>${error.message}</p>
                <button onclick="loadManageTeachers()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// جلب الأساتذة من JSONBin
async function fetchTeachers() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.TEACHERS.BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.TEACHERS.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch teachers');
        
        const data = await response.json();
        return data.record.teachers || [];
    } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
    }
}

// معالجة حفظ الأستاذ (إضافة/تعديل)
async function handleSaveTeacher(e) {
    e.preventDefault();
    
    const name = document.getElementById('teacherName').value;
    const subject = document.getElementById('teacherSubject').value;
    const branch = document.getElementById('teacherBranch').value;
    const phone = document.getElementById('teacherPhone').value;
    const experience = document.getElementById('teacherExperience').value;
    const lectures = document.getElementById('teacherLectures').value;
    const certificates = document.getElementById('teacherCertificates').value;
    const bio = document.getElementById('teacherBio').value;
    const avatarInput = document.getElementById('teacherAvatar');
    
    if (!name || !subject || !experience || !lectures) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // جلب الأساتذة الحاليين
        const teachers = await fetchTeachers();
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const teacherIndex = teachers.findIndex(t => t.id === currentEditId);
            if (teacherIndex !== -1) {
                // معالجة صورة الأستاذ إذا تم تحميلها
                let avatarBase64 = teachers[teacherIndex].avatar;
                if (avatarInput.files[0]) {
                    avatarBase64 = await readFileAsBase64(avatarInput.files[0]);
                }
                
                teachers[teacherIndex] = {
                    ...teachers[teacherIndex],
                    name: name,
                    subject: subject,
                    branch: branch || '',
                    phone: phone || '',
                    experience: `${experience} سنوات`,
                    lectures: `${lectures} محاضرة أسبوعياً`,
                    certificates: certificates || 'غير محدد',
                    bio: bio || 'لا توجد معلومات إضافية',
                    avatar: avatarBase64 || ''
                };
                
                // تحديث البيانات على JSONBin
                await updateTeachers(teachers);
                
                showMessage('تم تحديث الأستاذ بنجاح', 'success');
                loadManageTeachers();
            }
        } else {
            // حالة الإضافة
            // معالجة صورة الأستاذ إذا تم تحميلها
            let avatarBase64 = '';
            if (avatarInput.files[0]) {
                avatarBase64 = await readFileAsBase64(avatarInput.files[0]);
            }
            
            // إنشاء أستاذ جديد
            const newTeacher = {
                id: generateId(),
                name: name,
                subject: subject,
                branch: branch || '',
                phone: phone || '',
                experience: `${experience} سنوات`,
                lectures: `${lectures} محاضرة أسبوعياً`,
                certificates: certificates || 'غير محدد',
                bio: bio || 'لا توجد معلومات إضافية',
                avatar: avatarBase64 || ''
            };
            
            teachers.push(newTeacher);
            
            // تحديث البيانات على JSONBin
            await updateTeachers(teachers);
            
            showMessage('تمت إضافة الأستاذ بنجاح', 'success');
            loadManageTeachers();
        }
    } catch (error) {
        console.error('Error saving teacher:', error);
        showMessage('حدث خطأ أثناء حفظ الأستاذ', 'error');
    }
}

// تحديث الأساتذة على JSONBin
async function updateTeachers(teachers) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.TEACHERS.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.TEACHERS.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teachers: teachers })
        });
        
        if (!response.ok) throw new Error('Failed to update teachers');
    } catch (error) {
        console.error('Error updating teachers:', error);
        throw error;
    }
}

// تحميل قسم إدارة المستخدمين (للمدير فقط)
async function loadManageUsers() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل المستخدمين...</p></div>';
    
    try {
        // جلب المستخدمين من JSONBin
        const users = await fetchUsers();
        
        // إنشاء واجهة إدارة المستخدمين
        let usersTable = '';
        if (users.length > 0) {
            usersTable = `
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>اسم المستخدم</th>
                            <th>الاسم</th>
                            <th>الدور</th>
                            <th>آخر دخول</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.username}</td>
                                <td>${user.name || 'غير محدد'}</td>
                                <td>${getRoleName(user.role)}</td>
                                <td>${user.lastLogin ? formatDate(user.lastLogin) : 'غير محدد'}</td>
                                <td>
                                    <button onclick="editUser('${user.username}')" class="btn btn-edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    ${user.username !== currentUser.username ? `
                                    <button onclick="deleteUser('${user.username}')" class="btn btn-delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                    ` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            usersTable = '<div class="no-items">لا توجد مستخدمين مسجلين</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل مستخدم
        contentElement.innerHTML = `
            <div class="manage-users">
                <div class="section-header">
                    <h2><i class="fas fa-user-cog"></i> إدارة المستخدمين</h2>
                    <p>يمكنك من هنا إضافة وتعديل وحذف حسابات المستخدمين</p>
                    ${createBackButtons()}
                </div>
                
                <div class="user-form">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إضافة'} مستخدم</h3>
                    <form id="userFormElement">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="userUsername">اسم المستخدم</label>
                                <input type="text" id="userUsername" ${editMode ? 'readonly' : 'required'}>
                            </div>
                            
                            <div class="form-group">
                                <label for="userName">الاسم الكامل</label>
                                <input type="text" id="userName">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="userPassword">كلمة المرور</label>
                                <input type="password" id="userPassword" ${editMode ? '' : 'required'}>
                                ${editMode ? '<small>اتركه فارغاً إذا كنت لا تريد تغيير كلمة المرور</small>' : ''}
                            </div>
                            
                            <div class="form-group">
                                <label for="userRole">الدور</label>
                                <select id="userRole" required>
                                    <option value="admin">مدير النظام</option>
                                    <option value="teacher">أستاذ</option>
                                    <option value="arabic">أستاذ اللغة العربية</option>
                                    <option value="math">أستاذ الرياضيات</option>
                                    <option value="science">أستاذ العلوم</option>
                                    <option value="english">أستاذ الإنجليزية</option>
                                    <option value="social">أستاذ الاجتماعيات</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="users-list">
                    ${usersTable}
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const userToEdit = users.find(u => u.username === currentEditId);
            if (userToEdit) {
                document.getElementById('userUsername').value = userToEdit.username;
                document.getElementById('userName').value = userToEdit.name || '';
                document.getElementById('userRole').value = userToEdit.role;
            }
        }
        
        // إضافة أحداث النموذج
        document.getElementById('userFormElement').addEventListener('submit', handleSaveUser);
    } catch (error) {
        console.error('Error loading users:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل المستخدمين</h3>
                <p>${error.message}</p>
                <button onclick="loadManageUsers()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// معالجة حفظ المستخدم (إضافة/تعديل)
async function handleSaveUser(e) {
    e.preventDefault();
    
    const username = document.getElementById('userUsername').value;
    const name = document.getElementById('userName').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (!username || !role) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // جلب المستخدمين الحاليين
        const users = await fetchUsers();
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const userIndex = users.findIndex(u => u.username === currentEditId);
            if (userIndex !== -1) {
                users[userIndex] = {
                    ...users[userIndex],
                    name: name || '',
                    role: role,
                    // تحديث كلمة المرور فقط إذا تم إدخالها
                    password: password ? password : users[userIndex].password
                };
                
                // تحديث البيانات على JSONBin
                await updateUsers(users);
                
                showMessage('تم تحديث المستخدم بنجاح', 'success');
                loadManageUsers();
            }
        } else {
            // حالة الإضافة
            if (!password) {
                showMessage('الرجاء إدخال كلمة المرور', 'error');
                return;
            }
            
            // التحقق من عدم وجود مستخدم بنفس الاسم
            if (users.some(u => u.username === username)) {
                showMessage('اسم المستخدم موجود مسبقاً', 'error');
                return;
            }
            
            // إنشاء مستخدم جديد
            const newUser = {
                username: username,
                name: name || '',
                password: password,
                role: role,
                lastLogin: null
            };
            
            users.push(newUser);
            
            // تحديث البيانات على JSONBin
            await updateUsers(users);
            
            showMessage('تمت إضافة المستخدم بنجاح', 'success');
            loadManageUsers();
        }
    } catch (error) {
        console.error('Error saving user:', error);
        showMessage('حدث خطأ أثناء حفظ المستخدم', 'error');
    }
}

// تحديث المستخدمين على JSONBin
async function updateUsers(users) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.USERS.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.USERS.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ users: users })
        });
        
        if (!response.ok) throw new Error('Failed to update users');
    } catch (error) {
        console.error('Error updating users:', error);
        throw error;
    }
}

// تسجيل الخروج
function logout() {
    // حذف بيانات المستخدم المحفوظة
    localStorage.removeItem('savedUser');
    currentUser = null;
    isAdmin = false;
    
    // إعادة توجيه إلى صفحة تسجيل الدخول
    showLoginPage();
}

// إلغاء التعديل
function cancelEdit() {
    editMode = false;
    currentEditId = null;
    showDashboardSection(currentSection);
}

// عرض نموذج الطالب
function showStudentForm() {
    document.getElementById('studentForm').style.display = 'block';
}

// إخفاء نموذج الطالب
function hideStudentForm() {
    document.getElementById('studentForm').style.display = 'none';
}

// تصفية الطلاب
function filterStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const branchId = document.getElementById('branchFilter').value;
    
    const rows = document.querySelectorAll('.students-table tbody tr');
    rows.forEach(row => {
        const name = row.querySelector('td:first-child').textContent.toLowerCase();
        const branch = row.querySelector('td:nth-child(2)').textContent;
        const branchMatch = branchId === 'all' || branch.includes(document.querySelector(`#branchFilter option[value="${branchId}"]`).textContent);
        const nameMatch = name.includes(searchTerm);
        
        row.style.display = branchMatch && nameMatch ? '' : 'none';
    });
}

// عرض رسالة
function showMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.getElementById('dashboardContent').prepend(messageElement);
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// توليد معرف فريد
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// تنسيق التاريخ
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

// إخفاء جميع الأقسام
function hideAllSections() {
    const sections = ['loginSection', 'dashboardSection'];
    sections.forEach(section => {
        const el = document.getElementById(section);
        if (el) el.style.display = 'none';
    });
}

// إنشاء أزرار الرجوع
function createBackButtons() {
    return `
        <div class="back-buttons">
            <button onclick="showDashboardSection('dashboardHome')" class="btn btn-back">
                <i class="fas fa-arrow-right"></i> العودة للرئيسية
            </button>
        </div>
    `;
}

// وظائف التعديل
function editExam(id) {
    editMode = true;
    currentEditId = id;
    loadManageExams();
}

function editBranch(id) {
    editMode = true;
    currentEditId = id;
    loadManageBranches();
}

function editStudent(id) {
    editMode = true;
    currentEditId = id;
    loadManageStudents();
}

function editTeacher(id) {
    editMode = true;
    currentEditId = id;
    loadManageTeachers();
}

function editUser(username) {
    editMode = true;
    currentEditId = username;
    loadManageUsers();
}

// وظائف الحذف
async function deleteExam(id) {
    if (confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
        try {
            const exams = await fetchExams();
            const updatedExams = exams.filter(exam => exam.id !== id);
            await updateExams(updatedExams);
            showMessage('تم حذف الامتحان بنجاح', 'success');
            loadManageExams();
        } catch (error) {
            console.error('Error deleting exam:', error);
            showMessage('حدث خطأ أثناء حذف الامتحان', 'error');
        }
    }
}

async function deleteBranch(id) {
    if (confirm('هل أنت متأكد من حذف هذه الشعبة؟')) {
        try {
            const branches = await fetchBranches();
            const updatedBranches = branches.filter(branch => branch.id !== id);
            await updateBranches(updatedBranches);
            showMessage('تم حذف الشعبة بنجاح', 'success');
            loadManageBranches();
        } catch (error) {
            console.error('Error deleting branch:', error);
            showMessage('حدث خطأ أثناء حذف الشعبة', 'error');
        }
    }
}

async function deleteStudent(id) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
        try {
            const students = await fetchStudents();
            const updatedStudents = students.filter(student => student.id !== id);
            await updateStudents(updatedStudents);
            showMessage('تم حذف الطالب بنجاح', 'success');
            loadManageStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            showMessage('حدث خطأ أثناء حذف الطالب', 'error');
        }
    }
}

async function deleteTeacher(id) {
    if (confirm('هل أنت متأكد من حذف هذا الأستاذ؟')) {
        try {
            const teachers = await fetchTeachers();
            const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
            await updateTeachers(updatedTeachers);
            showMessage('تم حذف الأستاذ بنجاح', 'success');
            loadManageTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
            showMessage('حدث خطأ أثناء حذف الأستاذ', 'error');
        }
    }
}

async function deleteUser(username) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        try {
            const users = await fetchUsers();
            const updatedUsers = users.filter(user => user.username !== username);
            await updateUsers(updatedUsers);
            showMessage('تم حذف المستخدم بنجاح', 'success');
            loadManageUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            showMessage('حدث خطأ أثناء حذف المستخدم', 'error');
        }
    }
}

// تحديث حالة المستخدم في القائمة
function updateNavForAuth() {
    const user = localStorage.getItem('savedUser');
    const dashboardLink = document.querySelector('.nav-item .nav-link[href="dashboard.html"]');
    
    if (dashboardLink) {
        if (user) {
            dashboardLink.innerHTML = `
                <i class="fas fa-tachometer-alt"></i>
                <span>لوحتي</span>
            `;
        } else {
            dashboardLink.innerHTML = `
                <i class="fas fa-tachometer-alt"></i>
                <span>تسجيل الدخول</span>
            `;
        }
    }
}




function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // التأكد من أن النتيجة تحتوي على بيانات base64 فقط
            const result = reader.result;
            resolve(result.includes(',') ? result.split(',')[1] : result);
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}








// GitHub API Configuration
const GITHUB_CONFIG = {
    REPO_OWNER: 'vvcbvx',
    REPO_NAME: 'vvcbvx',
    BRANCH: 'main',
    TOKEN: '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' // احرص على تخزين هذا بشكل آمن
};

// دالة لرفع الملف إلى GitHub
async function uploadFileToGitHub(file, path) {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.REPO_OWNER}/${GITHUB_CONFIG.REPO_NAME}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Upload exam file: ${file.name}`,
                content: await readFileAsBase64(file),
                branch: GITHUB_CONFIG.BRANCH
            })
        });

        if (!response.ok) {
            throw new Error('Failed to upload file to GitHub');
        }

        const data = await response.json();
        return data.content.download_url;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// دالة لإنشاء مسار ملف فريد
function generateFilePath(file, grade, subject) {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    return `exams/${grade}/${subject}/${timestamp}.${fileExtension}`;
}






// داخل دالة loadManageExams، عدل جزء نموذج الامتحان ليصبح:
examForm = `
    <div class="exam-form">
        <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إضافة'} امتحان</h3>
        <form id="examForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="examTitle">عنوان الامتحان</label>
                    <input type="text" id="examTitle" required>
                </div>
                
                ${isAdmin ? `
                <div class="form-group">
                    <label for="examSubject">المادة</label>
                    <select id="examSubject" required>
                        <option value="math">الرياضيات</option>
                        <option value="science">العلوم</option>
                        <option value="arabic">اللغة العربية</option>
                        <option value="english">الإنجليزية</option>
                        <option value="french">الفرنسية</option>
                        <option value="social">الاجتماعيات</option>
                        <option value="religion">الديانة</option>
                    </select>
                </div>
                ` : `
                <input type="hidden" id="examSubject" value="${currentUser.role}">
                `}
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="examGrade">الصف</label>
                    <select id="examGrade" required>
                        <option value="t9">تاسع</option>
                        <option value="bac">بكالوريا</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="examFile">ملف الامتحان (PDF)</label>
                    <div class="file-upload-wrapper">
                        <input type="file" id="examFile" accept=".pdf" ${editMode ? '' : 'required'}>
                        <button type="button" id="uploadFileBtn" class="btn btn-upload">
                            <i class="fas fa-upload"></i> رفع الملف
                        </button>
                        <div id="fileUploadStatus"></div>
                    </div>
                    ${editMode ? '<small>اتركه فارغاً إذا كنت لا تريد تغيير الملف</small>' : ''}
                </div>
            </div>
            
            <div class="form-actions">
                ${editMode ? `
                <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                    <i class="fas fa-times"></i> إلغاء
                </button>
                ` : ''}
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'نشر'}
                </button>
            </div>
        </form>
    </div>
`;

// بعد إنشاء النموذج، أضف حدث لزر الرفع
if (document.getElementById('uploadFileBtn')) {
    document.getElementById('uploadFileBtn').addEventListener('click', async function() {
        const fileInput = document.getElementById('examFile');
        if (!fileInput.files[0]) {
            showMessage('الرجاء اختيار ملف أولاً', 'error');
            return;
        }

        const file = fileInput.files[0];
        const grade = document.getElementById('examGrade').value;
        const subject = document.getElementById('examSubject').value;

        if (!grade || !subject) {
            showMessage('الرجاء تحديد الصف والمادة أولاً', 'error');
            return;
        }

        try {
            document.getElementById('uploadFileBtn').disabled = true;
            document.getElementById('fileUploadStatus').innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري رفع الملف...';

            const filePath = generateFilePath(file, grade, subject);
            const downloadUrl = await uploadFileToGitHub(file, filePath);

            document.getElementById('fileUploadStatus').innerHTML = `
                <i class="fas fa-check-circle" style="color:green"></i> تم رفع الملف بنجاح
                <small>${file.name}</small>
            `;
            document.getElementById('uploadFileBtn').disabled = false;

            // حفظ رابط التحميل في حقل مخفي للنموذج
            if (!document.getElementById('examDownloadUrl')) {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.id = 'examDownloadUrl';
                document.getElementById('examForm').appendChild(hiddenInput);
            }
            document.getElementById('examDownloadUrl').value = downloadUrl;
        } catch (error) {
            document.getElementById('fileUploadStatus').innerHTML = `
                <i class="fas fa-times-circle" style="color:red"></i> فشل في رفع الملف
            `;
            document.getElementById('uploadFileBtn').disabled = false;
            console.error('Error uploading file:', error);
        }
    });
}























async function handleSaveExam(e) {
    e.preventDefault();
    
    const title = document.getElementById('examTitle').value;
    const subject = document.getElementById('examSubject').value;
    const grade = document.getElementById('examGrade').value;
    const fileInput = document.getElementById('examFile');
    
    if (!title || !subject || !grade) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        const exams = await fetchExams();
        const gradeName = grade === 't9' ? 'تاسع' : 'بكالوريا';
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const examIndex = exams.findIndex(e => e.id === currentEditId);
            if (examIndex !== -1) {
                exams[examIndex].title = title;
                exams[examIndex].subject = subject;
                exams[examIndex].grade = grade;
                
                // إذا تم تحميل ملف جديد
                if (fileInput.files[0]) {
                    const { fileName, downloadUrl } = await uploadExamFile(fileInput.files[0], subject, grade);
                    exams[examIndex].file = fileName;
                    exams[examIndex].downloadUrl = downloadUrl;
                    exams[examIndex].originalFileName = fileInput.files[0].name; // حفظ اسم الملف الأصلي
                }
                
                await updateExams(exams);
                showMessage('تم تحديث الامتحان بنجاح', 'success');
                loadManageExams();
            }
        } else {
            // حالة الإضافة
            if (!fileInput.files[0]) {
                showMessage('الرجاء تحميل ملف الامتحان', 'error');
                return;
            }
            
            const { fileName, downloadUrl } = await uploadExamFile(fileInput.files[0], subject, grade);
            
            const newExam = {
                id: generateId(),
                title: title,
                subject: subject,
                grade: grade,
                file: fileName,
                downloadUrl: downloadUrl,
                originalFileName: fileInput.files[0].name, // اسم الملف الأصلي
                publishDate: new Date().toISOString(),
                publisher: currentUser.name || currentUser.username,
                downloads: 0,
                gradeName: gradeName, // اسم الصف بشكل مقروء
                subjectName: getSubjectName(subject) // اسم المادة بشكل مقروء
            };
            
            exams.push(newExam);
            await updateExams(exams);
            showMessage('تمت إضافة الامتحان بنجاح', 'success');
            loadManageExams();
        }
    } catch (error) {
        console.error('Error saving exam:', error);
        showMessage(`حدث خطأ أثناء حفظ الامتحان: ${error.message}`, 'error');
    }
}

async function uploadExamFile(file, subject, grade) {
    try {
        // إنشاء اسم فريد للملف
        const fileExtension = file.name.split('.').pop();
        const randomName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExtension}`;
        const filePath = `exams/${grade}/${subject}/${randomName}`;
        
        // تحويل الملف إلى base64
        const base64Content = await readFileAsBase64(file);
        
        // رفع الملف إلى GitHub
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.REPO_OWNER}/${GITHUB_CONFIG.REPO_NAME}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Upload exam file: ${file.name}`,
                content: base64Content,
                branch: GITHUB_CONFIG.BRANCH
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload file');
        }

        const data = await response.json();
        const downloadUrl = data.content.download_url;
        
        return {
            fileName: randomName,
            downloadUrl: downloadUrl,
            originalFileName: file.name
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('فشل في رفع الملف إلى GitHub');
    }
}


async function loadManageBranches() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل الشعب...</p></div>';
    
    try {
        // جلب الشعب من JSONBin
        const branches = await fetchBranches();
        // جلب الطلاب لاستخدامها في إدارة المتميزين
        const students = await fetchStudents();
        
        // إنشاء واجهة إدارة الشعب
        let branchesList = '';
        if (branches.length > 0) {
            branchesList = branches.map(branch => {
                // الحصول على الطلاب المتميزين لهذه الشعبة
                const distinguishedStudents = students.filter(s => 
                    s.branchId === branch.id && s.isDistinguished
                );
                
                return `
                    <div class="branch-item">
                        <div class="branch-info">
                            <h3>${branch.name}</h3>
                            <div class="branch-meta">
                                <span><i class="fas fa-graduation-cap"></i> ${branch.grade === 't9' ? 'تاسع' : 'بكالوريا'}</span>
                                <span><i class="fas fa-users"></i> ${branch.studentsCount} طالب</span>
                                <span><i class="fas fa-percentage"></i> ${branch.completionRate}% اكتمال</span>
                                <span><i class="fas fa-star"></i> ${distinguishedStudents.length} طالب متميز</span>
                            </div>
                        </div>
                        <div class="branch-actions">
                            <button onclick="editBranch('${branch.id}')" class="btn btn-edit">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button onclick="manageDistinguishedStudents('${branch.id}')" class="btn btn-distinguished">
                                <i class="fas fa-star"></i> المتميزون
                            </button>
                            <button onclick="deleteBranch('${branch.id}')" class="btn btn-delete">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            branchesList = '<div class="no-items">لا توجد شعب مسجلة</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل شعبة
        contentElement.innerHTML = `
            <div class="manage-branches">
                <div class="section-header">
                    <h2><i class="fas fa-graduation-cap"></i> إدارة الشعب</h2>
                    <p>يمكنك من هنا إضافة وتعديل وحذف الشعب الدراسية وإدارة الطلاب المتميزين</p>
                    ${createBackButtons()}
                </div>
                
                <div class="branch-form">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إضافة'} شعبة</h3>
                    <form id="branchForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="branchName">اسم الشعبة</label>
                                <input type="text" id="branchName" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="branchGrade">المرحلة</label>
                                <select id="branchGrade" required>
                                    <option value="t9">تاسع</option>
                                    <option value="bac">بكالوريا</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="branchTeacher">المعلم المسؤول</label>
                                <input type="text" id="branchTeacher" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="branchStudents">عدد الطلاب</label>
                                <input type="number" id="branchStudents" min="1" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="branchDesc">وصف الشعبة</label>
                            <textarea id="branchDesc" rows="3"></textarea>
                        </div>
                        
                        <div class="form-actions">
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="branches-list">
                    <h3><i class="fas fa-list"></i> قائمة الشعب</h3>
                    ${branchesList}
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const branchToEdit = branches.find(b => b.id === currentEditId);
            if (branchToEdit) {
                document.getElementById('branchName').value = branchToEdit.name;
                document.getElementById('branchGrade').value = branchToEdit.grade;
                document.getElementById('branchTeacher').value = branchToEdit.teacher;
                document.getElementById('branchStudents').value = branchToEdit.studentsCount;
                document.getElementById('branchDesc').value = branchToEdit.description || '';
            }
        }
        
        // إضافة أحداث النموذج
        document.getElementById('branchForm').addEventListener('submit', handleSaveBranch);
    } catch (error) {
        console.error('Error loading branches:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الشعب</h3>
                <p>${error.message}</p>
                <button onclick="loadManageBranches()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

async function manageDistinguishedStudents(branchId) {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل بيانات الطلاب...</p></div>';
    
    try {
        // جلب البيانات المطلوبة
        const branches = await fetchBranches();
        const students = await fetchStudents();
        const currentBranch = branches.find(b => b.id === branchId);
        
        if (!currentBranch) {
            throw new Error('الشعبة غير موجودة');
        }
        
        // تصنيف الطلاب
        const branchStudents = students.filter(s => s.branchId === branchId);
        const distinguishedStudents = branchStudents.filter(s => s.isDistinguished);
        const regularStudents = branchStudents.filter(s => !s.isDistinguished);
        
        // إنشاء واجهة إدارة الطلاب المتميزين
        contentElement.innerHTML = `
            <div class="manage-distinguished">
                <div class="section-header">
                    <h2><i class="fas fa-star"></i> إدارة الطلاب المتميزين - ${currentBranch.name}</h2>
                    <p>يمكنك من هنا إدارة الطلاب المتميزين للشعبة (الحد الأقصى 3 طلاب)</p>
                    <button onclick="loadManageBranches()" class="btn btn-back">
                        <i class="fas fa-arrow-right"></i> العودة إلى الشعب
                    </button>
                </div>
                
                <div class="distinguished-container">
                    <div class="distinguished-students">
                        <h3><i class="fas fa-star"></i> الطلاب المتميزون الحاليون</h3>
                        ${distinguishedStudents.length > 0 ? 
                            distinguishedStudents.map(student => `
                                <div class="student-card distinguished">
                                    <div class="student-info">
                                        <div class="avatar">
                                            ${student.avatar ? 
                                                `<img src="data:image/jpeg;base64,${student.avatar}" alt="${student.name}">` : 
                                                `<i class="fas fa-user-graduate"></i>`}
                                        </div>
                                        <div class="details">
                                            <h4>${student.name}</h4>
                                            <p>المعدل: ${student.average}%</p>
                                            <p>الحضور: ${student.attendance}%</p>
                                        </div>
                                    </div>
                                    <button onclick="removeDistinguishedStatus('${student.id}', '${branchId}')" class="btn btn-delete">
                                        <i class="fas fa-times"></i> إزالة
                                    </button>
                                </div>
                            `).join('') :
                            '<div class="no-items">لا يوجد طلاب متميزون حالياً</div>'
                        }
                    </div>
                    
                    <div class="regular-students">
                        <h3><i class="fas fa-users"></i> الطلاب المتاحون للإضافة</h3>
                        ${regularStudents.length > 0 ? 
                            regularStudents.map(student => `
                                <div class="student-card">
                                    <div class="student-info">
                                        <div class="avatar">
                                            ${student.avatar ? 
                                                `<img src="data:image/jpeg;base64,${student.avatar}" alt="${student.name}">` : 
                                                `<i class="fas fa-user-graduate"></i>`}
                                        </div>
                                        <div class="details">
                                            <h4>${student.name}</h4>
                                            <p>المعدل: ${student.average}%</p>
                                            <p>الحضور: ${student.attendance}%</p>
                                        </div>
                                    </div>
                                    <button onclick="addDistinguishedStatus('${student.id}', '${branchId}')" 
                                        class="btn btn-primary" 
                                        ${distinguishedStudents.length >= 3 ? 'disabled title="تم الوصول للحد الأقصى (3 طلاب)"' : ''}>
                                        <i class="fas fa-plus"></i> إضافة
                                    </button>
                                </div>
                            `).join('') :
                            '<div class="no-items">لا يوجد طلاب متاحون للإضافة</div>'
                        }
                    </div>
                </div>
                
                <div class="distinguished-rules">
                    <h3><i class="fas fa-info-circle"></i> شروط التميز:</h3>
                    <ul>
                        <li>الحد الأقصى للطلاب المتميزين في كل شعبة هو 3 طلاب فقط</li>
                        <li>يتم اختيار الطلاب المتميزين بناءً على أدائهم الأكاديمي وحضورهم</li>
                        <li>يمكن إزالة أي طالب متميز وإضافة طالب آخر مكانه</li>
                    </ul>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading distinguished students:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الطلاب المتميزين</h3>
                <p>${error.message}</p>
                <button onclick="loadManageBranches()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> العودة إلى الشعب
                </button>
            </div>
        `;
    }
}






// تحميل قسم إدارة الامتحانات السريعة
async function loadManageQuizzes() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل الامتحانات السريعة...</p></div>';
    
    try {
        // جلب الامتحانات السريعة من JSONBin
        const quizzes = await fetchQuizzes();
        
        // إنشاء واجهة إدارة الامتحانات السريعة
        let quizzesList = '';
        if (quizzes.length > 0) {
            quizzesList = quizzes.map(quiz => `
                <div class="quiz-item">
                    <div class="quiz-info">
                        <h3>${quiz.title}</h3>
                        <div class="quiz-meta">
                            <span><i class="fas fa-book"></i> ${getSubjectName(quiz.subject)}</span>
                            <span><i class="fas fa-graduation-cap"></i> ${quiz.grade === 't9' ? 'تاسع' : 'بكالوريا'}</span>
                            <span><i class="fas fa-question"></i> ${quiz.questions.length} سؤال</span>
                            <span><i class="fas fa-star"></i> ${quiz.totalMarks} درجة</span>
                        </div>
                    </div>
                    <div class="quiz-actions">
                        <button onclick="editQuiz('${quiz.id}')" class="btn btn-edit">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button onclick="deleteQuiz('${quiz.id}')" class="btn btn-delete">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                        <button onclick="previewQuiz('${quiz.id}')" class="btn btn-preview">
                            <i class="fas fa-eye"></i> معاينة
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            quizzesList = '<div class="no-items">لا توجد امتحانات سريعة مسجلة</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل امتحان سريع
        contentElement.innerHTML = `
            <div class="manage-quizzes">
                <div class="section-header">
                    <h2><i class="fas fa-question-circle"></i> إدارة الامتحانات السريعة</h2>
                    <p>يمكنك من هنا إنشاء وتعديل وحذف الامتحانات السريعة</p>
                    ${createBackButtons()}
                </div>
                
                <div class="quiz-form">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إنشاء'} امتحان سريع</h3>
                    <form id="quizForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="quizTitle">عنوان الامتحان</label>
                                <input type="text" id="quizTitle" required>
                            </div>
                            
                            ${isAdmin ? `
                            <div class="form-group">
                                <label for="quizSubject">المادة</label>
                                <select id="quizSubject" required>
                                    <option value="math">الرياضيات</option>
                                    <option value="science">العلوم</option>
                                    <option value="arabic">اللغة العربية</option>
                                    <option value="english">الإنجليزية</option>
                                    <option value="french">الفرنسية</option>
                                    <option value="social">الاجتماعيات</option>
                                    <option value="religion">الديانة</option>
                                </select>
                            </div>
                            ` : `
                            <input type="hidden" id="quizSubject" value="${currentUser.role}">
                            `}
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="quizGrade">الصف</label>
                                <select id="quizGrade" required>
                                    <option value="t9">تاسع</option>
                                    <option value="bac">بكالوريا</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="quizTotalMarks">الدرجة الكلية</label>
                                <input type="number" id="quizTotalMarks" min="1" value="20" required>
                            </div>
                        </div>
                        
                        <div id="questionsContainer">
                            <!-- سيتم إضافة الأسئلة هنا ديناميكياً -->
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" onclick="addQuestion()" class="btn btn-add">
                                <i class="fas fa-plus"></i> إضافة سؤال
                            </button>
                            
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'} الامتحان
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="quizzes-list">
                    <h3><i class="fas fa-list"></i> قائمة الامتحانات السريعة</h3>
                    ${quizzesList}
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const quizToEdit = quizzes.find(q => q.id === currentEditId);
            if (quizToEdit) {
                document.getElementById('quizTitle').value = quizToEdit.title;
                if (isAdmin) {
                    document.getElementById('quizSubject').value = quizToEdit.subject;
                }
                document.getElementById('quizGrade').value = quizToEdit.grade;
                document.getElementById('quizTotalMarks').value = quizToEdit.totalMarks;
                
                // إضافة الأسئلة
                quizToEdit.questions.forEach((question, index) => {
                    addQuestion(question);
                });
            }
        } else {
            // إضافة سؤال افتراضي عند الإنشاء
            addQuestion();
        }
        
        // إضافة أحداث النموذج
        document.getElementById('quizForm').addEventListener('submit', handleSaveQuiz);
    } catch (error) {
        console.error('Error loading quizzes:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الامتحانات السريعة</h3>
                <p>${error.message}</p>
                <button onclick="loadManageQuizzes()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// دالة لإضافة سؤال جديد
function addQuestion(questionData = null) {
    const questionsContainer = document.getElementById('questionsContainer');
    const questionId = `question_${Date.now()}`;
    
    let questionHtml = `
        <div class="question-item" id="${questionId}">
            <div class="question-header">
                <h4>السؤال #${questionsContainer.children.length + 1}</h4>
                <button type="button" onclick="removeQuestion('${questionId}')" class="btn btn-delete">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
            
            <div class="form-group">
                <label for="${questionId}_text">نص السؤال</label>
                <textarea id="${questionId}_text" rows="2" required>${questionData?.text || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="${questionId}_marks">درجة السؤال</label>
                <input type="number" id="${questionId}_marks" min="1" value="${questionData?.marks || 1}" required>
            </div>
            
            <div class="options-container">
                <h5>خيارات الإجابة:</h5>
    `;
    
    // إضافة خيارات الإجابة
    for (let i = 0; i < 4; i++) {
        const optionId = `${questionId}_option_${i}`;
        const isCorrect = questionData?.correctAnswer === i;
        
        questionHtml += `
            <div class="option-item">
                <div class="form-group">
                    <label for="${optionId}_text">الخيار ${i + 1}</label>
                    <input type="text" id="${optionId}_text" value="${questionData?.options[i]?.text || ''}" required>
                </div>
                
                <div class="form-check">
                    <input type="radio" id="${optionId}_correct" name="${questionId}_correct" value="${i}" ${isCorrect ? 'checked' : ''}>
                    <label for="${optionId}_correct">الإجابة الصحيحة</label>
                </div>
            </div>
        `;
    }
    
    questionHtml += `
            </div>
            
            <div class="form-group">
                <label for="${questionId}_explanation">تعليل الإجابة الصحيحة</label>
                <textarea id="${questionId}_explanation" rows="2">${questionData?.explanation || ''}</textarea>
            </div>
        </div>
    `;
    
    questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
}

// دالة لحذف سؤال
function removeQuestion(questionId) {
    const questionElement = document.getElementById(questionId);
    if (questionElement) {
        questionElement.remove();
        
        // تحديث أرقام الأسئلة
        const questions = document.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            question.querySelector('h4').textContent = `السؤال #${index + 1}`;
        });
    }
}

// جلب الامتحانات السريعة من JSONBin
async function fetchQuizzes() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.QUIZZES.BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.QUIZZES.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        
        const data = await response.json();
        return data.record.quizzes || [];
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
}

// معالجة حفظ الامتحان السريع
async function handleSaveQuiz(e) {
    e.preventDefault();
    
    const title = document.getElementById('quizTitle').value;
    const subject = document.getElementById('quizSubject').value;
    const grade = document.getElementById('quizGrade').value;
    const totalMarks = parseInt(document.getElementById('quizTotalMarks').value);
    
    if (!title || !subject || !grade || !totalMarks) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // جمع بيانات الأسئلة
    const questions = [];
    const questionElements = document.querySelectorAll('.question-item');
    
    let totalQuestionsMarks = 0;
    
    questionElements.forEach(questionElement => {
        const questionId = questionElement.id;
        const text = document.getElementById(`${questionId}_text`).value;
        const marks = parseInt(document.getElementById(`${questionId}_marks`).value);
        const explanation = document.getElementById(`${questionId}_explanation`).value;
        
        // جمع خيارات الإجابة
        const options = [];
        let correctAnswer = null;
        
        for (let i = 0; i < 4; i++) {
            const optionText = document.getElementById(`${questionId}_option_${i}_text`).value;
            const isCorrect = document.getElementById(`${questionId}_option_${i}_correct`).checked;
            
            options.push({
                id: i,
                text: optionText
            });
            
            if (isCorrect) {
                correctAnswer = i;
            }
        }
        
        if (!text || options.some(opt => !opt.text)) {
            showMessage('الرجاء تعبئة جميع حقول الأسئلة والخيارات', 'error');
            return;
        }
        
        if (correctAnswer === null) {
            showMessage('الرجاء تحديد الإجابة الصحيحة لكل سؤال', 'error');
            return;
        }
        
        questions.push({
            text,
            options,
            correctAnswer,
            marks,
            explanation
        });
        
        totalQuestionsMarks += marks;
    });
    
    // التحقق من أن مجموع درجات الأسئلة يساوي الدرجة الكلية
    if (totalQuestionsMarks !== totalMarks) {
        showMessage(`مجموع درجات الأسئلة (${totalQuestionsMarks}) لا يساوي الدرجة الكلية (${totalMarks})`, 'error');
        return;
    }
    
    try {
        // جلب الامتحانات السريعة الحالية
        const quizzes = await fetchQuizzes();
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const quizIndex = quizzes.findIndex(q => q.id === currentEditId);
            if (quizIndex !== -1) {
                quizzes[quizIndex] = {
                    ...quizzes[quizIndex],
                    title,
                    subject,
                    grade,
                    totalMarks,
                    questions,
                    updatedAt: new Date().toISOString()
                };
                
                // تحديث البيانات على JSONBin
                await updateQuizzes(quizzes);
                
                showMessage('تم تحديث الامتحان السريع بنجاح', 'success');
                loadManageQuizzes();
            }
        } else {
            // حالة الإضافة
            const newQuiz = {
                id: generateId(),
                title,
                subject,
                grade,
                totalMarks,
                questions,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: currentUser.username,
                isActive: true
            };
            
            quizzes.push(newQuiz);
            
            // تحديث البيانات على JSONBin
            await updateQuizzes(quizzes);
            
            showMessage('تم إنشاء الامتحان السريع بنجاح', 'success');
            loadManageQuizzes();
        }
    } catch (error) {
        console.error('Error saving quiz:', error);
        showMessage('حدث خطأ أثناء حفظ الامتحان السريع', 'error');
    }
}

// تحديث الامتحانات السريعة على JSONBin
async function updateQuizzes(quizzes) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.QUIZZES.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.QUIZZES.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizzes })
        });
        
        if (!response.ok) throw new Error('Failed to update quizzes');
    } catch (error) {
        console.error('Error updating quizzes:', error);
        throw error;
    }
}

// معاينة الامتحان السريع
function previewQuiz(quizId) {
    // سيتم تنفيذ هذه الدالة عند النقر على زر المعاينة
    alert('سيتم تنفيذ معاينة الامتحان هنا');
    // يمكنك تطوير هذه الدالة لعرض معاينة كاملة للامتحان
}

// تعديل امتحان سريع
function editQuiz(id) {
    editMode = true;
    currentEditId = id;
    loadManageQuizzes();
}

// حذف امتحان سريع
async function deleteQuiz(id) {
    if (confirm('هل أنت متأكد من حذف هذا الامتحان السريع؟')) {
        try {
            const quizzes = await fetchQuizzes();
            const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
            await updateQuizzes(updatedQuizzes);
            showMessage('تم حذف الامتحان السريع بنجاح', 'success');
            loadManageQuizzes();
        } catch (error) {
            console.error('Error deleting quiz:', error);
            showMessage('حدث خطأ أثناء حذف الامتحان السريع', 'error');
        }
    }
}


// تحديث دالة showDashboardSection
function showDashboardSection(section) {
    currentSection = section;
    editMode = false;
    currentEditId = null;
    
    // تحديث القائمة النشطة
    document.querySelectorAll('.dashboard-nav a').forEach(link => {
        link.classList.remove('active');
    });
    event?.target?.classList?.add('active');
    
    // تحميل المحتوى المناسب
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري التحميل...</p></div>';
    
    switch (section) {
        case 'dashboardHome':
            loadDashboardHome();
            break;
        case 'manageExams':
            loadManageExams();
            break;
        case 'manageQuizzes':
            loadManageQuizzes();
            break;
        case 'manageBranches':
            if (isAdmin) loadManageBranches();
            else showUnauthorized();
            break;
        case 'manageStudents':
            if (isAdmin) loadManageStudents();
            else showUnauthorized();
            break;
        case 'manageTeachers':
            if (isAdmin) loadManageTeachers();
            else showUnauthorized();
            break;
        case 'manageUsers':
            if (isAdmin) loadManageUsers();
            else showUnauthorized();
            break;
        default:
            loadDashboardHome();
    }
}

// في دالة loadDashboardHome، تحديث قسم dashboard-cards
let subjectExamsLink = '';
if (!isAdmin && currentUser.role !== 'teacher') {
    subjectExamsLink = `
        <a href="#" onclick="showDashboardSection('manageExams')" class="dashboard-card">
            <i class="fas fa-file-pdf"></i>
            <h3>إدارة امتحانات ${getRoleName(currentUser.role)}</h3>
            <p>عرض وإدارة امتحانات المادة الخاصة بك</p>
        </a>
        <a href="#" onclick="showDashboardSection('manageQuizzes')" class="dashboard-card">
            <i class="fas fa-question-circle"></i>
            <h3>إدارة امتحانات ${getRoleName(currentUser.role)} السريعة</h3>
            <p>إنشاء وتعديل الامتحانات السريعة لمادتك</p>
        </a>
    `;
}


// إضافة CSS للامتحانات السريعة
function addStudentCardsCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* أنماط الامتحانات السريعة */
        .manage-quizzes {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .quiz-item {
            background: #fff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .quiz-info h3 {
            margin: 0 0 5px 0;
            color: #2c3e50;
        }
        
        .quiz-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 14px;
            color: #7f8c8d;
        }
        
        .quiz-meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .quiz-actions {
            display: flex;
            gap: 10px;
        }
        
        /* أنماط نموذج الامتحان السريع */
        .quiz-form {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .question-item {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid #eee;
        }
        
        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
        }
        
        .options-container {
            margin: 15px 0;
        }
        
        .option-item {
            background: #fff;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #eee;
        }
        
        .form-check {
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .form-check input[type="radio"] {
            margin: 0;
        }
        
        .btn-add {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        
        .btn-add:hover {
            background-color: #2980b9;
        }
        
        .btn-preview {
            background-color: #9b59b6;
            color: white;
        }
        
        .btn-preview:hover {
            background-color: #8e44ad;
        }
        
        .distinguished-container {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        
        .distinguished-students, .regular-students {
            flex: 1;
            background: #fff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .student-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #eee;
            border-radius: 6px;
        }
        
        .student-card.distinguished {
            background-color: #f8f9fa;
            border-left: 4px solid #f1c40f;
        }
        
        .student-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .student-info .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .student-info .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .student-info .details h4 {
            margin: 0;
            font-size: 16px;
        }
        
        .student-info .details p {
            margin: 3px 0 0 0;
            font-size: 13px;
            color: #7f8c8d;
        }
        
        .distinguished-rules {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            border: 1px solid #eee;
        }
        
        .distinguished-rules h3 {
            margin-top: 0;
            color: #2c3e50;
        }
        
        .distinguished-rules ul {
            padding-left: 20px;
            margin-bottom: 0;
        }
    `;
    document.head.appendChild(style);
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', addStudentCardsCSS);


// إضافة حالة التميز للطالب
async function addDistinguishedStatus(studentId, branchId) {
    try {
        const students = await fetchStudents();
        const studentIndex = students.findIndex(s => s.id === studentId);
        
        if (studentIndex !== -1) {
            // التحقق من عدد الطلاب المتميزين الحاليين في الشعبة
            const distinguishedCount = students.filter(s => 
                s.branchId === branchId && s.isDistinguished
            ).length;
            
            if (distinguishedCount >= 3) {
                showMessage('لا يمكن إضافة أكثر من 3 طلاب متميزين في الشعبة', 'error');
                return;
            }
            
            students[studentIndex].isDistinguished = true;
            await updateStudents(students);
            showMessage('تم إضافة الطالب إلى قائمة المتميزين', 'success');
            manageDistinguishedStudents(branchId); // إعادة تحميل القائمة
        }
    } catch (error) {
        console.error('Error adding distinguished status:', error);
        showMessage('حدث خطأ أثناء إضافة الطالب إلى المتميزين', 'error');
    }
}

// إزالة حالة التميز من الطالب
async function removeDistinguishedStatus(studentId, branchId) {
    if (confirm('هل أنت متأكد من إزالة هذا الطالب من قائمة المتميزين؟')) {
        try {
            const students = await fetchStudents();
            const studentIndex = students.findIndex(s => s.id === studentId);
            
            if (studentIndex !== -1) {
                students[studentIndex].isDistinguished = false;
                await updateStudents(students);
                showMessage('تم إزالة الطالب من قائمة المتميزين', 'success');
                manageDistinguishedStudents(branchId); // إعادة تحميل القائمة
            }
        } catch (error) {
            console.error('Error removing distinguished status:', error);
            showMessage('حدث خطأ أثناء إزالة الطالب من المتميزين', 'error');
        }
    }
}

// إدارة الطلاب المتميزين
async function manageDistinguishedStudents(branchId) {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل بيانات الطلاب...</p></div>';
    
    try {
        const branches = await fetchBranches();
        const students = await fetchStudents();
        const currentBranch = branches.find(b => b.id === branchId);
        
        if (!currentBranch) {
            throw new Error('الشعبة غير موجودة');
        }
        
        const branchStudents = students.filter(s => s.branchId === branchId);
        const distinguishedStudents = branchStudents.filter(s => s.isDistinguished);
        const regularStudents = branchStudents.filter(s => !s.isDistinguished);
        
        contentElement.innerHTML = `
            <div class="manage-distinguished">
                <div class="section-header">
                    <h2><i class="fas fa-star"></i> إدارة الطلاب المتميزين - ${currentBranch.name}</h2>
                    <p>يمكنك من هنا إدارة الطلاب المتميزين للشعبة (الحد الأقصى 3 طلاب)</p>
                    <button onclick="loadManageBranches()" class="btn btn-back">
                        <i class="fas fa-arrow-right"></i> العودة إلى الشعب
                    </button>
                </div>
                
                <div class="distinguished-container">
                    <div class="distinguished-students">
                        <h3><i class="fas fa-star"></i> الطلاب المتميزون الحاليون</h3>
                        ${distinguishedStudents.length > 0 ? 
                            distinguishedStudents.map(student => `
                                <div class="student-card distinguished">
                                    <div class="student-info">
                                        <div class="avatar">
                                            ${student.avatar ? 
                                                `<img src="data:image/jpeg;base64,${student.avatar}" alt="${student.name}">` : 
                                                `<i class="fas fa-user-graduate"></i>`}
                                        </div>
                                        <div class="details">
                                            <h4>${student.name}</h4>
                                            <p>المعدل: ${student.average}%</p>
                                            <p>الحضور: ${student.attendance}%</p>
                                        </div>
                                    </div>
                                    <button onclick="removeDistinguishedStatus('${student.id}', '${branchId}')" class="btn btn-delete">
                                        <i class="fas fa-times"></i> إزالة
                                    </button>
                                </div>
                            `).join('') :
                            '<div class="no-items">لا يوجد طلاب متميزون حالياً</div>'
                        }
                    </div>
                    
                    <div class="regular-students">
                        <h3><i class="fas fa-users"></i> الطلاب المتاحون للإضافة</h3>
                        ${regularStudents.length > 0 ? 
                            regularStudents.map(student => `
                                <div class="student-card">
                                    <div class="student-info">
                                        <div class="avatar">
                                            ${student.avatar ? 
                                                `<img src="data:image/jpeg;base64,${student.avatar}" alt="${student.name}">` : 
                                                `<i class="fas fa-user-graduate"></i>`}
                                        </div>
                                        <div class="details">
                                            <h4>${student.name}</h4>
                                            <p>المعدل: ${student.average}%</p>
                                            <p>الحضور: ${student.attendance}%</p>
                                        </div>
                                    </div>
                                    <button onclick="addDistinguishedStatus('${student.id}', '${branchId}')" 
                                        class="btn btn-primary" 
                                        ${distinguishedStudents.length >= 3 ? 'disabled title="تم الوصول للحد الأقصى (3 طلاب)"' : ''}>
                                        <i class="fas fa-plus"></i> إضافة
                                    </button>
                                </div>
                            `).join('') :
                            '<div class="no-items">لا يوجد طلاب متاحون للإضافة</div>'
                        }
                    </div>
                </div>
                
                <div class="distinguished-rules">
                    <h3><i class="fas fa-info-circle"></i> شروط التميز:</h3>
                    <ul>
                        <li>الحد الأقصى للطلاب المتميزين في كل شعبة هو 3 طلاب فقط</li>
                        <li>يتم اختيار الطلاب المتميزين بناءً على أدائهم الأكاديمي وحضورهم</li>
                        <li>يمكن إزالة أي طالب متميز وإضافة طالب آخر مكانه</li>
                    </ul>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading distinguished students:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الطلاب المتميزين</h3>
                <p>${error.message}</p>
                <button onclick="loadManageBranches()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> العودة إلى الشعب
                </button>
            </div>
        `;
    }
}

function showDashboardSection(section) {
    currentSection = section;
    editMode = false;
    currentEditId = null;
    
    // تحديث القائمة النشطة
    document.querySelectorAll('.dashboard-nav a').forEach(link => {
        link.classList.remove('active');
    });
    event?.target?.classList?.add('active');
    
    // تحميل المحتوى المناسب
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري التحميل...</p></div>';
    
    switch (section) {
        case 'dashboardHome':
            loadDashboardHome();
            break;
        case 'manageExams':
            loadManageExams();
            break;
        case 'manageQuizzes':
            loadManageQuizzes(); // متاح لجميع المستخدمين
            break;
        case 'manageBranches':
            if (isAdmin) loadManageBranches();
            else showUnauthorized();
            break;
        case 'manageStudents':
            if (isAdmin) loadManageStudents();
            else showUnauthorized();
            break;
        case 'manageTeachers':
            if (isAdmin) loadManageTeachers();
            else showUnauthorized();
            break;
        case 'manageUsers':
            if (isAdmin) loadManageUsers();
            else showUnauthorized();
            break;
        default:
            loadDashboardHome();
    }
}

async function loadManageQuizzes() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل الامتحانات السريعة...</p></div>';
    
    try {
        // جلب الامتحانات السريعة من JSONBin
        const quizzes = await fetchQuizzes();
        
        // تصفية الامتحانات حسب الصلاحيات
        let filteredQuizzes = quizzes;
        if (!isAdmin && currentUser.role !== 'teacher') {
            filteredQuizzes = quizzes.filter(quiz => quiz.subject === currentUser.role);
        }
        
        // إنشاء واجهة إدارة الامتحانات السريعة
        let quizzesList = '';
        if (filteredQuizzes.length > 0) {
            quizzesList = filteredQuizzes.map(quiz => `
                <div class="quiz-item">
                    <div class="quiz-info">
                        <h3>${quiz.title}</h3>
                        <div class="quiz-meta">
                            <span><i class="fas fa-book"></i> ${getSubjectName(quiz.subject)}</span>
                            <span><i class="fas fa-graduation-cap"></i> ${quiz.grade === 't9' ? 'تاسع' : 'بكالوريا'}</span>
                            <span><i class="fas fa-question"></i> ${quiz.questions.length} سؤال</span>
                            <span><i class="fas fa-star"></i> ${quiz.totalMarks} درجة</span>
                        </div>
                    </div>
                    <div class="quiz-actions">
                        <button onclick="editQuiz('${quiz.id}')" class="btn btn-edit">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button onclick="deleteQuiz('${quiz.id}')" class="btn btn-delete">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                        <button onclick="previewQuiz('${quiz.id}')" class="btn btn-preview">
                            <i class="fas fa-eye"></i> معاينة
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            quizzesList = '<div class="no-items">لا توجد امتحانات سريعة مسجلة</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل امتحان سريع
        contentElement.innerHTML = `
            <div class="manage-quizzes">
                <div class="section-header">
                    <h2><i class="fas fa-question-circle"></i> إدارة الامتحانات السريعة</h2>
                    <p>يمكنك من هنا إنشاء وتعديل وحذف الامتحانات السريعة</p>
                    ${createBackButtons()}
                </div>
                
                <div class="quiz-form">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إنشاء'} امتحان سريع</h3>
                    <form id="quizForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="quizTitle">عنوان الامتحان</label>
                                <input type="text" id="quizTitle" required>
                            </div>
                            
                            ${isAdmin ? `
                            <div class="form-group">
                                <label for="quizSubject">المادة</label>
                                <select id="quizSubject" required>
                                    <option value="math">الرياضيات</option>
                                    <option value="science">العلوم</option>
                                    <option value="arabic">اللغة العربية</option>
                                    <option value="english">الإنجليزية</option>
                                    <option value="french">الفرنسية</option>
                                    <option value="social">الاجتماعيات</option>
                                    <option value="religion">الديانة</option>
                                </select>
                            </div>
                            ` : `
                            <input type="hidden" id="quizSubject" value="${currentUser.role}">
                            `}
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="quizGrade">الصف</label>
                                <select id="quizGrade" required>
                                    <option value="t9">تاسع</option>
                                    <option value="bac">بكالوريا</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="quizTotalMarks">الدرجة الكلية</label>
                                <input type="number" id="quizTotalMarks" min="1" value="20" required>
                            </div>
                        </div>
                        
                        <div id="questionsContainer">
                            <!-- سيتم إضافة الأسئلة هنا ديناميكياً -->
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" onclick="addQuestion()" class="btn btn-add">
                                <i class="fas fa-plus"></i> إضافة سؤال
                            </button>
                            
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'} الامتحان
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="quizzes-list">
                    <h3><i class="fas fa-list"></i> قائمة الامتحانات السريعة</h3>
                    ${quizzesList}
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const quizToEdit = quizzes.find(q => q.id === currentEditId);
            if (quizToEdit) {
                document.getElementById('quizTitle').value = quizToEdit.title;
                if (isAdmin) {
                    document.getElementById('quizSubject').value = quizToEdit.subject;
                }
                document.getElementById('quizGrade').value = quizToEdit.grade;
                document.getElementById('quizTotalMarks').value = quizToEdit.totalMarks;
                
                // إضافة الأسئلة
                quizToEdit.questions.forEach((question, index) => {
                    addQuestion(question);
                });
            }
        } else {
            // إضافة سؤال افتراضي عند الإنشاء
            addQuestion();
        }
        
        // إضافة أحداث النموذج
        document.getElementById('quizForm').addEventListener('submit', handleSaveQuiz);
    } catch (error) {
        console.error('Error loading quizzes:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الامتحانات السريعة</h3>
                <p>${error.message}</p>
                <button onclick="loadManageQuizzes()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

function setupDashboard() {
    hideAllSections();
    
    // تحديث معلومات المستخدم
    document.getElementById('loggedInUsername').textContent = currentUser.name || currentUser.username;
    document.getElementById('loggedInRole').textContent = getRoleName(currentUser.role);
    
    // التحقق من صلاحيات المدير
    isAdmin = currentUser.role === 'admin';
    
    // إظهار/إخفاء عناصر القائمة حسب الصلاحيات
    document.getElementById('adminUsersLink').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('adminBranchesLink').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('adminStudentsLink').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('adminTeachersLink').style.display = isAdmin ? 'block' : 'none';
    
    // عرض لوحة التحكم
    document.getElementById('dashboardSection').style.display = 'flex';
    
    // ضبط أبعاد لوحة التحكم
    const dashboardSection = document.getElementById('dashboardSection');
    dashboardSection.style.position = 'fixed';
    dashboardSection.style.top = '0';
    dashboardSection.style.left = '0';
    dashboardSection.style.width = '100vw';
    dashboardSection.style.height = '100vh';
    dashboardSection.style.overflow = 'auto';
    
    // عرض القسم الافتراضي
    showDashboardSection('dashboardHome');
}




function loadDashboardHome() {
    const contentElement = document.getElementById('dashboardContent');
    
    let subjectExamsLink = '';
    if (!isAdmin && currentUser.role !== 'teacher') {
        subjectExamsLink = `
            <a href="#" onclick="showDashboardSection('manageExams')" class="dashboard-card">
                <i class="fas fa-file-pdf"></i>
                <h3>إدارة امتحانات ${getRoleName(currentUser.role)}</h3>
                <p>عرض وإدارة امتحانات المادة الخاصة بك</p>
            </a>
            <a href="#" onclick="showDashboardSection('manageQuizzes')" class="dashboard-card">
                <i class="fas fa-question-circle"></i>
                <h3>إدارة امتحانات ${getRoleName(currentUser.role)} السريعة</h3>
                <p>إنشاء وتعديل الامتحانات السريعة لمادتك</p>
            </a>
        `;
    }
    
    contentElement.innerHTML = `
        <div class="sidebar-footer">
            <a href="index.html" class="sidebar-btn" id="homeBtn">
                <i class="fas fa-home"></i>
                <span>الرئيسية</span>
            </a>
            <button onclick="logout()" class="sidebar-btn" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                <span>تسجيل الخروج</span>
            </button>
        </div>

        <div class="content-header">
            <h2 class="content-title">لوحة التحكم الرئيسية</h2>
            ${createBackButtons()}
        </div>
        
        <div class="welcome-message">
            <div class="welcome-text">
                <h3>مرحباً ${currentUser.name || currentUser.username}</h3>
                <p>يمكنك من خلال هذه اللوحة إدارة المحتوى التعليمي للمعهد حسب الصلاحيات الممنوحة لك.</p>
            </div>
            <div class="welcome-stats">
                <div class="stat-card">
                    <i class="fas fa-user-tie"></i>
                    <span>دورك</span>
                    <strong>${getRoleName(currentUser.role)}</strong>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calendar-alt"></i>
                    <span>آخر دخول</span>
                    <strong>${new Date().toLocaleDateString('ar-EG')}</strong>
                </div>
            </div>
        </div>
        
        <div class="dashboard-cards">
            ${subjectExamsLink}
            
            ${isAdmin ? `
            <a href="#" onclick="showDashboardSection('manageBranches')" class="dashboard-card">
                <i class="fas fa-graduation-cap"></i>
                <h3>إدارة الشعب</h3>
                <p>إضافة وتعديل وحذف الشعب الدراسية</p>
            </a>
            
            <a href="#" onclick="showDashboardSection('manageStudents')" class="dashboard-card">
                <i class="fas fa-users"></i>
                <h3>إدارة الطلاب</h3>
                <p>إضافة وتعديل وحذف سجلات الطلاب</p>
            </a>
            
            <a href="#" onclick="showDashboardSection('manageTeachers')" class="dashboard-card">
                <i class="fas fa-chalkboard-teacher"></i>
                <h3>إدارة الأساتذة</h3>
                <p>إضافة وتعديل وحذف سجلات الأساتذة</p>
            </a>

            <a href="#" onclick="showDashboardSection('manageUsers')" class="dashboard-card">
                <i class="fas fa-user-cog"></i>
                <h3>إدارة المستخدمين</h3>
                <p>إضافة وتعديل وحذف حسابات المستخدمين</p>
            </a>
            ` : ''}
        </div>
        
        <div class="quick-actions">
            <h3><i class="fas fa-bolt"></i> إجراءات سريعة</h3>
            <div class="actions-grid">
                <button onclick="showDashboardSection('manageExams')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الامتحانات
                </button>
                
                ${isAdmin ? `
                <button onclick="showDashboardSection('manageBranches')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الشعب
                </button>
                
                <button onclick="showDashboardSection('manageStudents')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الطلاب
                </button>
                
                <button onclick="showDashboardSection('manageTeachers')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الأساتذة
                </button>
                ` : ''}
                
                <button onclick="showDashboardSection('manageQuizzes')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الامتحانات السريعة
                </button>
            </div>
        </div>
    `;
}


function getRoleName(role) {
    const roles = {
        'admin': 'مدير النظام',
        'teacher': 'أستاذ',
        'arabic': 'أستاذ اللغة العربية',
        'math': 'أستاذ الرياضيات',
        'science': 'أستاذ العلوم',
        'english': 'أستاذ الإنجليزية',
        'social': 'أستاذ الاجتماعيات',
        'french': 'أستاذ الفرنسية',
        'religion': 'أستاذ الديانة'
    };
    return roles[role] || 'مستخدم';
}



















// جعل الدوال متاحة عالمياً
window.showDashboardSection = showDashboardSection;
window.logout = logout;
window.showStudentForm = showStudentForm;
window.hideStudentForm = hideStudentForm;
window.filterStudents = filterStudents;
window.editExam = editExam;
window.deleteExam = deleteExam;
window.editBranch = editBranch;
window.deleteBranch = deleteBranch;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.editTeacher = editTeacher;
window.deleteTeacher = deleteTeacher;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.cancelEdit = cancelEdit;

// استدعاء الدالة عند تحميل الصفحة
window.addEventListener('load', updateNavForAuth);