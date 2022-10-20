<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_route_can_not_be_accessed()
    {
        $response = $this->followingRedirects()->post('api/auth/login');
        $response->assertStatus(400);
    }

    public function test_login_route_without_parameters()
    {
        $response = $this->postJson('api/auth/login');
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('email');
    }

    public function test_users_can_authenticate()
    {
        $user = User::factory()->create();

        $response = $this->postJson('api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
            'device_name' => 'pc',
        ]);


        $response->assertStatus(200);

        $this->assertEquals(
            $response->json('user'),
            $user->toArray()
        );

        $response->assertJson(fn(AssertableJson $json) => $json->has('user')->has('access_token'));

    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        $user = User::factory()->create();

        $response = $this->postJson('api/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
            'device_name' => 'pc',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('email');
    }

    public function test_users_can_not_authenticate_with_missing_device()
    {
        $user = User::factory()->create();

        $response = $this->postJson('api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('device_name');
    }
}
