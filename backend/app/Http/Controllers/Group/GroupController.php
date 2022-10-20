<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use App\Http\Requests\Group\GroupRequest;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function update(GroupRequest $request, Group $group): JsonResponse
    {
        $validated = $request->validated();

        User::query()
            ->where('email', $validated['email'])
            ->update(['group_id' => $group->id]);

        return response()->json([
            'message' => 'Added user to group'
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {

        User::query()
            ->where('id',  $request->user()->id)
            ->update(['group_id' => null]);

        return response()->json([
            'message' => 'Group removed',
        ]);
    }
}
