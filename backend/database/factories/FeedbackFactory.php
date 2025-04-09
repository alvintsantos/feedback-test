<?php

namespace Database\Factories;
use App\Models\Feedback;

use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'customer_name' => $this->faker->name,
            'rating' => $this->faker->numberBetween(1, 5),
            'happiness_level' => $this->faker->numberBetween(1, 5),
            'message' => $this->faker->realText(random_int(100, 500)),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
