<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AttendanceHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_calendar_summarizes_saved_attendance_by_date(): void
    {
        [$user, $employee] = $this->createAttendanceSetup();
        Attendance::create([
            'employee_id' => $employee->id,
            'date' => '2026-11-05',
            'status' => 'present',
            'total_hours' => 8.5,
        ]);
        $this->actingAs($user)
            ->get(route('attendance.calendar', ['month' => 11, 'year' => 2026]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('HR/Attendance/Calendar')
                ->where('daySummaries.2026-11-05.records', 1)
                ->where('daySummaries.2026-11-05.present', 1)
                ->where('daySummaries.2026-11-05.late', 0)
                ->where('leadingDays', 0)
            );
    }

    public function test_saved_attendance_history_can_be_viewed_and_corrected(): void
    {
        [$user, $employee] = $this->createAttendanceSetup();
        $attendance = Attendance::create([
            'employee_id' => $employee->id,
            'date' => '2026-11-05',
            'status' => 'present',
            'clock_in' => '09:00',
            'clock_out' => '17:00',
            'total_hours' => 8,
            'notes' => 'Original entry',
        ]);

        $this->actingAs($user)
            ->get(route('attendance.history', ['date' => '2026-11-05']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('HR/Attendance/History')
                ->where('selectedDate', '2026-11-05')
                ->where('stats.records', 1)
                ->where('attendances.0.id', $attendance->id)
            );

        $this->put(route('attendance.update', $attendance), [
            'status' => 'late',
            'clock_in' => '09:30',
            'clock_out' => '17:00',
            'total_hours' => 7.5,
            'notes' => 'Corrected entry',
        ])->assertRedirect();

        $this->assertDatabaseHas('attendances', [
            'id' => $attendance->id,
            'status' => 'late',
            'clock_in' => '09:30',
            'total_hours' => 7.5,
            'notes' => 'Corrected entry',
            'is_corrected' => true,
            'corrected_by' => $user->id,
        ]);
    }

    private function createAttendanceSetup(): array
    {
        $user = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $department = Department::create(['name' => 'Operations', 'code' => 'OPS']);
        $designation = $department->designations()->create(['title' => 'Staff', 'code' => 'STAFF']);
        $employee = Employee::create([
            'first_name' => 'Test',
            'last_name' => 'Employee',
            'email' => 'attendance@example.com',
            'phone' => '1234567890',
            'gender' => 'other',
            'department_id' => $department->id,
            'designation_id' => $designation->id,
            'employment_type' => 'full_time',
            'joining_date' => '2026-01-01',
            'status' => 'active',
        ]);

        return [$user, $employee];
    }
}
