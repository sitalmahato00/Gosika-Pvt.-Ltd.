<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\CompanySetting;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\EmployeeIdCard;
use App\Models\Attendance;
use App\Models\LeaveType;
use App\Models\LeaveRequest;
use App\Models\Holiday;
use App\Models\Salary;
use App\Models\IncomeCategory;
use App\Models\ExpenseCategory;
use App\Models\Income;
use App\Models\Expense;
use App\Models\Project;
use App\Models\Task;
use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\Announcement;
use App\Models\Supplier;
use App\Models\Asset;
use App\Models\AssetMaintenance;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use App\Models\Document;
use App\Models\AuditLog;
use App\Models\Notification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Administrator
        $adminEmail = config('app.admin.email');
        $adminPassword = config('app.admin.password');

        if (!is_string($adminEmail) || !filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
            throw new \RuntimeException('Set a valid ADMIN_EMAIL before running database seeding.');
        }

        if (!is_string($adminPassword) || strlen($adminPassword) < 12) {
            throw new \RuntimeException('Set an ADMIN_PASSWORD of at least 12 characters before running database seeding.');
        }

        $admin = User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => config('app.admin.name'),
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'phone' => '+977-9801234567',
                'status' => 'active',
            ]
        );

        // 2. Company Setting
        $company = CompanySetting::firstOrCreate([], [
            'company_name' => 'GOSIKA Pvt. Ltd.',
            'trading_name' => 'GOSIKA',
            'registration_no' => 'REG-284910/080/081',
            'pan_vat_no' => '612093845',
            'email' => 'office@gosika.com',
            'phone' => '+977-1-4567890',
            'website' => 'https://gosika.com',
            'address' => 'Corporate Tower, Level 4, Tinkune',
            'city' => 'Kathmandu',
            'country' => 'Nepal',
            'default_currency' => 'NPR',
            'currency_symbol' => 'रू',
            'date_format' => 'Y-m-d',
            'fiscal_year' => '2081/2082',
            'id_card_template' => 'corporate_modern',
            'attendance_grace_minutes' => 15,
            'annual_leave_quota' => 18,
            'default_tax_rate' => 1.00,
            'default_provident_fund_rate' => 10.00,
        ]);

        // 3. Departments
        $deptExec = Department::create(['name' => 'Executive Management', 'code' => 'EXEC', 'description' => 'Corporate governance and executive leadership']);
        $deptTech = Department::create(['name' => 'Technology & Engineering', 'code' => 'TECH', 'description' => 'Software engineering, DevOps, and cloud systems']);
        $deptFin  = Department::create(['name' => 'Finance & Operations', 'code' => 'FIN', 'description' => 'Corporate finance, budgeting, and operations']);
        $deptHR   = Department::create(['name' => 'Human Resources & Administration', 'code' => 'HR', 'description' => 'People operations, recruitment, and office admin']);
        $deptMkt  = Department::create(['name' => 'Product & Business Development', 'code' => 'PBD', 'description' => 'Client relations, product management, and growth']);

        // 4. Designations
        $desCeo   = Designation::create(['department_id' => $deptExec->id, 'title' => 'Chief Executive Officer', 'code' => 'CEO', 'description' => 'Executive lead']);
        $desCto   = Designation::create(['department_id' => $deptTech->id, 'title' => 'Chief Technology Officer', 'code' => 'CTO', 'description' => 'Tech visionary and architect']);
        $desLead  = Designation::create(['department_id' => $deptTech->id, 'title' => 'Senior Full Stack Engineer', 'code' => 'SFSE', 'description' => 'Full stack development']);
        $desDev   = Designation::create(['department_id' => $deptTech->id, 'title' => 'Backend Laravel Engineer', 'code' => 'BLE', 'description' => 'API and backend services']);
        $desUi    = Designation::create(['department_id' => $deptTech->id, 'title' => 'Senior UI/UX Designer', 'code' => 'UIUX', 'description' => 'Interface and brand designer']);
        $desFin   = Designation::create(['department_id' => $deptFin->id, 'title' => 'Finance Controller', 'code' => 'FC', 'description' => 'Audit, taxes, and accounting']);
        $desAcc   = Designation::create(['department_id' => $deptFin->id, 'title' => 'Senior Accountant', 'code' => 'ACC', 'description' => 'Bookkeeping and disbursements']);
        $desHrMgr = Designation::create(['department_id' => $deptHR->id, 'title' => 'HR Operations Lead', 'code' => 'HRL', 'description' => 'HR policies and attendance']);
        $desOffAdm= Designation::create(['department_id' => $deptHR->id, 'title' => 'Office Administrator', 'code' => 'OA', 'description' => 'Assets, inventory, and logistics']);
        $desProd  = Designation::create(['department_id' => $deptMkt->id, 'title' => 'Product Delivery Manager', 'code' => 'PDM', 'description' => 'Client delivery and scoping']);

        // 5. Employees
        $employeesData = [
            [
                'employee_code' => 'GSK-EMP-1001',
                'first_name' => 'Aarav',
                'last_name' => 'Sharma',
                'email' => 'aarav.sharma@gosika.com',
                'phone' => '+977-9841122334',
                'gender' => 'male',
                'date_of_birth' => '1988-04-15',
                'marital_status' => 'Married',
                'blood_group' => 'O+',
                'permanent_address' => 'Ward 4, Baneshwor, Kathmandu',
                'current_address' => 'Tinkune, Kathmandu',
                'department_id' => $deptExec->id,
                'designation_id' => $desCeo->id,
                'employment_type' => 'full_time',
                'joining_date' => '2023-01-01',
                'basic_salary' => 185000.00,
                'bank_name' => 'Nabil Bank Ltd',
                'bank_account_no' => '0120017500123',
                'bank_branch' => 'Tinkune Branch',
                'emergency_contact_name' => 'Sunita Sharma',
                'emergency_contact_phone' => '+977-9841998877',
                'emergency_contact_relation' => 'Spouse',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1002',
                'first_name' => 'Bikash',
                'last_name' => 'Adhikari',
                'email' => 'bikash.adhikari@gosika.com',
                'phone' => '+977-9851098765',
                'gender' => 'male',
                'date_of_birth' => '1991-09-22',
                'marital_status' => 'Single',
                'blood_group' => 'A+',
                'permanent_address' => 'Pokhara-8, Kaski',
                'current_address' => 'Jhamsikhel, Lalitpur',
                'department_id' => $deptTech->id,
                'designation_id' => $desCto->id,
                'employment_type' => 'full_time',
                'joining_date' => '2023-02-15',
                'basic_salary' => 160000.00,
                'bank_name' => 'Global IME Bank',
                'bank_account_no' => '2401010098712',
                'bank_branch' => 'Pulchowk Branch',
                'emergency_contact_name' => 'Khem Adhikari',
                'emergency_contact_phone' => '+977-9856012345',
                'emergency_contact_relation' => 'Father',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1003',
                'first_name' => 'Pooja',
                'last_name' => 'Thapa',
                'email' => 'pooja.thapa@gosika.com',
                'phone' => '+977-9813245678',
                'gender' => 'female',
                'date_of_birth' => '1994-07-11',
                'marital_status' => 'Married',
                'blood_group' => 'B+',
                'permanent_address' => 'Butwal-4, Rupandehi',
                'current_address' => 'Koteshwor, Kathmandu',
                'department_id' => $deptTech->id,
                'designation_id' => $desLead->id,
                'employment_type' => 'full_time',
                'joining_date' => '2023-06-01',
                'basic_salary' => 120000.00,
                'bank_name' => 'NIC Asia Bank',
                'bank_account_no' => '5409823412345',
                'bank_branch' => 'Koteshwor Branch',
                'emergency_contact_name' => 'Rohan Thapa',
                'emergency_contact_phone' => '+977-9818899001',
                'emergency_contact_relation' => 'Spouse',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1004',
                'first_name' => 'Suman',
                'last_name' => 'Shrestha',
                'email' => 'suman.shrestha@gosika.com',
                'phone' => '+977-9849887766',
                'gender' => 'male',
                'date_of_birth' => '1996-03-30',
                'marital_status' => 'Single',
                'blood_group' => 'AB+',
                'permanent_address' => 'Bhaktapur-2, Durbar Square',
                'current_address' => 'Sallaghari, Bhaktapur',
                'department_id' => $deptTech->id,
                'designation_id' => $desDev->id,
                'employment_type' => 'full_time',
                'joining_date' => '2023-09-15',
                'basic_salary' => 85000.00,
                'bank_name' => 'Siddhartha Bank',
                'bank_account_no' => '0150998811223',
                'bank_branch' => 'Suryabinayak Branch',
                'emergency_contact_name' => 'Gita Shrestha',
                'emergency_contact_phone' => '+977-9841002233',
                'emergency_contact_relation' => 'Mother',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1005',
                'first_name' => 'Anjali',
                'last_name' => 'Khadka',
                'email' => 'anjali.khadka@gosika.com',
                'phone' => '+977-9808112244',
                'gender' => 'female',
                'date_of_birth' => '1995-12-05',
                'marital_status' => 'Single',
                'blood_group' => 'O-',
                'permanent_address' => 'Dharan-12, Sunsari',
                'current_address' => 'New Baneshwor, Kathmandu',
                'department_id' => $deptTech->id,
                'designation_id' => $desUi->id,
                'employment_type' => 'full_time',
                'joining_date' => '2024-01-10',
                'basic_salary' => 95000.00,
                'bank_name' => 'Sanima Bank',
                'bank_account_no' => '120098445511',
                'bank_branch' => 'Baneshwor Branch',
                'emergency_contact_name' => 'Deepak Khadka',
                'emergency_contact_phone' => '+977-9801239988',
                'emergency_contact_relation' => 'Brother',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1006',
                'first_name' => 'Ramesh',
                'last_name' => 'Karki',
                'email' => 'ramesh.karki@gosika.com',
                'phone' => '+977-9851123490',
                'gender' => 'male',
                'date_of_birth' => '1990-08-18',
                'marital_status' => 'Married',
                'blood_group' => 'A+',
                'permanent_address' => 'Biratnagar-3, Morang',
                'current_address' => 'Sinamangal, Kathmandu',
                'department_id' => $deptFin->id,
                'designation_id' => $desFin->id,
                'employment_type' => 'full_time',
                'joining_date' => '2023-04-01',
                'basic_salary' => 110000.00,
                'bank_name' => 'Nabil Bank Ltd',
                'bank_account_no' => '0120019900331',
                'bank_branch' => 'Sinamangal Branch',
                'emergency_contact_name' => 'Sarita Karki',
                'emergency_contact_phone' => '+977-9841556677',
                'emergency_contact_relation' => 'Spouse',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1007',
                'first_name' => 'Nisha',
                'last_name' => 'Poudel',
                'email' => 'nisha.poudel@gosika.com',
                'phone' => '+977-9860123789',
                'gender' => 'female',
                'date_of_birth' => '1997-02-14',
                'marital_status' => 'Single',
                'blood_group' => 'B+',
                'permanent_address' => 'Chitwan-2, Bharatpur',
                'current_address' => 'Maitighar, Kathmandu',
                'department_id' => $deptFin->id,
                'designation_id' => $desAcc->id,
                'employment_type' => 'full_time',
                'joining_date' => '2024-03-01',
                'basic_salary' => 65000.00,
                'bank_name' => 'Prabhu Bank',
                'bank_account_no' => '034011223344',
                'bank_branch' => 'Maitighar Branch',
                'emergency_contact_name' => 'Hari Poudel',
                'emergency_contact_phone' => '+977-9855012399',
                'emergency_contact_relation' => 'Father',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1008',
                'first_name' => 'Kritika',
                'last_name' => 'Bhandari',
                'email' => 'kritika.bhandari@gosika.com',
                'phone' => '+977-9843332211',
                'gender' => 'female',
                'date_of_birth' => '1992-11-28',
                'marital_status' => 'Married',
                'blood_group' => 'O+',
                'permanent_address' => 'Hetauda-5, Makwanpur',
                'current_address' => 'Thapathali, Kathmandu',
                'department_id' => $deptHR->id,
                'designation_id' => $desHrMgr->id,
                'employment_type' => 'full_time',
                'joining_date' => '2023-03-15',
                'basic_salary' => 95000.00,
                'bank_name' => 'Everest Bank',
                'bank_account_no' => '018099334412',
                'bank_branch' => 'Thapathali Branch',
                'emergency_contact_name' => 'Prabesh Bhandari',
                'emergency_contact_phone' => '+977-9802211334',
                'emergency_contact_relation' => 'Spouse',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1009',
                'first_name' => 'Dipen',
                'last_name' => 'Gurung',
                'email' => 'dipen.gurung@gosika.com',
                'phone' => '+977-9818776655',
                'gender' => 'male',
                'date_of_birth' => '1995-05-19',
                'marital_status' => 'Single',
                'blood_group' => 'AB+',
                'permanent_address' => 'Gorkha-6, Palungtar',
                'current_address' => 'Old Baneshwor, Kathmandu',
                'department_id' => $deptHR->id,
                'designation_id' => $desOffAdm->id,
                'employment_type' => 'full_time',
                'joining_date' => '2023-11-01',
                'basic_salary' => 55000.00,
                'bank_name' => 'Kumari Bank',
                'bank_account_no' => '04509988123',
                'bank_branch' => 'Baneshwor Branch',
                'emergency_contact_name' => 'Buddhi Gurung',
                'emergency_contact_phone' => '+977-9846011223',
                'emergency_contact_relation' => 'Father',
                'status' => 'active',
            ],
            [
                'employee_code' => 'GSK-EMP-1010',
                'first_name' => 'Srijana',
                'last_name' => 'Rana',
                'email' => 'srijana.rana@gosika.com',
                'phone' => '+977-9851239844',
                'gender' => 'female',
                'date_of_birth' => '1993-06-25',
                'marital_status' => 'Married',
                'blood_group' => 'A-',
                'permanent_address' => 'Nepalgunj-4, Banke',
                'current_address' => 'Sanepa, Lalitpur',
                'department_id' => $deptMkt->id,
                'designation_id' => $desProd->id,
                'employment_type' => 'full_time',
                'joining_date' => '2023-08-01',
                'basic_salary' => 105000.00,
                'bank_name' => 'Standard Chartered Bank Nepal',
                'bank_account_no' => '010299883344',
                'bank_branch' => 'Lazimpat Branch',
                'emergency_contact_name' => 'Kalyan Rana',
                'emergency_contact_phone' => '+977-9841887711',
                'emergency_contact_relation' => 'Spouse',
                'status' => 'active',
            ],
        ];

        $createdEmployees = [];
        foreach ($employeesData as $empData) {
            $createdEmployees[] = Employee::create($empData);
        }

        // Set department heads
        $deptExec->update(['head_employee_id' => $createdEmployees[0]->id]);
        $deptTech->update(['head_employee_id' => $createdEmployees[1]->id]);
        $deptFin->update(['head_employee_id' => $createdEmployees[5]->id]);
        $deptHR->update(['head_employee_id' => $createdEmployees[7]->id]);
        $deptMkt->update(['head_employee_id' => $createdEmployees[9]->id]);

        // 6. Employee ID Cards (CR80 standard)
        foreach ($createdEmployees as $emp) {
            EmployeeIdCard::create([
                'employee_id' => $emp->id,
                'card_number' => 'GSK-IDC-' . substr($emp->employee_code, -4) . '-V1',
                'template' => 'corporate_modern',
                'issue_date' => $emp->joining_date,
                'expiry_date' => Carbon::parse($emp->joining_date)->addYears(2),
                'qr_verification_token' => $emp->qr_token,
                'print_count' => 1,
                'status' => 'active',
            ]);
        }

        // 7. Holidays
        $holidays = [
            ['title' => 'Dashain Festival Break', 'start_date' => '2026-10-18', 'end_date' => '2026-10-24', 'total_days' => 7, 'type' => 'festival', 'description' => 'Official national Dashain holidays'],
            ['title' => 'Tihar Festival Break', 'start_date' => '2026-11-08', 'end_date' => '2026-11-12', 'total_days' => 5, 'type' => 'festival', 'description' => 'Laxmi Puja, Govardhan, and Bhai Tika'],
            ['title' => 'Constitution Day', 'start_date' => '2026-09-19', 'end_date' => '2026-09-19', 'total_days' => 1, 'type' => 'public', 'description' => 'National Constitution Day'],
            ['title' => 'Nepali New Year 2084', 'start_date' => '2027-04-14', 'end_date' => '2027-04-14', 'total_days' => 1, 'type' => 'festival', 'description' => 'Baisakh 1 holiday'],
        ];
        foreach ($holidays as $h) {
            Holiday::create($h);
        }

        // 8. Leave Types
        $ltAnnual = LeaveType::create(['name' => 'Annual Paid Leave', 'code' => 'ANN', 'max_days_per_year' => 18, 'is_paid' => true, 'description' => 'Earned annual paid time off']);
        $ltSick   = LeaveType::create(['name' => 'Medical / Sick Leave', 'code' => 'SCK', 'max_days_per_year' => 12, 'is_paid' => true, 'description' => 'Paid sick leave with medical proof']);
        $ltCasual = LeaveType::create(['name' => 'Casual / Urgent Leave', 'code' => 'CSL', 'max_days_per_year' => 6, 'is_paid' => true, 'description' => 'Short notice personal leave']);
        $ltUnpaid = LeaveType::create(['name' => 'Unpaid Leave of Absence', 'code' => 'LWP', 'max_days_per_year' => 30, 'is_paid' => false, 'description' => 'Extended leave without pay']);

        // Leave Requests
        LeaveRequest::create([
            'employee_id' => $createdEmployees[3]->id, // Suman Shrestha
            'leave_type_id' => $ltCasual->id,
            'start_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
            'end_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
            'total_days' => 2.0,
            'reason' => 'Family ceremony and urgent personal commitment',
            'status' => 'pending',
        ]);
        LeaveRequest::create([
            'employee_id' => $createdEmployees[4]->id, // Anjali Khadka
            'leave_type_id' => $ltSick->id,
            'start_date' => Carbon::now()->subDays(5)->format('Y-m-d'),
            'end_date' => Carbon::now()->subDays(4)->format('Y-m-d'),
            'total_days' => 2.0,
            'reason' => 'Viral fever and prescribed medical rest',
            'status' => 'approved',
            'admin_remarks' => 'Approved as per medical certificate',
            'reviewed_by' => $admin->id,
            'reviewed_at' => Carbon::now()->subDays(5),
        ]);

        // 9. Attendance for the last 5 days
        $today = Carbon::today();
        for ($i = 4; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i);
            // Skip weekends (Saturday in Nepal is weekend)
            if ($date->dayOfWeek === Carbon::SATURDAY) {
                continue;
            }
            foreach ($createdEmployees as $idx => $emp) {
                $status = 'present';
                $clockIn = '09:02:00';
                $clockOut = '17:35:00';
                $hours = 8.5;

                // Create realistic variations
                if ($i === 0 && $idx === 3) {
                    $status = 'late';
                    $clockIn = '09:42:00';
                    $clockOut = '18:10:00';
                    $hours = 8.4;
                } elseif ($i === 0 && $idx === 8) {
                    $status = 'half_day';
                    $clockIn = '09:00:00';
                    $clockOut = '13:05:00';
                    $hours = 4.0;
                } elseif ($idx === 4 && $i >= 4) {
                    $status = 'on_leave';
                    $clockIn = null;
                    $clockOut = null;
                    $hours = 0.0;
                }

                Attendance::updateOrCreate(
                    ['employee_id' => $emp->id, 'date' => $date->format('Y-m-d')],
                    [
                        'clock_in' => $clockIn,
                        'clock_out' => $clockOut,
                        'total_hours' => $hours,
                        'status' => $status,
                        'notes' => $status === 'late' ? 'Traffic congestion on Ring Road' : null,
                    ]
                );
            }
        }

        // 10. Payroll (Previous Month and Current Month)
        $prevMonth = Carbon::now()->subMonth();
        foreach ($createdEmployees as $emp) {
            $basic = $emp->basic_salary;
            $allowance = round($basic * 0.15, 2); // 15% allowance
            $bonus = 0.00;
            $gross = $basic + $allowance + $bonus;
            $tax = round($gross * 0.01, 2); // 1% tax TDS
            $pf = round($basic * 0.10, 2);  // 10% PF
            $totalDeductions = $tax + $pf;
            $net = $gross - $totalDeductions;

            Salary::create([
                'employee_id' => $emp->id,
                'month' => $prevMonth->month,
                'year' => $prevMonth->year,
                'salary_period' => $prevMonth->format('F Y'),
                'slip_number' => 'GSK-SLP-' . $prevMonth->format('Y-m') . '-' . substr($emp->employee_code, -4),
                'basic_salary' => $basic,
                'allowances' => $allowance,
                'bonuses' => $bonus,
                'gross_salary' => $gross,
                'tax_deduction' => $tax,
                'provident_fund' => $pf,
                'other_deductions' => 0.00,
                'total_deductions' => $totalDeductions,
                'net_salary' => $net,
                'payment_date' => $prevMonth->copy()->endOfMonth()->format('Y-m-d'),
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'NBL-SAL-' . rand(100000, 999999),
                'status' => 'paid',
                'generated_by' => $admin->id,
            ]);
        }

        // 11. Finance - Categories & Transactions (Separate from Marketplace)
        $incCatSoftware = IncomeCategory::create(['name' => 'Enterprise Software Solutions', 'code' => 'ESS', 'description' => 'Custom software engineering client fees']);
        $incCatConsult  = IncomeCategory::create(['name' => 'Cloud & IT Consulting', 'code' => 'CIT', 'description' => 'Infrastructure architecture and technical advisory']);
        $incCatSupport  = IncomeCategory::create(['name' => 'Annual SLA & Support Contracts', 'code' => 'SLA', 'description' => 'Post-deployment SLA maintenance retainers']);

        $expCatRent    = ExpenseCategory::create(['name' => 'Office Rent & Facilities', 'code' => 'ORF', 'monthly_budget' => 150000.00, 'description' => 'Commercial office lease & physical maintenance']);
        $expCatCloud   = ExpenseCategory::create(['name' => 'Cloud Infrastructure & SaaS', 'code' => 'CIS', 'monthly_budget' => 120000.00, 'description' => 'AWS, GCP, GitHub, Slack, Workspace licenses']);
        $expCatAsset   = ExpenseCategory::create(['name' => 'Hardware & Office Assets', 'code' => 'HOA', 'monthly_budget' => 200000.00, 'description' => 'Laptops, networking gear, desks, and monitors']);
        $expCatSnacks  = ExpenseCategory::create(['name' => 'Pantry & Employee Welfare', 'code' => 'PEW', 'monthly_budget' => 45000.00, 'description' => 'Coffee, snacks, team lunches, and water supplies']);
        $expCatUtility = ExpenseCategory::create(['name' => 'Utilities & Connectivity', 'code' => 'UAC', 'monthly_budget' => 35000.00, 'description' => 'High-speed dedicated leased line, electricity, water']);

        // Incomes
        $incomes = [
            [
                'income_number' => 'GSK-INC-2026-001',
                'title' => 'Milestone 2 Delivery: FinTech Core Banking API',
                'category_id' => $incCatSoftware->id,
                'amount' => 450000.00,
                'date' => Carbon::now()->subDays(18)->format('Y-m-d'),
                'payment_method' => 'bank_transfer',
                'payer' => 'Apex Financial Corporation',
                'reference_no' => 'SWIFT-APX-8921',
                'description' => 'Full sign-off and milestone 2 payment for banking microservices',
                'status' => 'completed',
                'created_by' => $admin->id,
            ],
            [
                'income_number' => 'GSK-INC-2026-002',
                'title' => 'Q4 Cloud Infrastructure Architecture & Security Audit',
                'category_id' => $incCatConsult->id,
                'amount' => 280000.00,
                'date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'payment_method' => 'bank_transfer',
                'payer' => 'Horizon Logistics Nepal',
                'reference_no' => 'NBL-TRF-45129',
                'description' => 'Comprehensive multi-region AWS cloud setup and security hardening',
                'status' => 'completed',
                'created_by' => $admin->id,
            ],
            [
                'income_number' => 'GSK-INC-2026-003',
                'title' => 'November 2026 Managed DevOps Retainer',
                'category_id' => $incCatSupport->id,
                'amount' => 195000.00,
                'date' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'payment_method' => 'bank_transfer',
                'payer' => 'Global Logistics Pvt. Ltd.',
                'reference_no' => 'GBIME-RET-1102',
                'description' => 'Monthly 24/7 server monitoring, backups, and DevOps support',
                'status' => 'completed',
                'created_by' => $admin->id,
            ],
        ];
        foreach ($incomes as $inc) {
            Income::create($inc);
        }

        // Expenses
        $expenses = [
            [
                'expense_number' => 'GSK-EXP-2026-001',
                'title' => 'Commercial Office Lease - November 2026',
                'category_id' => $expCatRent->id,
                'amount' => 135000.00,
                'date' => Carbon::now()->subDays(20)->format('Y-m-d'),
                'payee' => 'Corporate Tower Management',
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'RENT-NOV-2026',
                'description' => 'Monthly rental for 4th Floor corporate office premises',
                'notes' => 'Tax deducted at source (TDS 10%) deposited as per IRD guidelines',
                'status' => 'paid',
                'approved_by' => $admin->id,
            ],
            [
                'expense_number' => 'GSK-EXP-2026-002',
                'title' => 'AWS & Google Workspace Cloud Infrastructure Bill',
                'category_id' => $expCatCloud->id,
                'amount' => 78500.00,
                'date' => Carbon::now()->subDays(14)->format('Y-m-d'),
                'payee' => 'Amazon Web Services & Google Cloud',
                'payment_method' => 'card',
                'payment_reference' => 'CC-STDC-7712',
                'description' => 'Production cloud workloads, database clusters, and corporate email accounts',
                'notes' => 'Receipt stored in secure document drive',
                'status' => 'paid',
                'approved_by' => $admin->id,
            ],
            [
                'expense_number' => 'GSK-EXP-2026-003',
                'title' => 'Kantipur Telecom 100Mbps Leased Line Internet',
                'category_id' => $expCatUtility->id,
                'amount' => 24000.00,
                'date' => Carbon::now()->subDays(8)->format('Y-m-d'),
                'payee' => 'Kantipur Broadband Networks',
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'KBN-INV-9982',
                'description' => 'Dedicated symmetrical leased fiber line with 99.9% uptime SLA',
                'notes' => 'Paid on time',
                'status' => 'paid',
                'approved_by' => $admin->id,
            ],
            [
                'expense_number' => 'GSK-EXP-2026-004',
                'title' => 'Office Pantry Provisions & Premium Coffee Beans',
                'category_id' => $expCatSnacks->id,
                'amount' => 18600.00,
                'date' => Carbon::now()->subDays(4)->format('Y-m-d'),
                'payee' => 'Bhat-Bhateni Supermarket Tinkune',
                'payment_method' => 'cash',
                'payment_reference' => 'BBSM-RCPT-88219',
                'description' => 'Monthly pantry restock, green tea, whole roasted coffee beans, dairy, and fruits',
                'notes' => 'Verified by Office Administrator',
                'status' => 'paid',
                'approved_by' => $admin->id,
            ],
            [
                'expense_number' => 'GSK-EXP-2026-005',
                'title' => '2x Ergonomic High-Back Mesh Chairs for Tech Team',
                'category_id' => $expCatAsset->id,
                'amount' => 42000.00,
                'date' => Carbon::now()->subDays(1)->format('Y-m-d'),
                'payee' => 'Everest Furniture & Ergonomics',
                'payment_method' => 'bank_transfer',
                'payment_reference' => 'EFE-INV-3012',
                'description' => 'Procurement of lumbar supported ergonomic office task chairs',
                'notes' => 'Tagged in asset inventory register',
                'status' => 'paid',
                'approved_by' => $admin->id,
            ],
        ];
        foreach ($expenses as $exp) {
            Expense::create($exp);
        }

        // 12. Operations - Projects & Tasks
        $prj1 = Project::create([
            'code' => 'GSK-PRJ-01',
            'name' => 'GOSIKA Office Management Suite 2.0',
            'client_name' => 'Internal Operations',
            'description' => 'Full greenfield development of company management, HR, payroll, finance, and ID card engine',
            'start_date' => '2026-10-01',
            'end_date' => '2026-12-15',
            'budget' => 850000.00,
            'status' => 'active',
            'priority' => 'urgent',
            'progress_percentage' => 75,
            'created_by' => $admin->id,
        ]);

        $prj2 = Project::create([
            'code' => 'GSK-PRJ-02',
            'name' => 'Apex Cloud Banking Core Microservices',
            'client_name' => 'Apex Financial Corporation',
            'description' => 'Scalable microservices for client authorization, automated ledger reconciliations, and reporting',
            'start_date' => '2026-08-15',
            'end_date' => '2026-11-30',
            'budget' => 1400000.00,
            'status' => 'active',
            'priority' => 'high',
            'progress_percentage' => 88,
            'created_by' => $admin->id,
        ]);

        $prj3 = Project::create([
            'code' => 'GSK-PRJ-03',
            'name' => 'Corporate ISO 27001 Security Audit & Policies',
            'client_name' => 'GOSIKA Corporate Security',
            'description' => 'Comprehensive information security framework, access controls, and audit trails',
            'start_date' => '2026-11-01',
            'end_date' => '2027-01-31',
            'budget' => 300000.00,
            'status' => 'planning',
            'priority' => 'medium',
            'progress_percentage' => 20,
            'created_by' => $admin->id,
        ]);

        // Tasks across Kanban columns (todo, in_progress, review, completed)
        $tasks = [
            [
                'project_id' => $prj1->id,
                'assigned_to' => $createdEmployees[1]->id, // Bikash (CTO)
                'title' => 'Finalize CR80 ID Card Print & PDF Geometry',
                'description' => 'Ensure exact 85.60 mm x 53.98 mm physical dimensions and sharp vector QR rendering',
                'start_date' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'due_date' => Carbon::now()->addDays(1)->format('Y-m-d'),
                'priority' => 'urgent',
                'status' => 'in_progress',
                'progress_percentage' => 80,
                'created_by' => $admin->id,
            ],
            [
                'project_id' => $prj1->id,
                'assigned_to' => $createdEmployees[2]->id, // Pooja (Lead)
                'title' => 'Implement Attendance Matrix & Calendar Export',
                'description' => 'Provide instant monthly calendar views, filter by department, and export to Excel/PDF',
                'start_date' => Carbon::now()->subDays(4)->format('Y-m-d'),
                'due_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'priority' => 'high',
                'status' => 'in_progress',
                'progress_percentage' => 65,
                'created_by' => $admin->id,
            ],
            [
                'project_id' => $prj1->id,
                'assigned_to' => $createdEmployees[4]->id, // Anjali (UI/UX)
                'title' => 'Review GOSIKA Brand Color Alignment (#FF5500)',
                'description' => 'Verify badges, active nav pills, print typography, and high-contrast tables across all views',
                'start_date' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'due_date' => Carbon::now()->addDays(3)->format('Y-m-d'),
                'priority' => 'medium',
                'status' => 'review',
                'progress_percentage' => 90,
                'created_by' => $admin->id,
            ],
            [
                'project_id' => $prj1->id,
                'assigned_to' => $createdEmployees[3]->id, // Suman (Dev)
                'title' => 'Configure Database Transactions on Payroll Run',
                'description' => 'Ensure atomic batch creation of monthly salary slips with automated rollbacks on failure',
                'start_date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'due_date' => Carbon::now()->subDays(1)->format('Y-m-d'),
                'priority' => 'high',
                'status' => 'completed',
                'progress_percentage' => 100,
                'created_by' => $admin->id,
            ],
            [
                'project_id' => $prj2->id,
                'assigned_to' => $createdEmployees[3]->id, // Suman
                'title' => 'Apex API JWT Token Revocation & Refresh Flow',
                'description' => 'Implement distributed Redis blacklisting for revoked authentication tokens',
                'start_date' => Carbon::now()->format('Y-m-d'),
                'due_date' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'priority' => 'medium',
                'status' => 'todo',
                'progress_percentage' => 0,
                'created_by' => $admin->id,
            ],
            [
                'project_id' => $prj3->id,
                'assigned_to' => $createdEmployees[7]->id, // Kritika (HR Lead)
                'title' => 'Draft Corporate Data Privacy & Device Usage Policy',
                'description' => 'Complete clean document draft for BYOD and company hardware data classification',
                'start_date' => Carbon::now()->format('Y-m-d'),
                'due_date' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'priority' => 'low',
                'status' => 'todo',
                'progress_percentage' => 15,
                'created_by' => $admin->id,
            ],
        ];
        foreach ($tasks as $t) {
            Task::create($t);
        }

        // 13. Meetings
        $m1 = Meeting::create([
            'title' => 'Weekly Executive Leadership & Sprint Sync',
            'meeting_date' => Carbon::today()->addDays(1)->format('Y-m-d'),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'location_or_link' => 'Main Executive Boardroom (4th Floor) & Google Meet',
            'agenda' => "1. Review sprint progress on Office Management System\n2. Q4 Revenue targets\n3. Hardware asset procurement review",
            'status' => 'scheduled',
            'created_by' => $admin->id,
        ]);
        MeetingParticipant::create(['meeting_id' => $m1->id, 'employee_id' => $createdEmployees[0]->id, 'status' => 'invited']);
        MeetingParticipant::create(['meeting_id' => $m1->id, 'employee_id' => $createdEmployees[1]->id, 'status' => 'invited']);
        MeetingParticipant::create(['meeting_id' => $m1->id, 'employee_id' => $createdEmployees[5]->id, 'status' => 'invited']);
        MeetingParticipant::create(['meeting_id' => $m1->id, 'employee_id' => $createdEmployees[7]->id, 'status' => 'invited']);

        $m2 = Meeting::create([
            'title' => 'Monthly Financial Audit & Budget Reconciliation',
            'meeting_date' => Carbon::today()->addDays(4)->format('Y-m-d'),
            'start_time' => '14:30:00',
            'end_time' => '15:30:00',
            'location_or_link' => 'Conference Room B',
            'agenda' => "1. Verify monthly operating cash flow\n2. Audit expense receipts\n3. Tax deduction compliance",
            'status' => 'scheduled',
            'created_by' => $admin->id,
        ]);
        MeetingParticipant::create(['meeting_id' => $m2->id, 'employee_id' => $createdEmployees[5]->id, 'status' => 'invited']);
        MeetingParticipant::create(['meeting_id' => $m2->id, 'employee_id' => $createdEmployees[6]->id, 'status' => 'invited']);

        // 14. Announcements
        Announcement::create([
            'title' => 'Upcoming Tihar Festival Holidays Schedule',
            'content' => "Dear Team,\n\nThe company office will observe the annual Tihar festival holidays starting from November 8 through November 12. Normal business operations will resume on November 13.\n\nWishing all employees and their families a joyous and prosperous Tihar!",
            'priority' => 'important',
            'start_date' => Carbon::today()->subDays(1)->format('Y-m-d'),
            'end_date' => Carbon::today()->addDays(14)->format('Y-m-d'),
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        Announcement::create([
            'title' => 'New Office Asset & IT Hardware Verification Drive',
            'content' => "All team members with assigned company laptops, external monitors, and test devices are requested to present their equipment to the Office Administrator on Thursday for annual serial number auditing and physical condition checkup.",
            'priority' => 'normal',
            'start_date' => Carbon::today()->subDays(3)->format('Y-m-d'),
            'end_date' => Carbon::today()->addDays(5)->format('Y-m-d'),
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        // 15. Suppliers
        $supTech = Supplier::create([
            'name' => 'Himalayan Tech Hardware Solutions',
            'code' => 'GSK-SPL-01',
            'contact_person' => 'Sunil Shrestha',
            'email' => 'sales@himalayantech.com.np',
            'phone' => '+977-1-4229988',
            'address' => 'Putalisadak IT Market, Kathmandu',
            'tax_number' => '301982741',
            'products_or_services' => 'Dell, Apple, Lenovo enterprise laptops, server hardware, networking',
            'status' => 'active',
        ]);

        $supStat = Supplier::create([
            'name' => 'Kantipur Office Supplies & Stationery',
            'code' => 'GSK-SPL-02',
            'contact_person' => 'Gopal Maharjan',
            'email' => 'orders@kantipuroffice.com',
            'phone' => '+977-1-4781200',
            'address' => 'New Road, Kathmandu',
            'tax_number' => '601283944',
            'products_or_services' => 'Paper reams, toner cartridges, pens, binders, and office essentials',
            'status' => 'active',
        ]);

        $supFurn = Supplier::create([
            'name' => 'Everest Ergonomics & Furniture Mart',
            'code' => 'GSK-SPL-03',
            'contact_person' => 'Kabir Tuladhar',
            'email' => 'kabir@everestfurniture.com.np',
            'phone' => '+977-1-5544321',
            'address' => 'Kumaripati, Lalitpur',
            'tax_number' => '501928472',
            'products_or_services' => 'Ergonomic task chairs, motorized height-adjustable desks, file cabinets',
            'status' => 'active',
        ]);

        // 16. Assets
        $assets = [
            [
                'asset_code' => 'GSK-AST-1001',
                'name' => 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
                'category' => 'IT Equipment',
                'serial_number' => 'C02GX998MD6T',
                'supplier_id' => $supTech->id,
                'purchase_date' => '2024-02-10',
                'purchase_cost' => 465000.00,
                'warranty_expiry' => '2027-02-10',
                'condition' => 'good',
                'assigned_employee_id' => $createdEmployees[1]->id, // Bikash CTO
                'status' => 'in_use',
                'notes' => 'Primary development workstation for CTO',
            ],
            [
                'asset_code' => 'GSK-AST-1002',
                'name' => 'Dell XPS 15 9530 (i7-13700H / 32GB RAM / RTX 4060)',
                'category' => 'IT Equipment',
                'serial_number' => 'DELL-XPS-88129',
                'supplier_id' => $supTech->id,
                'purchase_date' => '2023-10-15',
                'purchase_cost' => 285000.00,
                'warranty_expiry' => '2026-10-15',
                'condition' => 'good',
                'assigned_employee_id' => $createdEmployees[2]->id, // Pooja Lead
                'status' => 'in_use',
                'notes' => 'Assigned for engineering lead tasks',
            ],
            [
                'asset_code' => 'GSK-AST-1003',
                'name' => 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
                'category' => 'IT Equipment',
                'serial_number' => 'CN-0K729Y-74261',
                'supplier_id' => $supTech->id,
                'purchase_date' => '2024-01-20',
                'purchase_cost' => 98000.00,
                'warranty_expiry' => '2027-01-20',
                'condition' => 'good',
                'assigned_employee_id' => $createdEmployees[4]->id, // Anjali UI
                'status' => 'in_use',
                'notes' => 'Calibrated 4K display for UI/UX design fidelity',
            ],
            [
                'asset_code' => 'GSK-AST-1004',
                'name' => 'HP LaserJet Pro MFP 4103fdw All-in-One Printer',
                'category' => 'Office Electronics',
                'serial_number' => 'VND8K99120',
                'supplier_id' => $supTech->id,
                'purchase_date' => '2023-04-12',
                'purchase_cost' => 115000.00,
                'warranty_expiry' => '2025-04-12',
                'condition' => 'good',
                'assigned_employee_id' => $createdEmployees[8]->id, // Dipen Admin
                'status' => 'in_use',
                'notes' => 'Central office document and salary slip printer',
            ],
            [
                'asset_code' => 'GSK-AST-1005',
                'name' => 'Cisco Catalyst 1000 Series 24-Port Gigabit Switch',
                'category' => 'Networking',
                'serial_number' => 'FOC2518W09L',
                'supplier_id' => $supTech->id,
                'purchase_date' => '2023-03-01',
                'purchase_cost' => 145000.00,
                'warranty_expiry' => '2028-03-01',
                'condition' => 'good',
                'assigned_employee_id' => null,
                'status' => 'in_use',
                'notes' => 'Server rack primary managed switch',
            ],
        ];
        foreach ($assets as $a) {
            $createdAsset = Asset::create($a);
            // Add a maintenance log for the printer
            if ($createdAsset->asset_code === 'GSK-AST-1004') {
                AssetMaintenance::create([
                    'asset_id' => $createdAsset->id,
                    'maintenance_date' => '2024-08-15',
                    'cost' => 3500.00,
                    'description' => 'Roller cleaning and replacement of black toner cartridge',
                    'service_provider' => 'HP Authorized Service Nepal',
                    'next_service_date' => '2025-02-15',
                    'status' => 'completed',
                ]);
            }
        }

        // 17. Inventory Items
        $invItems = [
            [
                'item_code' => 'GSK-INV-101',
                'name' => 'Double A A4 80GSM Copier Paper (500 Sheets/Ream)',
                'category' => 'Stationery',
                'quantity' => 24,
                'unit' => 'ream',
                'min_stock_threshold' => 10,
                'unit_price' => 650.00,
                'supplier_id' => $supStat->id,
                'location' => 'Storage Room A - Shelf 2',
                'notes' => 'Official letterhead and documentation paper',
            ],
            [
                'item_code' => 'GSK-INV-102',
                'name' => 'Uni-ball Eye Fine 0.7mm Rollerball Pens (Box of 12)',
                'category' => 'Stationery',
                'quantity' => 4, // LOW STOCK TRIGGER
                'unit' => 'box',
                'min_stock_threshold' => 5,
                'unit_price' => 1450.00,
                'supplier_id' => $supStat->id,
                'location' => 'Storage Room A - Shelf 1',
                'notes' => 'Low stock - reorder triggered',
            ],
            [
                'item_code' => 'GSK-INV-103',
                'name' => 'CR80 Blank PVC ID Card Blanks (Pack of 100)',
                'category' => 'Printing',
                'quantity' => 8,
                'unit' => 'pack',
                'min_stock_threshold' => 2,
                'unit_price' => 2800.00,
                'supplier_id' => $supStat->id,
                'location' => 'Admin Desk Cabinet',
                'notes' => 'For employee badge and ID card printing',
            ],
            [
                'item_code' => 'GSK-INV-104',
                'name' => 'Himalayan Organic Roasted Arabica Coffee Beans (1kg)',
                'category' => 'Pantry',
                'quantity' => 9,
                'unit' => 'pack',
                'min_stock_threshold' => 3,
                'unit_price' => 2200.00,
                'supplier_id' => null,
                'location' => 'Pantry Coffee Station',
                'notes' => 'Espresso machine coffee beans',
            ],
        ];
        foreach ($invItems as $item) {
            $createdItem = InventoryItem::create($item);
            InventoryTransaction::create([
                'inventory_item_id' => $createdItem->id,
                'type' => 'in',
                'quantity' => $createdItem->quantity,
                'balance_after' => $createdItem->quantity,
                'date' => Carbon::now()->subDays(15)->format('Y-m-d'),
                'reference_no' => 'INIT-STOCK-' . rand(100, 999),
                'notes' => 'Initial inventory ledger opening balance',
                'logged_by' => $admin->id,
            ]);
        }

        // 18. Documents
        Document::create([
            'document_number' => 'GSK-DOC-2023-001',
            'title' => 'Company Certificate of Incorporation',
            'category' => 'company',
            'file_path' => 'documents/company/certificate_of_incorporation.pdf',
            'file_name' => 'GOSIKA_Certificate_of_Incorporation.pdf',
            'file_type' => 'pdf',
            'file_size_kb' => 1420,
            'issue_date' => '2023-01-01',
            'status' => 'active',
            'notes' => 'Official government registration document under Company Act 2063',
            'uploaded_by' => $admin->id,
        ]);
        Document::create([
            'document_number' => 'GSK-DOC-2024-002',
            'title' => 'Inland Revenue Department PAN/VAT Registration Certificate',
            'category' => 'finance',
            'file_path' => 'documents/finance/pan_vat_certificate.pdf',
            'file_name' => 'PAN_VAT_Certificate_612093845.pdf',
            'file_type' => 'pdf',
            'file_size_kb' => 840,
            'issue_date' => '2023-01-15',
            'status' => 'active',
            'notes' => 'Tax registration certificate',
            'uploaded_by' => $admin->id,
        ]);
        Document::create([
            'document_number' => 'GSK-DOC-2024-003',
            'title' => 'GOSIKA Standard Employee NDA & IP Assignment Agreement',
            'category' => 'contract',
            'file_path' => 'documents/templates/employee_nda_template.pdf',
            'file_name' => 'Standard_Employee_NDA_Agreement_2024.pdf',
            'file_type' => 'pdf',
            'file_size_kb' => 320,
            'issue_date' => '2024-01-01',
            'status' => 'active',
            'notes' => 'Standard legal binding contract for all incoming staff',
            'uploaded_by' => $admin->id,
        ]);

        // 19. Notifications
        Notification::create([
            'user_id' => $admin->id,
            'type' => 'meeting',
            'title' => 'Upcoming Executive Sync Tomorrow',
            'message' => 'Executive Management & Sprint Sync scheduled for tomorrow at 10:00 AM.',
            'link' => '/meetings',
            'is_read' => false,
        ]);
        Notification::create([
            'user_id' => $admin->id,
            'type' => 'leave',
            'title' => 'New Leave Request Awaiting Review',
            'message' => 'Suman Shrestha applied for 2 days of Casual Leave.',
            'link' => '/leave-management',
            'is_read' => false,
        ]);
        Notification::create([
            'user_id' => $admin->id,
            'type' => 'inventory',
            'title' => 'Low Stock Warning: Uni-ball Pens Box',
            'message' => 'Quantity is at 4 boxes, which is below the minimum threshold of 5.',
            'link' => '/inventory',
            'is_read' => false,
        ]);
        Notification::create([
            'user_id' => $admin->id,
            'type' => 'payroll',
            'title' => 'Monthly Payroll Processing Window',
            'message' => 'November 2026 payroll calculation and salary slip generation is ready for preview.',
            'link' => '/payroll',
            'is_read' => false,
        ]);

        // 20. Audit Logs
        AuditLog::log('login', 'auth', $admin->id, 'Administrator logged in from IP 127.0.0.1');
        AuditLog::log('create', 'company_settings', $company->id, 'Initialized company profile and fiscal settings');
        AuditLog::log('create', 'employees', $createdEmployees[0]->id, 'Onboarded employee: Aarav Sharma (GSK-EMP-1001)');
        AuditLog::log('id_card_generate', 'employee_id_cards', 1, 'Generated CR80 ID Card for Aarav Sharma');
    }
}
