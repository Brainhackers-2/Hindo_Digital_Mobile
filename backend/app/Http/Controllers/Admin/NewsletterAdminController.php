<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * Admin\NewsletterAdminController — Liste des abonnés newsletter
 * ============================================================
 */
class NewsletterAdminController extends Controller
{
    public function index(): JsonResponse
    {
        $abonnes = Newsletter::latest()->get();
        return response()->json(['success' => true, 'data' => $abonnes]);
    }
}
