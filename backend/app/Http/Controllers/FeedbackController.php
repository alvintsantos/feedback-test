<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
class FeedbackController extends Controller
{
    public function index()
    {
        $query = Feedback::query();

        if (request()->has('rating')) {
            $query->where('rating', request()->query('rating'));
        }

        if (request()->has('happiness_level')) {
            $query->where('happiness_level', request()->query('happiness_level'));
        }

        if (request()->has('sort')) {
            $order = request()->query('order', 'desc');
            $query->orderBy('rating', $order);
        } else {
            // Default to sorting by created_at in descending order
            $query->orderBy('id', 'desc');
        }

        $perPage = request()->query('per_page', 10);
        $feedbacks = $query->paginate($perPage);
        return response()->json($feedbacks);
    }

    public function store(Request $request)
    {
        $feedback = Feedback::create($request->all());
        return response()->json($feedback, 201);
    }
}
