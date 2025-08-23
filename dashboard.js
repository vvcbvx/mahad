

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

             <li><a href="#" onclick="showDashboardSection('manageSchedules')" class="nav-link" id="adminSchedulesLink"><i class="fas fa-calendar-alt"></i> الجداول الدراسية</a></li>
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
              if (isAdmin) loadManageSchedules();
            else showUnauthorized();
            break;
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
document.getElementById('adminSchedulesLink').style.display = isAdmin ? 'block' : 'none';

    
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
            

                    <a href="#" onclick="showDashboardSection('manageSchedules')" class="dashboard-card">
                <i class="fas fa-calendar-alt"></i>
                <h3>إدارة الجداول</h3>
                <p>إضافة وتعديل وحذف الجداول الدراسية</p>
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







// جلب الجداول من JSONBin
async function fetchSchedules() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.SCHEDULES.BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.SCHEDULES.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch schedules');
        
        const data = await response.json();
        return data.record.schedules || [];
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
}

// تحديث الجداول على JSONBin
async function updateSchedules(schedules) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.SCHEDULES.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.SCHEDULES.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ schedules })
        });
        
        if (!response.ok) throw new Error('Failed to update schedules');
    } catch (error) {
        console.error('Error updating schedules:', error);
        throw error;
    }
}







