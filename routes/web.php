<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\IdCardController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CompanySettingController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\VerifyIdController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::get('/verify-id/{token}', [VerifyIdController::class, 'verify'])->name('verify.id');

// Protected Administrator Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/', fn() => redirect()->route('dashboard'));
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Administrator Profile
    Route::get('/profile', [AuthController::class, 'showProfile'])->name('profile');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');

    // HR - Employees
    Route::get('/employees/export-csv', [EmployeeController::class, 'exportCsv'])->name('employees.export.csv');
    Route::resource('employees', EmployeeController::class);

    // HR - Departments & Designations
    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::post('/departments', [DepartmentController::class, 'storeDepartment'])->name('departments.store');
    Route::delete('/departments/{department}', [DepartmentController::class, 'destroyDepartment'])->name('departments.destroy');
    Route::post('/designations', [DepartmentController::class, 'storeDesignation'])->name('designations.store');
    Route::delete('/designations/{designation}', [DepartmentController::class, 'destroyDesignation'])->name('designations.destroy');

    // HR - Attendance
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/single', [AttendanceController::class, 'markSingle'])->name('attendance.single');
    Route::post('/attendance/batch', [AttendanceController::class, 'markBatch'])->name('attendance.batch');
    Route::get('/attendance/calendar', [AttendanceController::class, 'calendar'])->name('attendance.calendar');
    Route::get('/attendance/export-csv', [AttendanceController::class, 'exportCsv'])->name('attendance.export.csv');

    // HR - Leave
    Route::get('/leave-management', [LeaveController::class, 'index'])->name('leave.index');
    Route::post('/leave-management', [LeaveController::class, 'store'])->name('leave.store');
    Route::patch('/leave-management/{leaveRequest}/status', [LeaveController::class, 'updateStatus'])->name('leave.status');
    Route::post('/leave-types', [LeaveController::class, 'storeType'])->name('leave.types.store');

    // HR - Holidays
    Route::get('/holidays', [HolidayController::class, 'index'])->name('holidays.index');
    Route::post('/holidays', [HolidayController::class, 'store'])->name('holidays.store');
    Route::delete('/holidays/{holiday}', [HolidayController::class, 'destroy'])->name('holidays.destroy');

    // HR - Payroll
    Route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');
    Route::post('/payroll/generate', [PayrollController::class, 'generateMonthly'])->name('payroll.generate');
    Route::get('/payroll/{salary}/pdf', [PayrollController::class, 'downloadSlipPdf'])->name('payroll.slip.pdf');
    Route::get('/payroll/bulk-pdf', [PayrollController::class, 'downloadBulkPdf'])->name('payroll.bulk.pdf');
    Route::get('/payroll/export-csv', [PayrollController::class, 'exportCsv'])->name('payroll.export.csv');

    // HR - Employee ID Cards Studio
    Route::get('/employee-id-cards', [IdCardController::class, 'index'])->name('idcards.index');
    Route::get('/employee-id-cards/{employee}/pdf', [IdCardController::class, 'downloadSinglePdf'])->name('idcards.pdf');
    Route::get('/employee-id-cards/bulk-sheet/pdf', [IdCardController::class, 'downloadBulkSheetPdf'])->name('idcards.bulk.pdf');
    Route::post('/employee-id-cards/{employee}/reissue', [IdCardController::class, 'reissue'])->name('idcards.reissue');

    // Operations - Projects & Tasks
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'storeProject'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'showProject'])->name('projects.show');
    Route::put('/projects/{project}', [ProjectController::class, 'updateProject'])->name('projects.update');

    Route::get('/tasks/kanban', [ProjectController::class, 'kanban'])->name('tasks.kanban');
    Route::post('/tasks', [ProjectController::class, 'storeTask'])->name('tasks.store');
    Route::patch('/tasks/{task}/status', [ProjectController::class, 'updateTaskStatus'])->name('tasks.status');

    // Operations - Meetings, Calendar & Announcements
    Route::get('/meetings', [MeetingController::class, 'index'])->name('meetings.index');
    Route::post('/meetings', [MeetingController::class, 'store'])->name('meetings.store');
    Route::put('/meetings/{meeting}', [MeetingController::class, 'update'])->name('meetings.update');

    Route::get('/calendar', [MeetingController::class, 'masterCalendar'])->name('calendar.index');

    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

    // Finance (Separate from Marketplace)
    Route::get('/finance', [FinanceController::class, 'dashboard'])->name('finance.dashboard');
    Route::get('/finance/income', [FinanceController::class, 'incomeIndex'])->name('finance.income');
    Route::post('/finance/income', [FinanceController::class, 'storeIncome'])->name('finance.income.store');
    Route::get('/finance/expenses', [FinanceController::class, 'expenseIndex'])->name('finance.expenses');
    Route::post('/finance/expenses', [FinanceController::class, 'storeExpense'])->name('finance.expenses.store');
    Route::get('/finance/expenses/report-pdf', [FinanceController::class, 'downloadExpenseReportPdf'])->name('finance.expenses.report.pdf');
    Route::get('/finance/statements', [FinanceController::class, 'statements'])->name('finance.statements');
    Route::get('/finance/statements/pdf', [FinanceController::class, 'downloadStatementPdf'])->name('finance.statements.pdf');
    Route::get('/finance/categories', [FinanceController::class, 'categories'])->name('finance.categories');
    Route::post('/finance/categories', [FinanceController::class, 'storeCategory'])->name('finance.categories.store');

    // Office Management
    Route::get('/assets', [AssetController::class, 'index'])->name('assets.index');
    Route::post('/assets', [AssetController::class, 'store'])->name('assets.store');
    Route::put('/assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
    Route::post('/assets/{asset}/maintenance', [AssetController::class, 'storeMaintenance'])->name('assets.maintenance.store');

    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::post('/inventory', [InventoryController::class, 'store'])->name('inventory.store');
    Route::post('/inventory/{inventoryItem}/adjust', [InventoryController::class, 'stockAdjustment'])->name('inventory.adjust');

    Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');

    // Documents
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{type}/pdf', [ReportController::class, 'downloadPdf'])->name('reports.pdf');

    // System
    Route::get('/company-settings', [CompanySettingController::class, 'index'])->name('settings.index');
    Route::post('/company-settings', [CompanySettingController::class, 'update'])->name('settings.update');
    Route::put('/company-settings', [CompanySettingController::class, 'update'])->name('settings.update.put');
    Route::post('/company-settings/backup', [CompanySettingController::class, 'createBackup'])->name('settings.backup.create');
    Route::get('/company-settings/backup/{filename}', [CompanySettingController::class, 'downloadBackup'])->name('settings.backup.download');

    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit.index');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read.all');
});
