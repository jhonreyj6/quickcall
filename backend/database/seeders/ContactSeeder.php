<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [];

        for ($i = 0; $i < 15; $i++) {
            $data[] = [
                'user_id' => 12,
                'name' => fake()->name(),
                'phone_number' => fake()->phoneNumber(),
                'favorite' => rand(0, 2),
            ];
        }

        DB::table('contacts')->insert($data);
    }
}
