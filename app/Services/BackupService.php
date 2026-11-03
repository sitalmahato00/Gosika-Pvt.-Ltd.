<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BackupService
{
    public function createSqlBackup(): string
    {
        $database = config('database.connections.mysql.database');
        $tables = DB::select('SHOW TABLES');
        $tableKey = "Tables_in_{$database}";

        $sqlContent = "-- GOSIKA Office Management System Database Backup\n";
        $sqlContent .= "-- Generated at: " . Carbon::now()->toIso8601String() . "\n";
        $sqlContent .= "-- Database: {$database}\n\n";
        $sqlContent .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

        foreach ($tables as $t) {
            $tableName = $t->$tableKey;
            
            // Get create table statement
            $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
            $sqlContent .= "-- Table structure for `{$tableName}`\n";
            $sqlContent .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
            $sqlContent .= $createTable[0]->{'Create Table'} . ";\n\n";

            // Get rows
            $rows = DB::table($tableName)->get();
            if ($rows->count() > 0) {
                $sqlContent .= "-- Dumping data for table `{$tableName}`\n";
                foreach ($rows as $row) {
                    $rowArray = (array) $row;
                    $values = array_map(function ($val) {
                        if (is_null($val)) {
                            return 'NULL';
                        }
                        return "'" . addslashes((string) $val) . "'";
                    }, array_values($rowArray));

                    $columns = array_map(function ($col) {
                        return "`{$col}`";
                    }, array_keys($rowArray));

                    $sqlContent .= "INSERT INTO `{$tableName}` (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ");\n";
                }
                $sqlContent .= "\n";
            }
        }

        $sqlContent .= "SET FOREIGN_KEY_CHECKS=1;\n";

        $fileName = 'backups/gosika_backup_' . Carbon::now()->format('Y_m_d_His') . '.sql';
        Storage::disk('local')->put($fileName, $sqlContent);

        return $fileName;
    }
}
