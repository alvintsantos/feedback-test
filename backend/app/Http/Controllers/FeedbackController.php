<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
class FeedbackController extends Controller
{
    public function index()
    {
        $validated = request()->validate([
            'rating' => 'nullable|integer|min:1|max:5',
            'happiness_level' => 'nullable|integer|min:1|max:5',
            'sort' => 'nullable|in:rating',
            'order' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $query = Feedback::query();

        if (isset($validated['rating'])) {
            $query->where('rating', $validated['rating']);
        }

        if (isset($validated['happiness_level'])) {
            $query->where('happiness_level', $validated['happiness_level']);
        }

        if (isset($validated['sort'])) {
            $order = $validated['order'] ?? 'desc';
            $query->orderBy('rating', $order);
        } else {
            // Default to sorting by created_at in descending order
            $query->orderBy('id', 'desc');
        }

        $perPage = $validated['per_page'] ?? 10;
        $feedbacks = $query->paginate($perPage);
        return response()->json($feedbacks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255|regex:/^[^0-9]*$/',
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'required|string|max:255|min:10',
            'happiness_level' => 'required|integer|min:1|max:5'
        ]);
        
        $feedback = Feedback::create($validated);
        
        return response()->json([
            'message' => 'Feedback submitted successfully',
            'data' => $feedback
        ], 201);
    }
}