// تحميل قسم إدارة الجداول الدراسية (للمدير فقط)
async function loadManageSchedules() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل الجداول الدراسية...</p></div>';
    
    try {
        // جلب الجداول من JSONBin
        const schedules = await fetchSchedules();
        // جلب الشعب لاستخدامها في الربط
        const branches = await fetchBranches();
        
        // إنشاء واجهة إدارة الجداول
        let schedulesList = '';
        if (schedules.length > 0) {
            schedulesList = schedules.map(schedule => {
                const branch = branches.find(b => b.id === schedule.branchId);
                return `
                    <div class="schedule-item">
                        <div class="schedule-info">
                            <h3>${schedule.title}</h3>
                            <div class="schedule-meta">
                                <span><i class="fas fa-graduation-cap"></i> ${branch?.name || 'غير محدد'}</span>
                                <span><i class="fas fa-calendar"></i> ${formatDate(schedule.createdAt)}</span>
                                <span><i class="fas fa-edit"></i> ${formatDate(schedule.updatedAt)}</span>
                            </div>
                        </div>
                        <div class="schedule-actions">
                            <button onclick="editSchedule('${schedule.id}')" class="btn btn-edit">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button onclick="previewSchedule('${schedule.id}')" class="btn btn-preview">
                                <i class="fas fa-eye"></i> معاينة
                            </button>
                            <button onclick="deleteSchedule('${schedule.id}')" class="btn btn-delete">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            schedulesList = '<div class="no-items">لا توجد جداول مسجلة</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل جدول
        contentElement.innerHTML = `
            <div class="manage-schedules">
                <div class="section-header">
                    <h2><i class="fas fa-calendar-alt"></i> إدارة الجداول الدراسية</h2>
                    <p>يمكنك من هنا إضافة وتعديل وحذف الجداول الدراسية للشعب</p>
                    ${createBackButtons()}
                </div>
                
                <div class="schedule-form">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إضافة'} جدول دراسي</h3>
                    <form id="scheduleForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="scheduleTitle">عنوان الجدول</label>
                                <input type="text" id="scheduleTitle" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="scheduleBranch">الشعبة</label>
                                <select id="scheduleBranch" required>
                                    ${branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="scheduleDescription">وصف الجدول</label>
                            <textarea id="scheduleDescription" rows="2"></textarea>
                        </div>
                        
                        <div class="days-container">
                            <h4>أيام الأسبوع:</h4>
                            <div id="daysList">
                                <!-- سيتم إضافة الأيام هنا ديناميكياً -->
                            </div>
                            <button type="button" onclick="addDay()" class="btn btn-add">
                                <i class="fas fa-plus"></i> إضافة يوم
                            </button>
                        </div>
                        
                        <div class="form-actions">
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'} الجدول
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="schedules-list">
                    <h3><i class="fas fa-list"></i> قائمة الجداول الدراسية</h3>
                    ${schedulesList}
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const scheduleToEdit = schedules.find(s => s.id === currentEditId);
            if (scheduleToEdit) {
                document.getElementById('scheduleTitle').value = scheduleToEdit.title;
                document.getElementById('scheduleBranch').value = scheduleToEdit.branchId;
                document.getElementById('scheduleDescription').value = scheduleToEdit.description || '';
                
                // إضافة الأيام
                scheduleToEdit.days.forEach(day => {
                    addDay(day);
                });
            }
        } else {
            // إضافة يوم افتراضي عند الإنشاء
            addDay();
        }
        
        // إضافة أحداث النموذج
        document.getElementById('scheduleForm').addEventListener('submit', handleSaveSchedule);
    } catch (error) {
        console.error('Error loading schedules:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الجداول الدراسية</h3>
                <p>${error.message}</p>
                <button onclick="loadManageSchedules()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}

// دالة لإضافة يوم جديد
function addDay(dayData = null) {
    const daysList = document.getElementById('daysList');
    const dayId = `day_${Date.now()}`;
    
    let dayHtml = `
        <div class="day-item" id="${dayId}">
            <div class="day-header">
                <div class="form-group">
                    <label for="${dayId}_name">اسم اليوم</label>
                    <input type="text" id="${dayId}_name" value="${dayData?.name || ''}" required>
                </div>
                <button type="button" onclick="removeDay('${dayId}')" class="btn btn-delete">
                    <i class="fas fa-trash"></i> حذف اليوم
                </button>
            </div>
            
            <div class="periods-container">
                <h5>الحصص الدراسية:</h5>
                <div id="${dayId}_periods">
                    <!-- سيتم إضافة الحصص هنا ديناميكياً -->
                </div>
                <button type="button" onclick="addPeriod('${dayId}')" class="btn btn-add">
                    <i class="fas fa-plus"></i> إضافة حصة
                </button>
            </div>
        </div>
    `;
    
    daysList.insertAdjacentHTML('beforeend', dayHtml);
    
    // إضافة الحصص إذا كان في وضع التعديل
    if (dayData?.periods) {
        dayData.periods.forEach(period => {
            addPeriod(dayId, period);
        });
    } else {
        // إضافة حصة افتراضية عند الإنشاء
        addPeriod(dayId);
    }
}

// دالة لإضافة حصة جديدة
function addPeriod(dayId, periodText = '') {
    const periodsContainer = document.getElementById(`${dayId}_periods`);
    const periodId = `period_${Date.now()}`;
    
    let periodHtml = `
        <div class="period-item" id="${periodId}">
            <div class="form-group">
                <input type="text" id="${periodId}_text" value="${periodText}" placeholder="اسم المادة" required>
            </div>
            <button type="button" onclick="removePeriod('${periodId}')" class="btn btn-delete">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    periodsContainer.insertAdjacentHTML('beforeend', periodHtml);
}

// دالة لحذف يوم
function removeDay(dayId) {
    const dayElement = document.getElementById(dayId);
    if (dayElement) {
        dayElement.remove();
    }
}

// دالة لحذف حصة
function removePeriod(periodId) {
    const periodElement = document.getElementById(periodId);
    if (periodElement) {
        periodElement.remove();
    }
}

// معالجة حفظ الجدول
async function handleSaveSchedule(e) {
    e.preventDefault();
    
    const title = document.getElementById('scheduleTitle').value;
    const branchId = document.getElementById('scheduleBranch').value;
    const description = document.getElementById('scheduleDescription').value;
    
    if (!title || !branchId) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // جمع بيانات الأيام
    const days = [];
    const dayElements = document.querySelectorAll('.day-item');
    
    dayElements.forEach(dayElement => {
        const dayId = dayElement.id;
        const dayName = document.getElementById(`${dayId}_name`).value;
        
        // جمع بيانات الحصص
        const periods = [];
        const periodElements = dayElement.querySelectorAll('.period-item');
        
        periodElements.forEach(periodElement => {
            const periodId = periodElement.id;
            const periodText = document.getElementById(`${periodId}_text`).value;
            if (periodText) {
                periods.push(periodText);
            }
        });
        
        if (dayName && periods.length > 0) {
            days.push({
                name: dayName,
                periods: periods
            });
        }
    });
    
    if (days.length === 0) {
        showMessage('الرجاء إضافة يوم واحد على الأقل مع حصصه', 'error');
        return;
    }
    
    try {
        // جلب الجداول الحالية
        const schedules = await fetchSchedules();
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const scheduleIndex = schedules.findIndex(s => s.id === currentEditId);
            if (scheduleIndex !== -1) {
                schedules[scheduleIndex] = {
                    ...schedules[scheduleIndex],
                    title,
                    branchId,
                    description: description || '',
                    days,
                    updatedAt: new Date().toISOString()
                };
                
                // تحديث البيانات على JSONBin
                await updateSchedules(schedules);
                
                showMessage('تم تحديث الجدول بنجاح', 'success');
                loadManageSchedules();
            }
        } else {
            // حالة الإضافة
            const newSchedule = {
                id: generateId(),
                title,
                branchId,
                description: description || '',
                days,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: currentUser.username
            };
            
            schedules.push(newSchedule);
            
            // تحديث البيانات على JSONBin
            await updateSchedules(schedules);
            
            showMessage('تمت إضافة الجدول بنجاح', 'success');
            loadManageSchedules();
        }
    } catch (error) {
        console.error('Error saving schedule:', error);
        showMessage('حدث خطأ أثناء حفظ الجدول', 'error');
    }
}

// معاينة الجدول
function previewSchedule(scheduleId) {
    // يمكن تطوير هذه الدالة لعرض معاينة كاملة للجدول
    alert('سيتم تنفيذ معاينة الجدول هنا');
}

// تعديل جدول
function editSchedule(id) {
    editMode = true;
    currentEditId = id;
    loadManageSchedules();
}

// حذف جدول
async function deleteSchedule(id) {
    if (confirm('هل أنت متأكد من حذف هذا الجدول؟')) {
        try {
            const schedules = await fetchSchedules();
            const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
            await updateSchedules(updatedSchedules);
            showMessage('تم حذف الجدول بنجاح', 'success');
            loadManageSchedules();
        } catch (error) {
            console.error('Error deleting schedule:', error);
            showMessage('حدث خطأ أثناء حذف الجدول', 'error');
        }
    }
}



function addSchedulesCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* أنماط الجداول الدراسية */
        .manage-schedules {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .schedule-item {
            background: #fff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .schedule-info h3 {
            margin: 0 0 5px 0;
            color: #2c3e50;
        }
        
        .schedule-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 14px;
            color: #7f8c8d;
        }
        
        .schedule-meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .schedule-actions {
            display: flex;
            gap: 10px;
        }
        
        /* أنماط نموذج الجدول */
        .schedule-form {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .days-container {
            margin: 20px 0;
        }
        
        .day-item {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid #eee;
        }
        
        .day-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
        }
        
        .periods-container {
            margin: 15px 0;
        }
        
        .period-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .period-item .form-group {
            flex: 1;
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
    `;
    document.head.appendChild(style);
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', addSchedulesCSS);



// معالجة حفظ الجدول
async function handleSaveSchedule(e) {
    e.preventDefault();
    
    const title = document.getElementById('scheduleTitle').value;
    const branchId = document.getElementById('scheduleBranch').value;
    const description = document.getElementById('scheduleDescription').value;
    
    if (!title || !branchId) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // جمع بيانات الأيام
    const days = [];
    const dayElements = document.querySelectorAll('.day-item');
    
    dayElements.forEach(dayElement => {
        const dayId = dayElement.id;
        const dayName = document.getElementById(`${dayId}_name`).value;
        
        // جمع بيانات الحصص
        const periods = [];
        const periodElements = dayElement.querySelectorAll('.period-item');
        
        periodElements.forEach(periodElement => {
            const periodId = periodElement.id;
            const periodText = document.getElementById(`${periodId}_text`).value;
            if (periodText) {
                periods.push(periodText);
            }
        });
        
        if (dayName && periods.length > 0) {
            days.push({
                name: dayName,
                periods: periods
            });
        }
    });
    
    if (days.length === 0) {
        showMessage('الرجاء إضافة يوم واحد على الأقل مع حصصه', 'error');
        return;
    }
    
    try {
        // إظهار مؤشر التحميل
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        submitButton.disabled = true;
        
        // جلب الجداول الحالية
        const schedules = await fetchSchedules();
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const scheduleIndex = schedules.findIndex(s => s.id === currentEditId);
            if (scheduleIndex !== -1) {
                schedules[scheduleIndex] = {
                    ...schedules[scheduleIndex],
                    title,
                    branchId,
                    description: description || '',
                    days,
                    updatedAt: new Date().toISOString()
                };
                
                // تحديث البيانات على JSONBin
                await updateSchedules(schedules);
                
                showMessage('تم تحديث الجدول بنجاح', 'success');
                
                // إعادة تعيين الحقول وإخفاء وضع التعديل
                editMode = false;
                currentEditId = null;
                
                // إعادة تحميل القسم لتفريغ الحقول
                loadManageSchedules();
            }
        } else {
            // حالة الإضافة
            const newSchedule = {
                id: generateId(),
                title,
                branchId,
                description: description || '',
                days,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: currentUser.username
            };
            
            schedules.push(newSchedule);
            
            // تحديث البيانات على JSONBin
            await updateSchedules(schedules);
            
            showMessage('تمت إضافة الجدول بنجاح', 'success');
            
            // إعادة تعيين الحقول
            document.getElementById('scheduleTitle').value = '';
            document.getElementById('scheduleDescription').value = '';
            document.getElementById('daysList').innerHTML = '';
            
            // إضافة يوم افتراضي جديد
            addDay();
        }
    } catch (error) {
        console.error('Error saving schedule:', error);
        showMessage('حدث خطأ أثناء حفظ الجدول', 'error');
    } finally {
        // إعادة تعيين زر الحفظ
        if (submitButton) {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }
}



async function loadManageSchedules() {
    const contentElement = document.getElementById('dashboardContent');
    contentElement.innerHTML = '<div class="loading-content"><div class="loader"></div><p>جاري تحميل الجداول الدراسية...</p></div>';
    
    try {
        // جلب الجداول من JSONBin
        const schedules = await fetchSchedules();
        // جلب الشعب لاستخدامها في الربط
        const branches = await fetchBranches();
        
        // إنشاء واجهة إدارة الجداول
        let schedulesList = '';
        if (schedules.length > 0) {
            schedulesList = schedules.map(schedule => {
                const branch = branches.find(b => b.id === schedule.branchId);
                return `
                    <div class="schedule-item">
                        <div class="schedule-info">
                            <h3>${schedule.title}</h3>
                            <div class="schedule-meta">
                                <span><i class="fas fa-graduation-cap"></i> ${branch?.name || 'غير محدد'}</span>
                                <span><i class="fas fa-calendar"></i> ${formatDate(schedule.createdAt)}</span>
                                <span><i class="fas fa-edit"></i> ${formatDate(schedule.updatedAt)}</span>
                            </div>
                        </div>
                        <div class="schedule-actions">
                            <button onclick="editSchedule('${schedule.id}')" class="btn btn-edit">
                                <i class="fas fa-edit"></i> تعديل
                            </button>
                            <button onclick="previewSchedule('${schedule.id}')" class="btn btn-preview">
                                <i class="fas fa-eye"></i> معاينة
                            </button>
                            <button onclick="deleteSchedule('${schedule.id}')" class="btn btn-delete">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            schedulesList = '<div class="no-items">لا توجد جداول مسجلة</div>';
        }
        
        // إنشاء واجهة إضافة/تعديل جدول
        contentElement.innerHTML = `
            <div class="manage-schedules">
                <div class="section-header">
                    <h2><i class="fas fa-calendar-alt"></i> إدارة الجداول الدراسية</h2>
                    <p>يمكنك من هنا إضافة وتعديل وحذف الجداول الدراسية للشعب</p>
                    ${createBackButtons()}
                </div>
                
                <div class="schedule-form">
                    <h3><i class="fas fa-${editMode ? 'edit' : 'plus'}"></i> ${editMode ? 'تعديل' : 'إضافة'} جدول دراسي</h3>
                    <form id="scheduleForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="scheduleTitle">عنوان الجدول</label>
                                <input type="text" id="scheduleTitle" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="scheduleBranch">الشعبة</label>
                                <select id="scheduleBranch" required>
                                    ${branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="scheduleDescription">وصف الجدول</label>
                            <textarea id="scheduleDescription" rows="2"></textarea>
                        </div>
                        
                        <div class="days-container">
                            <h4>أيام الأسبوع:</h4>
                            <div id="daysList">
                                <!-- سيتم إضافة الأيام هنا ديناميكياً -->
                            </div>
                            <button type="button" onclick="addDay()" class="btn btn-add">
                                <i class="fas fa-plus"></i> إضافة يوم
                            </button>
                        </div>
                        
                        <div class="form-actions">
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'حفظ'} الجدول
                            </button>
                        </div>
                    </form>
                </div>
                
                <div class="schedules-list">
                    <h3><i class="fas fa-list"></i> قائمة الجداول الدراسية</h3>
                    ${schedulesList}
                </div>
            </div>
        `;
        
        // إذا كان في وضع التعديل، تعبئة النموذج
        if (editMode && currentEditId) {
            const scheduleToEdit = schedules.find(s => s.id === currentEditId);
            if (scheduleToEdit) {
                document.getElementById('scheduleTitle').value = scheduleToEdit.title;
                document.getElementById('scheduleBranch').value = scheduleToEdit.branchId;
                document.getElementById('scheduleDescription').value = scheduleToEdit.description || '';
                
                // إضافة الأيام
                scheduleToEdit.days.forEach(day => {
                    addDay(day);
                });
            }
        } else {
            // إضافة يوم افتراضي عند الإنشاء
            addDay();
        }
        
        // إضافة أحداث النموذج
        document.getElementById('scheduleForm').addEventListener('submit', handleSaveSchedule);
    } catch (error) {
        console.error('Error loading schedules:', error);
        contentElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>حدث خطأ أثناء تحميل الجداول الدراسية</h3>
                <p>${error.message}</p>
                <button onclick="loadManageSchedules()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
}








async function uploadExamFile(file, subject, grade) {
    try {
        // إنشاء اسم فريد للملف
        const fileExtension = file.name.split('.').pop();
        const randomName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExtension}`;
        const filePath = `exams/${grade}/${subject}/${randomName}`;
        
        // تحويل الملف إلى base64 بدون البادئة
        const base64Content = await readFileAsBase64(file);
        
        // إزالة البادئة إذا كانت موجودة (data:application/pdf;base64,)
        const cleanBase64 = base64Content.includes(',') ? base64Content.split(',')[1] : base64Content;
        
        console.log('Uploading file to GitHub:', filePath);
        
        // رفع الملف إلى GitHub
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.REPO_OWNER}/${GITHUB_CONFIG.REPO_NAME}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_CONFIG.TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `Upload exam file: ${file.name}`,
                content: cleanBase64,
                branch: GITHUB_CONFIG.BRANCH
            })
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('GitHub API Error:', responseData);
            throw new Error(responseData.message || `Failed to upload file: ${response.status}`);
        }

        const downloadUrl = responseData.content.download_url;
        
        return {
            fileName: randomName,
            downloadUrl: downloadUrl,
            originalFileName: file.name
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error(`فشل في رفع الملف إلى GitHub: ${error.message}`);
    }
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
        
        // إظهار مؤشر التحميل
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        submitButton.disabled = true;
        
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
                    exams[examIndex].originalFileName = fileInput.files[0].name;
                }
                
                await updateExams(exams);
                showMessage('تم تحديث الامتحان بنجاح', 'success');
                
                // إعادة تعيين الحقول وإخفاء وضع التعديل
                editMode = false;
                currentEditId = null;
                
                // إعادة تحميل القسم لتفريغ الحقول
                loadManageExams();
            }
        } else {
            // حالة الإضافة
            if (!fileInput.files[0]) {
                showMessage('الرجاء تحميل ملف الامتحان', 'error');
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
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
                originalFileName: fileInput.files[0].name,
                publishDate: new Date().toISOString(),
                publisher: currentUser.name || currentUser.username,
                downloads: 0,
                gradeName: gradeName,
                subjectName: getSubjectName(subject)
            };
            
            exams.push(newExam);
            await updateExams(exams);
            showMessage('تمت إضافة الامتحان بنجاح', 'success');
            
            // إعادة تعيين الحقول
            document.getElementById('examTitle').value = '';
            document.getElementById('examFile').value = '';
            if (isAdmin) {
                document.getElementById('examSubject').selectedIndex = 0;
            }
            document.getElementById('examGrade').selectedIndex = 0;
        }
    } catch (error) {
        console.error('Error saving exam:', error);
        showMessage(`حدث خطأ أثناء حفظ الامتحان: ${error.message}`, 'error');
    } finally {
        // إعادة تعيين زر الحفظ
        const submitButton = e.target.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = editMode ? '<i class="fas fa-save"></i> تحديث' : '<i class="fas fa-save"></i> حفظ';
            submitButton.disabled = false;
        }
    }
}



// دالة للتحقق من صحة توكن GitHub
async function validateGitHubToken() {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${GITHUB_CONFIG.TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error('GitHub token is invalid');
        }
        
        const userData = await response.json();
        console.log('GitHub token is valid for user:', userData.login);
        return true;
    } catch (error) {
        console.error('GitHub token validation failed:', error);
        showMessage('توكن GitHub غير صالح. يرجى التحقق من الإعدادات.', 'error');
        return false;
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (GITHUB_CONFIG.TOKEN && GITHUB_CONFIG.TOKEN !== 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
        validateGitHubToken();
    }
});

