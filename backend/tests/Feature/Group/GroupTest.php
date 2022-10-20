<?php

namespace Tests\Feature\Group;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_invite_users_to_group()
    {
        $this->seed();

        $userWithoutGroup = User::whereNull('group_id')->first();

        $usersWithGroup = User::whereNotNull('group_id')->limit(2)->get();

        $firstUserWithGroup = $usersWithGroup->first();
        $secondUserWithGroup = $usersWithGroup->last();

        $response = $this->postJson('api/auth/login', [
            'email' => $firstUserWithGroup->email,
            'password' => 'password',
            'device_name' => 'pc',
        ]);

        $firstUserToken = $response->json('access_token');

        $response = $this->withToken($firstUserToken)->postJson('api/group/' . $firstUserWithGroup->group_id, []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('email');

        $response = $this->withToken($firstUserToken)->postJson('api/group/' . $firstUserWithGroup->group_id, [
            'email' => $secondUserWithGroup->email,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('email');

        $response = $this->withToken($firstUserToken)->postJson('api/group/' . $firstUserWithGroup->group_id, [
            'email' => $userWithoutGroup->email,
        ]);

        $response->assertStatus(200);
        $this->assertSame('Added user to group', $response->json('message'));

        $userWithoutGroup->refresh();

        $this->assertSame($firstUserWithGroup->group_id, $userWithoutGroup->refresh()->group_id);
    }

    public function test_user_can_leave_group()
    {
        $this->seed();

        $user = User::whereNotNull('group_id')->first();

        $response = $this->postJson('api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
            'device_name' => 'pc',
        ]);

        $token = $response->json('access_token');

        $response = $this->withToken($token)->delete('api/group');

        $response->assertStatus(200);
        $this->assertSame('Group removed', $response->json('message'));

        $this->assertSame(null, $user->refresh()->group_id);
    }
}
