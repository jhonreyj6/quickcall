<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RecentSeeder extends Seeder
{
    public function run()
    {
        $data = [];

        for ($i = 0; $i < 15; $i++) {
            $data[] = [
                'user_id' => 12,
                'name' => fake()->name(),
                'phone_number' => fake()->phoneNumber(),
                'called_at' => fake()->dateTimeBetween('-30 days', 'now'),
                'call_type' => fake()->randomElement([0, 1, 2]),
            ];
        }

        DB::table('recents')->insert($data);
    }
}