// داخل دالة loadManageExams، عدل جزء نموذج الامتحان:
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
                        <div id="fileUploadStatus" class="upload-status"></div>
                    </div>
                    ${editMode ? '<small>اتركه فارغاً إذا كنت لا تريد تغيير الملف</small>' : ''}
                    <div id="githubStatus" class="github-status"></div>
                </div>
            </div>
            
            <div class="form-actions">
                ${editMode ? `
                <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                    <i class="fas fa-times"></i> إلغاء
                </button>
                ` : ''}
                <button type="submit" class="btn btn-primary" id="submitExamBtn">
                    <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'نشر'}
                </button>
            </div>
        </form>
    </div>
`;



function addUploadStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .file-upload-wrapper {
            margin-top: 8px;
        }
        
        .upload-status {
            margin-top: 5px;
            font-size: 14px;
            padding: 5px;
            border-radius: 4px;
        }
        
        .upload-status .fa-spinner {
            margin-right: 5px;
        }
        
        .github-status {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            background-color: #f8f9fa;
            border-left: 4px solid #17a2b8;
        }
        
        .github-status.connected {
            border-left-color: #28a745;
        }
        
        .github-status.error {
            border-left-color: #dc3545;
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', addUploadStyles);



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
    document.getElementById('adminSchedulesLink').style.display = isAdmin ? 'block' : 'none';
    
    // إخفاء عناصر القائمة غير المصرح بها للمدرسين
    if (!isAdmin && currentUser.role !== 'teacher') {
        // إخفاء جميع عناصر القائمة باستثناء العناصر المسموح بها
        const allowedItems = ['dashboardHome', 'manageExams', 'manageQuizzes'];
        document.querySelectorAll('.dashboard-nav a').forEach(link => {
            const section = link.getAttribute('onclick').match(/'(.*?)'/)[1];
            if (!allowedItems.includes(section)) {
                link.style.display = 'none';
            }
        });
    }
    
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


function getRoleName(role) {
    const roles = {
        'admin': 'مدير النظام',
       
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
    document.getElementById('adminSchedulesLink').style.display = isAdmin ? 'block' : 'none';
    
    // إخفاء عناصر القائمة غير المصرح بها للمدرسين
    if (!isAdmin && currentUser.role !== 'teacher') {
        // إخفاء جميع عناصر القائمة باستثناء العناصر المسموح بها
        const allowedItems = ['dashboardHome', 'manageExams', 'manageQuizzes'];
        document.querySelectorAll('.dashboard-nav a').forEach(link => {
            const section = link.getAttribute('onclick').match(/'(.*?)'/)[1];
            if (!allowedItems.includes(section)) {
                link.style.display = 'none';
            }
        });
    }
    
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
        case 'manageSchedules':
            if (isAdmin) loadManageSchedules();
            else showUnauthorized();
            break;
        default:
            loadDashboardHome();
    }
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
            
            <a href="#" onclick="showDashboardSection('manageSchedules')" class="dashboard-card">
                <i class="fas fa-calendar-alt"></i>
                <h3>إدارة الجداول</h3>
                <p>إضافة وتعديل وحذف الجداول الدراسية</p>
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
                
                <button onclick="showDashboardSection('manageSchedules')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الجداول
                </button>
                ` : ''}
                
                <button onclick="showDashboardSection('manageQuizzes')" class="action-btn">
                    <i class="fas fa-plus"></i> إدارة الامتحانات السريعة
                </button>
            </div>
        </div>
    `;
}


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
        if (isAdmin || currentUser.role === 'teacher' || ['arabic', 'math', 'science', 'english', 'social', 'french', 'religion'].includes(currentUser.role)) {
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
                                    <div id="fileUploadStatus" class="upload-status"></div>
                                </div>
                                ${editMode ? '<small>اتركه فارغاً إذا كنت لا تريد تغيير الملف</small>' : ''}
                                <div id="githubStatus" class="github-status"></div>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            ${editMode ? `
                            <button type="button" onclick="cancelEdit()" class="btn btn-cancel">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                            ` : ''}
                            <button type="submit" class="btn btn-primary" id="submitExamBtn">
                                <i class="fas fa-save"></i> ${editMode ? 'تحديث' : 'نشر'}
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
                                <input type="text" id="userUsername" ${editMode ? '' : 'required'}>
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
                                    <option value="french">أستاذ الفرنسية</option>
                                    <option value="religion">أستاذ الديانة</option>
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

// تحديث الامتحانات السريعة على JSONBin
async function updateQuizzes(quizzes) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_API_KEYS.QUIZZES.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_API_KEYS.QUIZZES.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizzes: quizzes })
        });
        
        if (!response.ok) throw new Error('Failed to update quizzes');
    } catch (error) {
        console.error('Error updating quizzes:', error);
        throw error;
    }
}

// تحسين واجهة التحميل ومنع التكرار
function showLoadingOverlay(message = 'جاري المعالجة...') {
    // إنشاء عنصر التحميل إذا لم يكن موجوداً
    if (!document.getElementById('loadingOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        overlay.innerHTML = `
            <div class="spinner" style="
                width: 60px;
                height: 60px;
                border: 5px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top: 5px solid #3498db;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            "></div>
            <p id="loadingMessage" style="font-size: 18px; margin: 0;">${message}</p>
        `;
        
        // إضافة أنيميشن للدوران
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(overlay);
    } else {
        document.getElementById('loadingMessage').textContent = message;
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// تحسين معالجة تسجيل الدخول
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const messageElement = document.getElementById('loginMessage');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!username || !password) {
        showMessage(messageElement, 'الرجاء إدخال اسم المستخدم وكلمة المرور', 'error');
        return;
    }
    
    try {
        // منع التكرار - تعطيل الزر وإظهار التحميل
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الدخول...';
        
        // إظهار واجهة التحميل
        showLoadingOverlay('جاري التحقق من بيانات الدخول...');
        
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
            
            // إظهار رسالة النجاح
            showLoadingOverlay('تم الدخول بنجاح! جاري التوجيه...');
            
            // تأخير بسيط لإظهار رسالة النجاح
            setTimeout(() => {
                // تهيئة لوحة التحكم
                setupDashboard();
                hideLoadingOverlay();
            }, 1500);
        } else {
            hideLoadingOverlay();
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> دخول';
            showMessage(messageElement, 'اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        hideLoadingOverlay();
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> دخول';
        showMessage(messageElement, 'حدث خطأ أثناء محاولة الدخول. يرجى المحاولة لاحقاً', 'error');
    }
}

// تحسين وظائف الحفظ
async function handleSaveExam(e) {
    e.preventDefault();
    
    const title = document.getElementById('examTitle').value;
    const subject = document.getElementById('examSubject').value;
    const grade = document.getElementById('examGrade').value;
    const fileInput = document.getElementById('examFile');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!title || !subject || !grade) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // منع التكرار - تعطيل الزر وإظهار التحميل
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        
        // إظهار واجهة التحميل
        showLoadingOverlay(editMode ? 'جاري تحديث الامتحان...' : 'جاري نشر الامتحان...');
        
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
                    exams[examIndex].originalFileName = fileInput.files[0].name;
                }
                
                await updateExams(exams);
                
                // إظهار رسالة النجاح
                showLoadingOverlay('تم تحديث الامتحان بنجاح!');
                
                setTimeout(() => {
                    hideLoadingOverlay();
                    showMessage('تم تحديث الامتحان بنجاح', 'success');
                    loadManageExams();
                }, 1500);
            }
        } else {
            // حالة الإضافة
            if (!fileInput.files[0]) {
                hideLoadingOverlay();
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-save"></i> نشر';
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
                originalFileName: fileInput.files[0].name,
                publishDate: new Date().toISOString(),
                publisher: currentUser.name || currentUser.username,
                downloads: 0,
                gradeName: gradeName,
                subjectName: getSubjectName(subject)
            };
            
            exams.push(newExam);
            await updateExams(exams);
            
            // إظهار رسالة النجاح
            showLoadingOverlay('تم نشر الامتحان بنجاح!');
            // داخل بلوك success في handleSaveExam
showMessage('تم تحديث الامتحان بنجاح', 'success');

// إفراغ الحقول والخروج من وضع التعديل
cancelEdit();
            setTimeout(() => {
                hideLoadingOverlay();
                showMessage('تمت إضافة الامتحان بنجاح', 'success');
                loadManageExams();
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving exam:', error);
        hideLoadingOverlay();
        submitButton.disabled = false;
        submitButton.innerHTML = editMode ? '<i class="fas fa-save"></i> تحديث' : '<i class="fas fa-save"></i> نشر';
        showMessage(`حدث خطأ أثناء حفظ الامتحان: ${error.message}`, 'error');
    }
}

// إضافة CSS إضافي للتحسينات
function addEnhancedStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* تحسين أزرار التحميل */
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        /* تحسين رسائل التحميل */
        .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            text-align: center;
        }
        
        .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        /* تحسين الرسائل */
        .message {
            padding: 12px 20px;
            margin: 15px 0;
            border-radius: 6px;
            font-weight: 500;
            display: flex;
            align-items: center;
        }
        
        .message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .message i {
            margin-left: 8px;
        }
        
        /* تحسين النماذج */
        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        /* تحسين القوائم */
        .exam-item, .quiz-item, .branch-item, .teacher-item {
            transition: all 0.3s ease;
        }
        
        .exam-item:hover, .quiz-item:hover, .branch-item:hover, .teacher-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    addEnhancedStyles();
});

// تحسين وظيفة showMessage
function showMessage(message, type, element = null) {
    const targetElement = element || document.getElementById('dashboardContent');
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    // إضافة الرسالة في الأعلى
    if (targetElement.firstChild) {
        targetElement.insertBefore(messageElement, targetElement.firstChild);
    } else {
        targetElement.appendChild(messageElement);
    }
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}




async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const messageElement = document.getElementById('loginMessage');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!username || !password) {
        showMessage(messageElement, 'الرجاء إدخال اسم المستخدم وكلمة المرور', 'error');
        return;
    }
    
    try {
        // تعطيل الزر أثناء المعالجة
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الدخول...';
        
        // جلب بيانات المستخدمين
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
            // إعادة تعيين الزر وعرض رسالة الخطأ
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> دخول';
            showMessage(messageElement, 'اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        // إعادة تعيين الزر وعرض رسالة الخطأ
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> دخول';
        showMessage(messageElement, 'حدث خطأ أثناء محاولة الدخول. يرجى المحاولة لاحقاً', 'error');
    }
}


// عرض رسالة في قسم التسجيل
function showMessage(element, message, type) {
    element.innerHTML = `
        <div class="message ${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        </div>
    `;
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        element.innerHTML = '';
    }, 10000);
}

// دالة لإفراغ جميع الحقول في النموذج
function clearFormFields(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
                
                // إعادة تعيين الـ select إلى القيمة الأولى
                if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                }
                
                // إعادة تعيين الـ checkbox و radio
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                }
            }
        });
    }
}


// إلغاء التعديل

// تحسين دالة إضافة سؤال جديد
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

// تحسين معالجة حفظ الامتحان السريع
async function handleSaveQuiz(e) {
    e.preventDefault();
    
    const title = document.getElementById('quizTitle').value;
    const subject = document.getElementById('quizSubject').value;
    const grade = document.getElementById('quizGrade').value;
    const totalMarks = parseInt(document.getElementById('quizTotalMarks').value);
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!title || !subject || !grade || !totalMarks) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // منع التكرار - تعطيل الزر وإظهار التحميل
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        
        // إظهار واجهة التحميل
        showLoadingOverlay(editMode ? 'جاري تحديث الامتحان السريع...' : 'جاري إنشاء الامتحان السريع...');
        
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
                throw new Error('الرجاء تعبئة جميع حقول الأسئلة والخيارات');
            }
            
            if (correctAnswer === null) {
                throw new Error('الرجاء تحديد الإجابة الصحيحة لكل سؤال');
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
            throw new Error(`مجموع درجات الأسئلة (${totalQuestionsMarks}) لا يساوي الدرجة الكلية (${totalMarks})`);
        }
        
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
                
                // إظهار رسالة النجاح
                showLoadingOverlay('تم تحديث الامتحان السريع بنجاح!');
                
                setTimeout(() => {
                    hideLoadingOverlay();
                    showMessage('تم تحديث الامتحان السريع بنجاح', 'success');
                    // إفراغ الحقول والخروج من وضع التعديل
                    cancelEditQuiz();
                }, 1500);
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
            
            // إظهار رسالة النجاح
            showLoadingOverlay('تم إنشاء الامتحان السريع بنجاح!');
            
            setTimeout(() => {
                hideLoadingOverlay();
                showMessage('تم إنشاء الامتحان السريع بنجاح', 'success');
                // إفراغ الحقول
                resetQuizForm();
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving quiz:', error);
        hideLoadingOverlay();
        submitButton.disabled = false;
        submitButton.innerHTML = editMode ? '<i class="fas fa-save"></i> تحديث' : '<i class="fas fa-save"></i> حفظ';
        showMessage(error.message, 'error');
    }
}

// دالة جديدة لإفراغ نموذج الامتحان السريع
function resetQuizForm() {
    document.getElementById('quizTitle').value = '';
    document.getElementById('quizTotalMarks').value = '20';
    document.getElementById('questionsContainer').innerHTML = '';
    
    // إضافة سؤال افتراضي جديد
    addQuestion();
    
    // إعادة تعيين التحديدات إذا كان مديراً
    if (isAdmin) {
        document.getElementById('quizSubject').selectedIndex = 0;
        document.getElementById('quizGrade').selectedIndex = 0;
    }
}

// دالة جديدة للخروج من وضع التعديل للامتحانات السريعة
function cancelEditQuiz() {
    editMode = false;
    currentEditId = null;
    resetQuizForm();
    showDashboardSection('manageQuizzes');
}

// تحسين دالة تعديل الامتحان السريع
function editQuiz(id) {
    editMode = true;
    currentEditId = id;
    loadManageQuizzes();
}

// تحسين دالة حذف الامتحان السريع
async function deleteQuiz(id) {
    if (confirm('هل أنت متأكد من حذف هذا الامتحان السريع؟')) {
        try {
            // إظهار واجهة التحميل
            showLoadingOverlay('جاري حذف الامتحان السريع...');
            
            const quizzes = await fetchQuizzes();
            const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
            await updateQuizzes(updatedQuizzes);
            
            // إظهار رسالة النجاح
            showLoadingOverlay('تم حذف الامتحان السريع بنجاح!');
            
            setTimeout(() => {
                hideLoadingOverlay();
                showMessage('تم حذف الامتحان السريع بنجاح', 'success');
                loadManageQuizzes();
            }, 1500);
        } catch (error) {
            console.error('Error deleting quiz:', error);
            hideLoadingOverlay();
            showMessage('حدث خطأ أثناء حذف الامتحان السريع', 'error');
        }
    }
}

// تحسين دالة إلغاء التعديل العامة
function cancelEdit() {
    editMode = false;
    currentEditId = null;
    
    // إفراغ جميع الحقول في النماذج المختلفة
    const forms = ['examForm', 'branchForm', 'studentFormElement', 'teacherFormElement', 'userFormElement', 'quizForm', 'scheduleForm'];
    
    forms.forEach(formId => {
        if (document.getElementById(formId)) {
            clearFormFields(formId);
        }
    });
    
    // إعادة تحميل القسم الحالي لتحديث الواجهة
    if (currentSection) {
        showDashboardSection(currentSection);
    }
}


async function handleSaveUser(e) {
    e.preventDefault();
    
    const username = document.getElementById('userUsername').value;
    const name = document.getElementById('userName').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!username || !role) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // منع التكرار - تعطيل الزر وإظهار التحميل
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        
        // إظهار واجهة التحميل
        showLoadingOverlay(editMode ? 'جاري تحديث المستخدم...' : 'جاري إضافة المستخدم...');
        
        // جلب المستخدمين الحاليين
        const users = await fetchUsers();
        
        if (editMode && currentEditId) {
            // حالة التعديل
            const userIndex = users.findIndex(u => u.username === currentEditId);
            if (userIndex !== -1) {
                // إذا تم تغيير اسم المستخدم، التحقق من عدم التكرار
                if (username !== currentEditId && users.some(u => u.username === username)) {
                    hideLoadingOverlay();
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-save"></i> تحديث';
                    showMessage('اسم المستخدم موجود مسبقاً', 'error');
                    return;
                }
                
                users[userIndex] = {
                    ...users[userIndex],
                    username: username,
                    name: name || '',
                    role: role,
                    // تحديث كلمة المرور فقط إذا تم إدخالها
                    password: password ? password : users[userIndex].password
                };
                
                // إذا كان المستخدم الحالي هو الذي يتم تعديله، تحديث بيانات الجلسة
                if (currentUser.username === currentEditId) {
                    currentUser = users[userIndex];
                    localStorage.setItem('savedUser', JSON.stringify(currentUser));
                    document.getElementById('loggedInUsername').textContent = currentUser.name || currentUser.username;
                    document.getElementById('loggedInRole').textContent = getRoleName(currentUser.role);
                }
                
                // تحديث البيانات على JSONBin
                await updateUsers(users);
                
                // إظهار رسالة النجاح
                showLoadingOverlay('تم تحديث المستخدم بنجاح!');
                
                setTimeout(() => {
                    hideLoadingOverlay();
                    showMessage('تم تحديث المستخدم بنجاح', 'success');
                    
                    // إفراغ الحقول والخروج من وضع التعديل
                    cancelEdit();
                    loadManageUsers();
                }, 1500);
            }
        } else {
            // حالة الإضافة
            if (!password) {
                hideLoadingOverlay();
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-save"></i> حفظ';
                showMessage('الرجاء إدخال كلمة المرور', 'error');
                return;
            }
            
            // التحقق من عدم وجود مستخدم بنفس الاسم
            if (users.some(u => u.username === username)) {
                hideLoadingOverlay();
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-save"></i> حفظ';
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
            
            // إظهار رسالة النجاح
            showLoadingOverlay('تمت إضافة المستخدم بنجاح!');
            
            setTimeout(() => {
                hideLoadingOverlay();
                showMessage('تمت إضافة المستخدم بنجاح', 'success');
                
                // إفراغ الحقول
                clearFormFields('userFormElement');
                loadManageUsers();
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        hideLoadingOverlay();
        submitButton.disabled = false;
        submitButton.innerHTML = editMode ? '<i class="fas fa-save"></i> تحديث' : '<i class="fas fa-save"></i> حفظ';
        showMessage('حدث خطأ أثناء حفظ المستخدم', 'error');
    }
}


async function handleSaveStudent(e) {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value;
    const branchId = document.getElementById('studentBranch').value;
    const average = document.getElementById('studentAverage').value;
    const attendance = document.getElementById('studentAttendance').value;
    const achievements = document.getElementById('studentAchievements').value;
    const avatarInput = document.getElementById('studentAvatar');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!name || !branchId || !average || !attendance) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // تعطيل الزر وإظهار التحميل
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        showLoadingOverlay(editMode ? 'جاري تحديث الطالب...' : 'جاري إضافة الطالب...');
        
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
                
                // إظهار رسالة النجاح
                showLoadingOverlay('تم تحديث الطالب بنجاح!');
                
                setTimeout(() => {
                    hideLoadingOverlay();
                    showMessage('تم تحديث الطالب بنجاح', 'success');
                    // إفراغ الحقول والخروج من وضع التعديل
                    cancelEdit();
                }, 1500);
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
            
            // إظهار رسالة النجاح
            showLoadingOverlay('تمت إضافة الطالب بنجاح!');
            
            setTimeout(() => {
                hideLoadingOverlay();
                showMessage('تمت إضافة الطالب بنجاح', 'success');
                // إفراغ الحقول
                clearFormFields('studentFormElement');
                // إخفاء النموذج بعد الإضافة
                hideStudentForm();
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving student:', error);
        hideLoadingOverlay();
        submitButton.disabled = false;
        submitButton.innerHTML = editMode ? '<i class="fas fa-save"></i> تحديث' : '<i class="fas fa-save"></i> حفظ';
        showMessage('حدث خطأ أثناء حفظ الطالب', 'error');
    }
}

// دالة لإفراغ جميع الحقول في النموذج


// عرض نموذج الطالب
function showStudentForm() {
    document.getElementById('studentForm').style.display = 'block';
}

// إخفاء نموذج الطالب
function hideStudentForm() {
    document.getElementById('studentForm').style.display = 'none';
    // إفراغ الحقول عند الإخفاء
    clearFormFields('studentFormElement');
}

// تحسين وظيفة showMessage
function showMessage(message, type, element = null) {
    const targetElement = element || document.getElementById('dashboardContent');
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    // إضافة الرسالة في الأعلى
    if (targetElement.firstChild) {
        targetElement.insertBefore(messageElement, targetElement.firstChild);
    } else {
        targetElement.appendChild(messageElement);
    }
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

async function handleSaveBranch(e) {
    e.preventDefault();
    
    const name = document.getElementById('branchName').value;
    const grade = document.getElementById('branchGrade').value;
    const teacher = document.getElementById('branchTeacher').value;
    const studentsCount = document.getElementById('branchStudents').value;
    const desc = document.getElementById('branchDesc').value;
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!name || !grade || !teacher || !studentsCount) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // منع التكرار - تعطيل الزر وإظهار التحميل
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        
        // إظهار واجهة التحميل
        showLoadingOverlay(editMode ? 'جاري تحديث الشعبة...' : 'جاري إضافة الشعبة...');
        
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
                    description: desc || 'لا يوجد وصف',
                    updatedAt: new Date().toISOString()
                };
                
                // تحديث البيانات على JSONBin
                await updateBranches(branches);
                
                // إظهار رسالة النجاح
                showLoadingOverlay('تم تحديث الشعبة بنجاح!');
                
                setTimeout(() => {
                    hideLoadingOverlay();
                    showMessage('تم تحديث الشعبة بنجاح', 'success');
                    // إفراغ الحقول والخروج من وضع التعديل
                    cancelEdit();
                }, 1500);
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
                updatedAt: new Date().toISOString(),
                isActive: true
            };
            
            branches.push(newBranch);
            
            // تحديث البيانات على JSONBin
            await updateBranches(branches);
            
            // إظهار رسالة النجاح
            showLoadingOverlay('تمت إضافة الشعبة بنجاح!');
            
            setTimeout(() => {
                hideLoadingOverlay();
                showMessage('تمت إضافة الشعبة بنجاح', 'success');
                // إفراغ الحقول
                clearFormFields('branchForm');
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving branch:', error);
        hideLoadingOverlay();
        submitButton.disabled = false;
        submitButton.innerHTML = editMode ? '<i class="fas fa-save"></i> تحديث' : '<i class="fas fa-save"></i> حفظ';
        showMessage('حدث خطأ أثناء حفظ الشعبة', 'error');
    }
}




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
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (!name || !subject || !experience || !lectures) {
        showMessage('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        // منع التكرار - تعطيل الزر وإظهار التحميل
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        
        // إظهار واجهة التحميل
        showLoadingOverlay(editMode ? 'جاري تحديث بيانات الأستاذ...' : 'جاري إضافة الأستاذ...');
        
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
                
                // إظهار رسالة النجاح
                showLoadingOverlay('تم تحديث الأستاذ بنجاح!');
                
                setTimeout(() => {
                    hideLoadingOverlay();
                    showMessage('تم تحديث الأستاذ بنجاح', 'success');
                    // إفراغ الحقول والخروج من وضع التعديل
                    cancelEditTeacher();
                }, 1500);
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
            
            // إظهار رسالة النجاح
            showLoadingOverlay('تمت إضافة الأستاذ بنجاح!');
            
            setTimeout(() => {
                hideLoadingOverlay();
                showMessage('تمت إضافة الأستاذ بنجاح', 'success');
                // إفراغ الحقول
                resetTeacherForm();
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving teacher:', error);
        hideLoadingOverlay();
        submitButton.disabled = false;
        submitButton.innerHTML = editMode ? '<i class="fas fa-save"></i> تحديث' : '<i class="fas fa-save"></i> حفظ';
        showMessage('حدث خطأ أثناء حفظ الأستاذ', 'error');
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
        
        // إضافة أحداث النموذج بعد إنشاء العناصر في DOM
        document.getElementById('teacherFormElement').addEventListener('submit', handleSaveTeacher);
        
        // إذا كان في وضع التعديل، تعبئة النموذج بعد التأكد من وجود العناصر
        if (editMode && currentEditId) {
            // استخدام setTimeout لضمان تحميل العناصر في DOM أولاً
            setTimeout(() => {
                const teacherToEdit = teachers.find(t => t.id === currentEditId);
                if (teacherToEdit && document.getElementById('teacherName')) {
                    document.getElementById('teacherName').value = teacherToEdit.name || '';
                    document.getElementById('teacherSubject').value = teacherToEdit.subject || '';
                    document.getElementById('teacherBranch').value = teacherToEdit.branch || '';
                    document.getElementById('teacherPhone').value = teacherToEdit.phone || '';
                    document.getElementById('teacherExperience').value = parseInt(teacherToEdit.experience) || 0;
                    document.getElementById('teacherLectures').value = parseInt(teacherToEdit.lectures) || 0;
                    document.getElementById('teacherCertificates').value = teacherToEdit.certificates || '';
                    document.getElementById('teacherBio').value = teacherToEdit.bio || '';
                }
            }, 100);
        }
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