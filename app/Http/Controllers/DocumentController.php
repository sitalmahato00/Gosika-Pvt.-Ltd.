<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Employee;
use App\Models\Project;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->input('category');
        $search = $request->input('search');

        $query = Document::with(['employee', 'project', 'uploader']);

        if ($category) {
            $query->where('category', $category);
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%");
            });
        }

        $documents = $query->latest()->paginate(12)->withQueryString();
        $employees = Employee::where('status', 'active')->select('id', 'full_name', 'employee_code')->get();
        $projects = Project::select('id', 'name', 'code')->get();

        $stats = [
            'total' => Document::count(),
            'company' => Document::where('category', 'company')->count(),
            'contracts' => Document::where('category', 'contract')->count(),
            'employee' => Document::where('category', 'employee')->count(),
            'finance' => Document::where('category', 'finance')->count(),
        ];

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'employees' => $employees,
            'projects' => $projects,
            'stats' => $stats,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:company,employee,contract,agreement,finance,policy'],
            'employee_id' => ['nullable', 'exists:employees,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'file' => ['required', 'file', 'max:10240'], // 10MB limit
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileType = $file->getClientOriginalExtension();
        $fileSizeKb = round($file->getSize() / 1024);

        $path = $file->store("documents/{$validated['category']}", 'public');

        $lastId = Document::max('id') ?? 0;
        $docNumber = 'GSK-DOC-' . date('Y') . '-' . str_pad($lastId + 1, 3, '0', STR_PAD_LEFT);

        $document = Document::create([
            'document_number' => $docNumber,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'employee_id' => $validated['employee_id'] ?? null,
            'project_id' => $validated['project_id'] ?? null,
            'file_path' => $path,
            'file_name' => $fileName,
            'file_type' => $fileType,
            'file_size_kb' => $fileSizeKb,
            'issue_date' => $validated['issue_date'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'uploaded_by' => auth()->id(),
        ]);

        AuditLog::log('create', 'documents', $document->id, "Uploaded document: {$document->title} ({$docNumber})");

        return back()->with('success', 'Document archived successfully.');
    }

    public function download(Document $document)
    {
        AuditLog::log('export', 'documents', $document->id, "Downloaded document: {$document->title}");
        return Storage::disk('public')->download($document->file_path, $document->file_name);
    }

    public function destroy(Document $document)
    {
        $title = $document->title;
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        AuditLog::log('delete', 'documents', null, "Deleted document: {$title}");

        return back()->with('success', 'Document deleted.');
    }
}
