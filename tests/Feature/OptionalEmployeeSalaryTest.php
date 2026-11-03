<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\Salary;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OptionalEmployeeSalaryTest extends TestCase
{
    use RefreshDatabase;

    public function test_employee_can_be_created_without_a_salary(): void
    {
        [$user, $department, $designation] = $this->createEmployeeSetup();

        $response = $this->actingAs($user)->post(route('employees.store'), [
            'first_name' => 'No',
            'last_name' => 'Salary',
            'email' => 'no-salary@example.com',
            'phone' => '1234567890',
            'gender' => 'other',
            'department_id' => $department->id,
            'designation_id' => $designation->id,
            'employment_type' => 'full_time',
            'joining_date' => '2026-11-01',
            'basic_salary' => '',
            'status' => 'active',
        ]);

        $response->assertRedirect();
        $employee = Employee::where('email', 'no-salary@example.com')->firstOrFail();
        $this->assertNull($employee->basic_salary);
        $this->assertDatabaseHas('employee_id_cards', ['employee_id' => $employee->id]);
    }

    public function test_employee_salary_can_be_cleared(): void
    {
        [$user, $department, $designation] = $this->createEmployeeSetup();
        $employee = $this->createEmployee($department, $designation, 30000);

        $response = $this->actingAs($user)->put(route('employees.update', $employee), [
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'email' => $employee->email,
            'phone' => $employee->phone,
            'gender' => $employee->gender,
            'department_id' => $department->id,
            'designation_id' => $designation->id,
            'employment_type' => $employee->employment_type,
            'joining_date' => $employee->joining_date->format('Y-m-d'),
            'exit_date' => '',
            'exit_reason' => '',
            'basic_salary' => '',
            'status' => $employee->status,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'basic_salary' => null,
        ]);
    }

    public function test_monthly_payroll_skips_active_employees_without_a_salary(): void
    {
        [$user, $department, $designation] = $this->createEmployeeSetup();
        $withSalary = $this->createEmployee($department, $designation, 30000, 'paid@example.com');
        $withoutSalary = $this->createEmployee($department, $designation, null, 'unpaid@example.com');

        $response = $this->actingAs($user)->post(route('payroll.generate'), [
            'month' => 11,
            'year' => 2026,
            'tax_rate' => 0,
            'pf_rate' => 0,
            'allowance_percentage' => 0,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('salaries', ['employee_id' => $withSalary->id, 'month' => 11, 'year' => 2026]);
        $this->assertDatabaseMissing('salaries', ['employee_id' => $withoutSalary->id, 'month' => 11, 'year' => 2026]);
        $this->assertSame(1, Salary::where('month', 11)->where('year', 2026)->count());
    }

    private function createEmployeeSetup(): array
    {
        $user = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $department = Department::create(['name' => 'Operations', 'code' => 'OPS']);
        $designation = $department->designations()->create(['title' => 'Staff', 'code' => 'STAFF']);

        return [$user, $department, $designation];
    }

    private function createEmployee(Department $department, Designation $designation, ?float $salary, string $email = 'employee@example.com'): Employee
    {
        return Employee::create([
            'first_name' => 'Test',
            'last_name' => 'Employee',
            'email' => $email,
            'phone' => '1234567890',
            'gender' => 'other',
            'department_id' => $department->id,
            'designation_id' => $designation->id,
            'employment_type' => 'full_time',
            'joining_date' => '2026-01-01',
            'basic_salary' => $salary,
            'status' => 'active',
        ]);
    }
}
