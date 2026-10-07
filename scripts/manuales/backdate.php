<?php
// Uso: php artisan tinker backdate.php (con DB_CONNECTION=sqlite apuntando a la BD de demo)
$map = json_decode(file_get_contents(getenv('BACKDATE_JSON')), true);
foreach ($map as $appt => $days) {
  $ws = DB::table('appointment')->where('appointment_id', $appt)->value('worker_schedule_id');
  $sch = DB::table('worker_schedule')->where('worker_schedule_id', $ws)->value('schedule_id');
  DB::table('schedule')->where('schedule_id', $sch)->update(['date' => now()->subDays($days)->toDateString()]);
}
echo "fechas movidas: " . count($map) . "\n";
